<template>
  <div class="q-px-md q-py-xl">
    <div class="flex" style="max-width:350px;width:100%;margin-left:auto;margin-right:auto">
      <q-search inverted-light placeholder="Buscar por Placa" color="light" icon="motorcycle"
          class="no-shadow q-mx-md" upper-case clearable v-model.trim="buscar" @keydown ="buscarPlaca($event)" ref="inputFocus" >
      </q-search>
      <q-btn color="red" round icon="close" @click="limpiar" />
    </div>
    <div v-if="datos != null " class="q-my-md" style="max-width:600px;width:100%;margin-left:auto;margin-right:auto">
      <div class="row text-white">
        Placa: {{datos.placa}}
      </div>
      <div class="row text-white" v-if="hasOrden">
        Ultimo Kilometra: {{ultimoKm}}
      </div>
      <div class="row text-white" v-else>
        Ultimo Kilometra: No Registra
      </div>
      <div class="flex">
        <q-field dark class="text-white" label="Propietario: ">
          {{datos.persona.nombre}}
        </q-field>
        <q-field class="q-ml-md text-white" style="min-width:200px" dark label="Telefono: ">
            {{datos.persona.telefono}}
        </q-field>
        {{option}}
      </div>
    </div>
    
    <div v-if="datos != null" class="q-mt-lg" style="max-width:500px;width:100%;margin-left:auto;margin-right:auto">
      <q-field dark label="Kilometraje">
        <q-input style="margin-left:-100px" :maxlength="5" inverted-light v-model="kilometraje" type="text"  class="text-black"/>
      </q-field>

      <q-collapsible class="text-white" opened icon="motorcycle" label= "Servicios Solicitados" >
          <q-list link  >
             <q-item v-for="(solicitado, i) in listaServicios" :key="i" >
               <q-checkbox :val="solicitado.servicioTaller.id"  v-model="checkedSolicitados" :label="solicitado.servicioTaller.nombre" class="check-box"/>
             </q-item>
              
          </q-list>
        </q-collapsible>
        
        <q-input inverted-light float-label="Solicitudes" type="textarea" row="5" :max-height="100" class="full-width wrap " v-model.trim="solicitudes" style="resize: none;"/>

        <q-field dark label="Tecnico" class="q-mt-md">
          <q-select style="margin-left:-100px" v-model="tecnico" class="q-mx-md" :options="tecnicos" inverted-light/>
        </q-field>

        <q-field dark label="Fecha de entrega" class="q-mt-md">
          <q-datetime :min="new Date()" style="margin-left:-80px" class="q-mx-md" color="amber-7" v-model="fechaEntregaEstimada" type="datetime" inverted-light :modal="false"/>
        </q-field>

        <q-btn class="q-mt-xl" @click.native="beforeGuardar" v-if="true" color="primary">Guardar</q-btn>
        
    </div>

    <q-modal minimized :content-css="{minWidth: '30vw'}" ref="modalRef" @hide="closeModal">
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">Titulo</p>
        <q-field class="q-mt-lg" label="">
          <q-radio v-model="option" val="cambio" label="Cambio de Velocimetro"/>
        </q-field>
        <q-field class="q-mt-lg" label="">
          <q-radio v-model="option" val="reinicio" label="Reinicio"/>
        </q-field>
        <q-field class="q-mt-lg" label="">
          <q-radio v-model="option" val="0" label="Ninguna de las anteriores"/>
        </q-field>

        <div class="row q-pt-lg justify-center">
          <q-btn-group>
            <q-btn color="negative" label="guardar"/>
            <q-btn outline color="negative" label="cerrar" @click.native.stop="$refs.modalRef.hide()"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

    
  </div>
</template>

<script>
import { filter } from 'quasar'
import mapear from 'src/funciones/mapeo'
import validar from 'src/funciones/validar'
import { format } from 'quasar'
import http from 'src/funciones/http'
const { pad } = format

export default {
  data() {
    return {
      datos: null,
      kilometraje:null,
      checkedSolicitados:[],
      solicitudes:'',
      buscar:null,
      listaServicios:null,
      tecnicos:[],
      tecnico: null,
      fechaEntregaEstimada:null,
      vectorValidacion:[],
      //motoId: null,
      ultimoKm: 0,
      kmTotal : 0,
      hasOrden: false,
      option: 'null'
    }
  },
  beforeMount(){
    this.cargarTecnicos()
    //this.$refs.inputFocus.focus()
    //this.notificaciones(pad('2', 8))
  },
  mounted(){
    
  },
  methods:{
    notificaciones(mensaje){
      this.$q.notify({
      color: 'negative',
      position: 'top',
      message: mensaje,
      icon: 'report_problem'
      })
    },
    validacionNombre(event){
      validar.espacios(event,this.solicitudes)
    },
    limpiar(){
      this.buscar = null
      this.datos = null
      this.kilometraje = null
      this.solicitudes = ''
      this.checkedSolicitados = []
      this.tecnico = null
      this.fechaEntregaEstimada = null
      this.$refs.inputFocus.focus()
      this.option = null
      this.hasOrden = false
    }, 
    buscarPlaca(event){
      if(event.key === 'Enter'){
        http('moto/findOneByPlaca',{placa: this.buscar}, response =>{
          var result = JSON.parse(JSON.stringify(response.data.datos))
          if(result != null){
            http('ordenEntrada/inTaller',{motoId: result.id}, response => {
              if(response.data.datos.length == 0){
                this.datos = result
                if(this.datos.ordenEntradas.length > 0){
                  this.hasOrden = true
                  this.ultimoKm = this.datos.ordenEntradas[this.datos.ordenEntradas.length-1].kilometraje
                  this.kmTotal = this.datos.ordenEntradas[this.datos.ordenEntradas.length-1].kmTotal
                }else{
                  this.hasOrden = false
                  this.ultimoKm = 0
                  this.kmTotal = 0
                }
                this.cargarServicios()
                this.buscar = null
              }else{
                 this.notificaciones('La motocicleta se encuentra en el taller')
              }
            },e =>{
              this.notificaciones(e.message)
            })
          }else{
            this.notificaciones('NO se encontro coincidencias')
            this.limpiar()
          } 
          
          /*http('ordenEntrada/inTaller',{motoId: result.id}, response => {
            if(response.data.datos.length == 0){
              //this.datos = JSON.parse(JSON.stringify(response.data.datos))
              this.datos = result
              if(this.datos != null){  
                if(this.datos.ordenEntradas.length > 0){
                  this.hasOrden = true
                  this.ultimoKm = this.datos.ordenEntradas[this.datos.ordenEntradas.length-1].kilometraje
                  this.kmTotal = this.datos.ordenEntradas[this.datos.ordenEntradas.length-1].kmTotal
                }else{
                  this.hasOrden = false
                  this.ultimoKm = 0
                  this.kmTotal = 0
                }
                this.cargarServicios()
                this.buscar = null
              }else{
                this.notificaciones('NO se encontro coincidencias')
                this.limpiar()
              } 
            }else{
              this.notificaciones('La motocicleta se encuentra en el taller')
            }
          },e =>{
            this.notificaciones(e.message)
          })*/
            /*if(this.datos != null){  
              if(this.datos.ordenEntradas.length > 0){
                this.hasOrden = true
                this.ultimoKm = this.datos.ordenEntradas[this.datos.ordenEntradas.length-1].kilometraje
                this.kmTotal = this.datos.ordenEntradas[this.datos.ordenEntradas.length-1].kmTotal
              }else{
                this.hasOrden = false
                this.ultimoKm = 0
                this.kmTotal = 0
              }
              this.cargarServicios()
              this.buscar = null
            }else{
               this.notificaciones('NO se encontro coincidencias')
               this.limpiar()
            }*/
          },e =>{
            this.notificaciones(e.message)
          })
      }
    },
    closeModal(){
      if(this.option == 'cambio'){
        this.guardar(parseInt(this.kmTotal) + parseInt(this.kilometraje))
      }
      else if(this.option == 'reinicio'){
        var r = (99999 - parseInt(this.ultimoKm) + parseInt(this.kmTotal) + parseInt(this.kilometraje))
        console.log(r)
        //console.log(99999 - parseInt(this.ultimoKm))
        this.guardar(99999 - parseInt(this.ultimoKm) + parseInt(this.kmTotal) + parseInt(this.kilometraje))
      }
      else if(this.option == 0){
        console.log('no guardar cero')
        this.option = null
      }
      else{
        console.log('no guardar null')
        this.option = null
      }
    },
    beforeGuardar(){
      this.vectorValidacion=[]
      this.vectorValidacion.push(this.kilometraje, this.datos.id , this.tecnico, this.fechaEntregaEstimada)
      if(validar.campos(this.vectorValidacion) && (this.solicitudes.length > 0 || this.checkedSolicitados.length > 0)){
        if(this.hasOrden){
          if(this.ultimoKm > this.kilometraje){
              this.$refs.modalRef.show()
          }else{
            this.guardar(parseInt(this.kmTotal) - parseInt(this.ultimoKm) + parseInt(this.kilometraje))
          }
        }else{
            this.guardar(this.kilometraje)
        }
      }else{
        this.notificaciones("Debe llenar todos los campos")
      }  
    },
    guardar(total){
      //console.log(msg)
      console.log(total)
      //console.log(this.kmTotal)
      this.option = null
      
      
      //this.vectorValidacion=[]
      //this.vectorValidacion.push(this.kilometraje, this.datos.id , this.tecnico, this.fechaEntregaEstimada)
      
      //if(validar.campos(this.vectorValidacion) && (this.solicitudes.length > 0 || this.checkedSolicitados.length > 0)){

        var ruta = 'ordenEntrada/create'
        var datos = { id:0, fechaEntregaEstimada: this.fechaEntregaEstimada, kilometraje:this.kilometraje,
                      kmTotal: total , solicitudes: this.solicitudes, fechaSalida: null, motoId: this.datos.id, tecnicoId: this.tecnico }
        
        http(ruta, datos, response => {
          if(!response.data.error){
            console.log('guardo')
          }
          
          //this.notificaciones('Creada orden servicio # ' + response.data.datos.id)
          this.$q.notify({
            color: 'info',
            position: 'top',
            message:'Creada orden servicio # ' + response.data.datos.id,
            icon: 'report_problem'
          })
          ruta = 'ordenentrada/createServiciosSolicitados'
          datos = mapear.servicios(this.listaServicios,this.checkedSolicitados,response.data.datos.id) 
          this.limpiar()
          http(ruta, { lista: datos }, response => {
            //console.log(response.data.datos)
          },e => {
            this.notificaciones(e.message)
          })
        },e => {
          this.notificaciones(e.message)
        })
      
      /*}else{
        this.notificaciones("Debe llenar todos los campos")
      }*/
    },
    cargarServicios(){
      var ruta = 'tablamantenimiento/serviciosActivos'
      var datos = {tipoMoto: this.datos.tipo_motoId}
      http(ruta, datos, response => {
        this.listaServicios = response.data.datos
      },e =>{
        this.notificaciones(e.message)  
      })
    },
    cargarTecnicos(){
      //this.$refs.inputFocus.focus()
     const datos = {vector:[1,3]}
      http('persona/findAll',datos , response =>{
          this.tecnicos = mapear.persona(response.data.datos)
      },e =>{
          this.notificaciones(e.message)
      })
    },
  }
}

</script>

<style>
.content{
  background: white;
  padding: 24px;
  margin: 0 auto;
  max-width: 1110px;
  width: 100%;
  display: block;
}
.q-item-label{
  padding: 15px 0;
}
.no-pad{
  padding: 0 16px!important;
}
input {
  color: #000!important;
}
.check-box{
  font-size:12px;
  font-style:italic;
  padding: 1px;
  
}
.item{
  margin: 0px;
}
</style>