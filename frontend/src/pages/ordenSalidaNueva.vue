<template>
  <div class="q-px-md q-py-xl">
    <q-modal minimized :content-css="{minWidth: '50vw'}" ref="modalRef" >
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">Cancelar</p>
        <div class="row q-pa-lg justify-center text-bold q-headline ">Esta seguro de cancelar la orden</div>

        <div class="row q-pt-lg justify-center">
          
          <q-btn-group>
            <q-btn color="negative" label="aceptar" @click.native.stop="ok" />
            <q-btn outline color="negative" label="cancelar" @click.native.stop="no"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>
    <div v-if = "orden != 0 ">
    <!--<div class="flex" style="max-width:350px;width:100%;margin-left:auto;margin-right:auto">-->
      <div style="max-width:350px;width:100%;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px">
        <q-chip color="primary" style="margin-rigth: 0px;">
          {{n}}  
        </q-chip>
        <q-select style="max-width:250px;width:100%;margin: -20px auto" v-model="orden"  :options="ordenes"
           @input="selectedOrden" ref="selectOpen" >
        </q-select> 
      </div>
      
      <div class="row" style="padding-top: 50px;">  
        <div class="col-xs-12 col-sm-4 column inline">  
          <q-item class="text-white">
            <q-item-main :label="numero">
              <q-item-tile label style="padding: 5px 0px;" >Fecha Ingreso: {{fechaIngreso}} </q-item-tile>
              <q-item-tile label style="padding: 5px 0px;" >Fecha Entrega: {{fechaSalida}}</q-item-tile>
              <q-item-tile label style="padding: 5px 0px;" >Tecnico: {{dato.tecnico.nombre}}</q-item-tile>
            </q-item-main>
          </q-item>
        </div>
        <div class="col-xs-12 col-sm-3 column inline">
          <q-item class="text-white">
            <q-item-main label="Motocicleta">
              <q-item-tile label style="padding: 5px 0px;" >Placa: {{dato.moto.placa}}</q-item-tile>
              <q-item-tile label style="padding: 5px 0px;" >Referencia: {{tipoMoto}}</q-item-tile>
              <q-item-tile label style="padding: 5px 0px;" >Kilometraje: {{kilometraje}}</q-item-tile>
            </q-item-main>
          </q-item>
        </div>  
        <div class="col-xs-12 col-sm-4 column inline">  
          <q-item class="text-white">
            <q-item-main label="Propietario">
              <q-item-tile label style="padding: 5px 0px;" >Nombre: {{dato.moto.persona.nombre}}</q-item-tile>
              <q-item-tile label style="padding: 5px 0px;" >Cedula: {{dato.moto.persona.identificacion}}</q-item-tile>
              <q-item-tile label style="padding: 5px 0px;" >Telefono: {{dato.moto.persona.telefono}}</q-item-tile>
            </q-item-main>
          </q-item>
        </div>
      </div>

      <div class="row text-white" >
        <div class="col-xs-12 col-sm-6 column inline">
          <q-collapsible opened avatar="/statics/icon-moto.svg" label= "Servicios Solicitados" >
            <q-list link  >
              <q-item v-for="(solicitado, i) in listaServicios" :key="i"  >
                <q-checkbox disable :val="solicitado.servicioTaller.id"  v-model="checkedSolicitados" :label="solicitado.servicioTaller.nombre" class="check-box"/>
              </q-item>
            </q-list>
          </q-collapsible>
          <textarea readonly style="margin: 0px 14px;" class="" v-model="dato.solicitudes" ></textarea>
          <q-input v-model="dato.costoServicio" style="margin: 10px 14px;" type="number" suffix="$"  float-label="Costo Servicio" @keydown ="validacionNumeros($event, dato.costoServicio)"/>
          <q-input v-model="dato.costoRepuestos" style="margin: 10px 14px;" type="number" suffix="$" float-label="Costo Repuestos" @input="zero('repuestos')" @keydown ="validacionNombre($event)" />
          <q-field class="q-mt-xs" label="Total $">
            {{total}}
          </q-field>
        </div>
      <div class="col-xs-12 col-sm-6 column inline">
        <q-collapsible opened avatar="/statics/icon-moto.svg" label= "Servicios Realizados">
          <q-list link>
             <q-item v-for="(realizado, i) in listaServicios" :key="i" >
               <q-checkbox  :val="realizado.servicioTaller.id"  v-model="checkedRealizados" :label="realizado.servicioTaller.nombre" class="check-box"/>
             </q-item>
          </q-list>
        </q-collapsible>
        <!--<textarea style="margin: 0px 14px;"  v-model="observaciones" @keydown ="validacionNombre($event)"></textarea>-->
        <textarea style="margin: 0px 14px;"  v-model.trim="dato.observaciones" @keydown ="validacionNombre($event)"></textarea>
      </div>
      </div>   
        <q-btn  @click.native="guardar" v-if="dato.id != null" color="primary">Guardar</q-btn>
        <q-btn  @click.native="cancelar" v-if="dato.id != null" color="primary">Cancelar</q-btn>
      </div>
    
    <div v-else class="text-white">
       <div style="max-width:650px;width:100%;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px">
        <h4 style="text-align:center">No hay Ordenes Servicios Pendientes</h4> 
      </div>  
    </div>
  </div>
  
</template>

<script>
import { filter } from 'quasar'
import { LocalStorage, SessionStorage } from 'quasar'
import mapear from 'src/funciones/mapeo'
import validar from 'src/funciones/validar'
import { format } from 'quasar'
import http from 'src/funciones/http'
//import Vuex,{ mapActions } from 'vuex'
const { pad } = format
//import audio from 'src/statics/ctrain.wav'


export default{
  data(){
    return{
      n:0,
      //item: null,
      numero: 'Orden#',
      select: null,
      listaOrden: null,
      listaSolicitados:[],
      orden: 0,
      ordenes: [],
      estado: 'Iniciado',
      datos: null,
      dato:{
        id: null,
        fechaIngreso: null,
        fechaEntregaEstimada: null,
        kilometraje: null,
        kmTotal: null,
        solicitudes: null,
        fechaSalida: null,
        observaciones: null,
        costoServicio: 0,
        costoRepuestos: 0,
        estado: null,
        motoId: null,
        tecnicoId: null,
        tecnico:{
          nombre: null,
        },
        moto:{
          placa: null,
          persona:{
            identificacion: null,
            nombre: null,
            telefono: null
          },
          tipo_moto:{
            referencia: null,
            marca:{
              nombre: null
            }
          }
        }  
      },
      checkedSolicitados:[],
      checkedRealizados:[],
      listaServicios:null
    }
  },
  beforeMount(){
    this.cargarOrdenes()
  },
  computed:{
    fechaIngreso: function(){
      if(this.dato.fechaIngreso != null){
        return this.$moment(this.dato.fechaIngreso).format("DD[/]MM[/]YYYY  hh:mm:ss a")
      }else{
        return ' '
      }
    },
    fechaSalida: function(){
      if(this.dato.fechaEntregaEstimada != null){
        return this.$moment(this.dato.fechaEntregaEstimada).format("DD[/]MM[/]YYYY  hh:mm:ss a")
      }else{
        return ' '
      }
    },
    tipoMoto: function () {
     if (this.dato.moto.tipo_moto.marca.nombre != null){
        return this.dato.moto.tipo_moto.marca.nombre +"  "+this.dato.moto.tipo_moto.referencia
     }
    },
    kilometraje: function () {
     if (this.dato.kilometraje != null){
        return this.dato.kilometraje +" Kms"
     }
    },
    total: function () {
      return (this.dato.costoServicio + this.dato.costoRepuestos)
    },
     //...Vuex.mapState(['lista','color','mensaje','count','countOld','cantidad']),
  },
  methods:{
    //...Vuex.mapMutations(['llenarLista']),
    /*...Vuex.mapMutations({
      llenarLista : 'llenarLista',
      mostrar: 'mostrar'
    }),
    //...Vuex.mapActions(['peticion']),
    ...Vuex.mapActions({
    peticion: 'peticion'
  }),*/
    ok(){
      http('ordenEntrada/update', {id:this.dato.id, estado: 'Cancelado', fechaSalida: new Date()}, response =>{
        this.limpiarDatos()
        this.cargarOrdenes()
        this.$refs.modalRef.hide()
       },e =>{
           this.notificaciones(e.message)
       })
    },
    no(){
      this.$refs.modalRef.hide()
    },
    notificaciones(mensaje){
      this.$q.notify({
        color: 'negative',
        position: 'top',
        message: mensaje,
        icon: 'report_problem'
      })
    },
    zero(i){
      /*console.log(this.dato.costoRepuestos)
      if(i == 'servicios' && this.dato.costoServicio == null){
        this.dato.costoServicio = 0
      }
      if(i == 'repuestos' && this.dato.costoRepuestos == null){
        this.dato.costoRepuestos = 0
      }*/
    },
    limpiarDatos(){
      this.numero = 'Orden#'
      this.checkedSolicitados = []
      this.checkedRealizados = 
      this.dato={
        id: null,
        fechaIngreso: null,
        fechaEntregaEstimada: null,
        kilometraje: null,
        kmTotal: null,
        solicitudes: null,
        fechaSalida: null,
        observaciones: null,
        costoServicio: 0,
        costoRepuestos: 0,
        estado: null,
        motoId: null,
        tecnicoId: null,
        tecnico:{
          nombre: null,
        },
        moto:{
          placa: null,
          persona:{
            identificacion: null,
            nombre: null,
            telefono: null
          },
          tipo_moto:{
            referencia: null,
            marca:{
              nombre: null
            }
          }
        }  
      }
    },
    cargarDatos(obj){
      this.listaOrden.forEach(item => {
        if(item.id == obj){
          this.dato = JSON.parse(JSON.stringify(item))
          this.numero = "Orden# " + (item.id.toString()).padStart(6,"000000")
          this.cargarServicios()
          return
        }
      })
    },
    selectedOrden(obj){
      if(obj != 0){
        this.cargarDatos(obj)
      }
    },
    cargarOrdenes(){
      var ruta = 'ordenentrada/findAllIniciado'
      var datos = { estado:'Iniciado'}
      http(ruta, datos, response => {
        if(response.data.datos.length > 0){
           this.listaOrden = response.data.datos
           this.n = this.listaOrden.length
           this.ordenes = mapear.orden(response.data.datos)
           this.orden = JSON.parse(JSON.stringify(this.ordenes[0].value))
           this.cargarDatos(this.orden)
        }else{
          this.listaOrden = []
          this.n = 0
          this.ordenes = []
          this.ordenes.push({value:0,label:' '})
          this.orden = 0
          this.limpiarDatos()
        }
      },e => {
        this.notificaciones(e.message)
      })
    },
    cargarServicios(){
     this.$axios.post('http://localhost:8080/servicios/findAllByOrden',{ordenId: this.orden}).then(res =>{
        this.checkedRealizados = []
        this.checkedSolicitados = []
        this.listaServicios = res.data.datos
          if(this.listaServicios.length > 0){
            this.listaServicios.forEach(item => {
              if(item.solicitados){
                this.checkedSolicitados.push(item.servicioId)
              }
              if(item.realizados){
                this.checkedRealizados.push(item.servicioId)
              }
            })
          }
      }).catch((e) => {
         this.notificaciones(e.message)
      })
    },
    validacionNombre(event){
      //validar.espacios(event,this.solicitudes)
    },
    validacionNumeros(event, dato){
      /*if(event.keyCode >= 48 && event.keyCode <= 57){
        console.log('keyCode: ' + event.keyCode)
      }else{
        console.log('keyCode: ' + event.keyCode)
      }
      //console.log(dato.toString().length)
      //console.log(typeof event.keyCode)
      //console.log('keyCode: ' + event.keyCode)
      //var x = validar.numeros(event)
      //console.log(x)
      //validar.espacios(event,this.solicitudes)*/
    },
    guardar(){
      var datos = { id:this.dato.id, observaciones: this.dato.observaciones, fechaSalida: new Date(),
                    costoServicio: this.dato.costoServicio, costoRepuestos: this.dato.costoRepuestos, estado:'Finalizado' }
      
      if((this.checkedRealizados.length > 0 || this.dato.observaciones) && (this.dato.costoServicio || this.dato.costoRepuestos) ){
        http('ordenEntrada/update', datos, response =>{
          this.checkedRealizados.forEach(item => {
          datos = {ordenId: this.dato.id,realizados: 1, servicioId: item}
          http('ordenEntrada/insertServicios', datos, result =>{
          },e =>{
            this.notificaciones(e.message)
          })
      })
        this.limpiarDatos()
        this.cargarOrdenes()
      },e =>{
        this.notificaciones(e.message)
      })
      }else{
        this.notificaciones('Completar la informacion')
      }
    },
    cancelar(){
      this.$refs.modalRef.show()
    }
  }
}

</script>

<style scoped>
.content{
  background: white;
  padding: 24px;
  margin: 0 auto;
  max-width: 1110px;
  width: 100%;
  display: block;
}
.q-item-label{
  padding: 5px 0;
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