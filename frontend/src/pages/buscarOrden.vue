<template>
  <div class="q-px-md q-py-xl">
    <div v-if = "true"> 
      
      <div class="row">
        {{idOrden}}
        <div class="col-xs-12 col-sm-5 column inline q-mr-lg">
          <q-select  float-label="Estado Orden" class="q-my-xs q-ml-xl text-black" v-model="estado"  :options="estados" ></q-select>
          
          <div class="row">
            <!--<div class="col-xs-12 col-sm-1 column inline">
             <q-btn color="red" style="margin-top:auto;margin-bottom:auto;" round icon="clear" @click.native="clear('ingreso')"/>
            </div>-->
            <div class="col-xs-12 col-sm-6 column inline">
              <q-datetime clearable :min="minIngreso" :max="maxIngreso" float-label="Fecha Ingreso Desde" class="q-ma-xs" 
                  color="primary" v-model="fechaIngreso" @input="dateIngreso()" type="datetime" 
                  inverted-light :modal="false" @clear="c"
                  />
            </div>
            <div class="col-xs-12 col-sm-1 column inline" color="white">
            </div>  
            <div class="col-xs-12 col-sm-5 column inline">
              <q-datetime :min="minFechaIngresoFin" :max="maxFechaIngresoFin" float-label="Hasta" class="q-ma-xs" color="amber-7" v-model="fechaIngresoFin" @input="dateSalida()" type="datetime" inverted-light :modal="false"/>
            </div>
          </div>
          
          <div class="row" v-if="estado == 'Finalizado'">
            <div class="col-xs-12 col-sm-1 column inline">
             <q-btn color="red" style="margin-top:auto;margin-bottom:auto;" round icon="clear" @click.native="clear('salida')"/>
            </div>
            <div class="col-xs-12 col-sm-5 column inline">
              <q-datetime float-label="Fecha Salida Desde" class="q-ma-xs" color="amber-7" v-model="fechaSalida" @input="dateSalida()" type="datetime" inverted-light :modal="false"/>
            </div>
            <div class="col-xs-12 col-sm-1 column inline" color="white">
            </div>  
            <div class="col-xs-12 col-sm-5 column inline">
              <q-datetime float-label="Hasta" class="q-ma-xs" color="amber-7" v-model="fechaSalidaFin"  type="datetime" inverted-light :modal="false"/>
            </div>
          </div>
        </div>
        
        <div class="col-xs-12 col-sm-5 column inline q-mr-lg">
          <q-field dark label="Orden">
            <q-input class="q-my-xs text-black" clearable inverted-light v-model="idOrden" type="number" @keyup ="zero($event)" />
          </q-field>
          <q-field dark label="Placa">
            <q-input class="q-my-xs text-black" clearable inverted-light v-model.trim="placa" type="text" />
          </q-field>
          <q-field dark label="Cedula">
            <q-input  class="q-my-xs text-black"  inverted-light v-model.trim="identificacion" type="text" />
          </q-field>
          <q-field dark label="Tecnico">
            <q-select class="q-my-xs text-black" v-model="tecnico"  :options="tecnicos"></q-select>
          </q-field>
        </div>
         <div class="col-xs-12 col-sm-5 offset-4 column inline q-mt-xs">
            <q-btn  @click.native="buscarOrden"  color="primary">Buscar</q-btn>  
         </div>  
      </div>
    <!--<div class="flex" style="max-width:350px;width:100%;margin-left:auto;margin-right:auto">-->
      <div style="max-width:650px;width:100%;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px">
       <q-chip color="primary" style="margin:auto;">
          {{n}}  
        </q-chip>
        <!--<q-select style="max-width:250px;width:100%;margin: -20px auto" v-model="estado"  :options="estados"
           @input="selectedEstados">
        </q-select>-->
        <q-select style="max-width:250px;width:100%;margin: 30px auto" v-model="orden"  :options="ordenes"
           @input="selectedOrden" ref="selectOpen" >
        </q-select> 
      </div>
      <!--<q-search inverted-light placeholder="Buscar por Placa" color="light" 
          class="no-shadow q-mx-md" v-model="buscar" @keydown ="buscarPlaca($event)" >
      </q-search>
      <q-btn color="primary" round icon="close"/>
    </div>-->
   
    <div class="row" style="padding-top: 50px;">  
      <div class="col-xs-12 col-sm-4 column inline">  
        <q-item class="text-white">
          <q-item-main :label="numero">
            <q-item-tile label style="padding: 5px 0px;" >Fecha Ingreso: {{dato.fechaIngreso}}</q-item-tile>
            <q-item-tile label style="padding: 5px 0px;" >Fecha Entrega: {{dato.fechaSalida}}</q-item-tile>
            <q-item-tile label style="padding: 5px 0px;" >Tecnico: {{dato.tecnico.nombre}}</q-item-tile>
          </q-item-main>
        </q-item>
      </div>
      <div class="col-xs-12 col-sm-3 column inline">
        <q-item class="text-white">
          <q-item-main label="Motocicleta">
            <q-item-tile label style="padding: 5px 0px;" >Placa: {{dato.moto.placa}}</q-item-tile>
            <q-item-tile label style="padding: 5px 0px;" >Referencia: {{dato.moto.tipo_moto.referencia}}</q-item-tile>
            <q-item-tile label style="padding: 5px 0px;" >Kilometraje: {{dato.kilometraje}}</q-item-tile>
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
       <!-- <q-list link v-if="true" >
          <q-item v-for="(item, i) in dato.ordenEntrada.solicitudes.text" :key="i"  >
              <textarea style="margin: 0px 14px;"  class="width: 80%" v-model="item.text" ></textarea>
              <q-btn color="red" style="margin-top:auto;margin-bottom:auto;" round icon="close" @click.native="clear(i)"/>
             </q-item>
        </q-list>-->
        <textarea readonly style="margin: 0px 14px;" class="" v-model="dato.solicitudes"></textarea>
        <q-input readonly v-model="dato.costoServicio" style="margin: 10px 14px;" type="number" suffix="$"  float-label="Costo Servicio" />
        <q-input readonly v-model="dato.costoRepuestos" style="margin: 10px 14px;" type="number" suffix="$" float-label="Costo Repuestos" />
        <q-field class="q-mt-xs" label="Total $">
          {{total}}
        </q-field>
      </div>
      <div class="col-xs-12 col-sm-6 column inline">
        <q-collapsible opened avatar="/statics/icon-moto.svg" label= "Servicios Realizados">
          <q-list link v-if="true">
             <q-item v-for="(realizado, i) in listaServicios" :key="i" >
               <q-checkbox disable :val="realizado.servicioTaller.id"  v-model="checkedRealizados" :label="realizado.servicioTaller.nombre" class="check-box"/>
             </q-item>
          </q-list>
        </q-collapsible>
        <textarea readonly style="margin: 0px 14px;" class="" v-model="dato.observaciones" ></textarea>
        <!--<q-list link v-if="solicitudes.length > 0" >
          <q-item v-for="(item, i) in solicitudes" :key="i"  >
              <textarea style="margin: 0px 14px;"  class="width: 80%" v-model="item.text" ></textarea>
              <q-btn color="red" style="margin-top:auto;margin-bottom:auto;" round icon="close" @click.native="clear(i)"/>
             </q-item>
        </q-list>-->
        
      </div>
    </div>   
    <q-btn class="" @click.native="guardar" v-if="dato.id != null" color="primary">Guardar</q-btn>
    <q-btn class="" @click.native="cancelar" v-if="dato.id != null" color="primary">Cancelar</q-btn>
    
    

    

    
    
    
    
    <!--<div v-if="datos != null" class="q-mt-lg" style="max-width:500px;width:100%;margin-left:auto;margin-right:auto">
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

        <q-input inverted-light float-label="Solicitudes" type="textarea" row="5" :max-height="100" class="full-width wrap " v-model="solicitudes" style="resize: none;"/>

        <q-field dark label="Tecnico" class="q-mt-md">
          <q-select style="margin-left:-100px" v-model="tecnico" class="q-mx-md" :options="tecnicos" inverted-light/>
        </q-field>

        <q-field dark label="Fecha de entrega" class="q-mt-md">
          <q-datetime style="margin-left:-80px" class="q-mx-md" color="amber-7" v-model="hora" type="datetime" inverted-light :modal="false"/>
        </q-field>

        <q-btn class="q-mt-xl" @click.native="guardar" v-if="true" color="primary">Guardar</q-btn>
    </div>-->

    </div>
    <div v-else class="text-white">
        No hay ordenes disponibles
    </div>
  </div>
</template>

<script>
import { filter } from 'quasar'
import mapear from 'src/funciones/mapeo'
import validar from 'src/funciones/validar'
import { format } from 'quasar'
import http from 'src/funciones/http'
const { pad } = format


export default{
  data(){
    return{
      estados:[
        {
          label: 'Iniciado',
          value: 'Iniciado'
        }, 
        {
          label: 'Finalizado',
          value: 'Finalizado'
        }, 
        {
          label: 'Cancelado' ,
          value: 'Cancelado'
        } 
      ],
      n:0,
      //ta: 0,
      item:{
        text: null,
      },
      model: null,
      //item: null,
      numero: 'Orden#',
      select: null,
      listaOrden: null,
      listaSolicitados:[],
      orden: null,
      ordenes: [],
      estado: 'Finalizado',
      costoServicio: 0,
      costoRepuestos: 0,
      listaMarcas:[],
      datos: null,
      dato:{
        id: null,
        fechaIngreso: null,
        fechaEntregaEstimada: null,
        kilometraje: null,
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
        
    
      fechaSalida: null,
      fechaSalidaFin: null,
      fechaIngreso: null,
      fechaIngresoFin: null,
      tecnico: null,
      tecnicos:[],
      identificacion: null,
      placa: null,
      rankFechaSalida:[],
      fechaSalida1: null,
      fechaIngreso1: null,
      idOrden: null,
      
      
      
      horaActual: new Date(),
      kilometraje:null,
      checkedSolicitados:[],
      checkedRealizados:[],
      //solicitudes:"",
      respuestas:"",
      observaciones: null,
      propietario:null,
      buscar:null,
      listaServicios:null,
      tecnicos:[],
      tecnico: null,
      hora:null,
      vectorValidacion:[]  
   }
  },
  beforeMount(){
    this.cargarTecnicos()
    
    //this.notificaciones(pad('2', 8))
  },
  computed:{
    minIngreso: function (){
      if(this.fechaIngreso == null){
        return 0
      }
    },
    maxFechaIngresoFin: function (){
      if(this.fechaIngreso != null){
        return new Date 
      }
    },
    minFechaIngresoFin: function (){
      if(this.fechaIngreso != null){
        return this.fechaIngreso
      }
    },
    maxIngreso: function (){
      if(this.fechaIngresoFin != null){
        return this.fechaIngreso 
      }else{
        return new Date()
      }
    },
    tipoMoto: function () {
     if (this.dato.ordenEntrada.moto.tipo_moto.marca.nombre != null){
        return this.dato.ordenEntrada.moto.tipo_moto.marca.nombre +"  "+this.dato.ordenEntrada.moto.tipo_moto.referencia
     }
    },
    kilom: function () {
     if (this.dato.kilometraje != null){
        return this.dato.kilometraje +" Kms"
     }
    },
    total: function () {
      return (this.dato.costoServicio + this.dato.costoRepuestos)
    },
   

  },
  methods:{
    
    zero(event){
      
        if(event.key == 'Backspace' && this.idOrden.toString().length == 1){
          this.idOrden = null
        }
    },
    c(){
      console.log('Ok')
    },
    notificaciones(mensaje){
       this.$q.notify({
          color: 'negative',
          position: 'top',
          message: mensaje,
          icon: 'report_problem'
         })
     },
     clear(model){
       if(model == 'ingreso'){
         this.fechaIngreso = null
         this.fechaIngresoFin = null
       }else if(model == 'salida'){
         this.fechaSalida = null
         this.fechaSalidaFin = null
       }
     },
    dateSalida(){
      if(this.fechaSalidaFin == null){
        this.fechaSalidaFin = this.$moment(this.fechaSalida).format("YYYY[-]MM[-]DD") + " 23:59:59"
      }
    },
    dateIngreso(){
      if(this.fechaIngresoFin == null){  
        this.fechaIngresoFin = this.$moment(this.fechaIngreso).format("YYYY[-]MM[-]DD") + " 23:59:59"
      }   
    },
     buscarOrden(){
       this.$refs.selectOpen.show()
       this.limpiarDatos()
       
       if(this.placa == ''){
         this.placa = null
       }
       if(this.identificacion == ''){
         this.identificacion = null
       }
       if(this.idOrden == ''){
         this.idOrden = null
       }

       const datos = { estado: this.estado, fechaIngreso: this.fechaIngreso, fechaIngresoFin: this.fechaIngresoFin,
                       fechaSalida: this.fechaSalida, fechaSalidaFin: this.fechaSalidaFin,
                       placa: this.placa,tecnico: this.tecnico, identificacion: this.identificacion, id: this.idOrden}
       console.log(datos)
      
      http('ordenEntrada/findAll', datos, result =>{
        console.log(result.data.datos)
        this.listaOrden = result.data.datos
        this.n = this.listaOrden.length
        this.ordenes = mapear.orden(this.listaOrden)
        this.$refs.selectOpen.show()
        //console.log(result.data.datos.length)
      }, e=>{
         this.notificaciones(e.message)
      })

       
     },
     limpiarDatos(){
       this.numero = 'Orden#'
       this.dato={
        id: null,
        fechaIngreso: null,
        fechaEntregaEstimada: null,
        kilometraje: null,
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
    selectedOrden(obj){
        console.log(obj)
        this.listaOrden.forEach(item => {
          if(item.id == obj){
              this.dato = JSON.parse(JSON.stringify(item))
              this.numero = "Orden# " + (item.id.toString()).padStart(6,"000000")
              var y = this.$moment(this.dato.fechaIngreso).format("YYYY-MM-DD")
              
              
              this.dato.fechaIngreso= this.$moment(this.dato.fechaIngreso).format("DD [de] MMMM [del] YYYY")
              this.dato.fechaSalida= this.$moment(this.dato.fechaSalida).format("DD [de] MMMM [del] YYYY")
              this.cargarServicios()
              return
          }
        })
     },
     cargarOrdenes(){
      this.listaOrden = []
      const datos = {estado: this.estado, placa: 'KZF67A'}
      this.$axios.post('http://localhost:8080/ordensalida/search',datos).then(response =>{
        
        response.data.datos.forEach(item => {
            if(item.ordenEntrada != null){
                this.listaOrden.push(item)
            }else{
                console.log(false)
            }
        })
        //this.listaOrden = res.data.datos
        this.n = this.listaOrden.length
        this.ordenes = mapear.orden(this.listaOrden)
      }).catch((e) => {
         this.notificaciones(e.message)
       })
    },
    cargarServicios(){
     console.log(this.orden)
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
     /*validacionNombre(event){
         validar.espacios(event,this.solicitudes)
     },*/
    limpiar(){
      this.datos = null
      this.kilometraje = null
      //this.solicitudes = null
      this.checkedSolicitados = []
      this.tecnico = null
      this.hora = null
    },

    buscarPlaca(event){
        if(event.key === 'Enter'){
          http('moto/findOneByPlaca',{placa: this.buscar}, response =>{
            this.datos = JSON.parse(JSON.stringify(response.data.datos))
            if(this.datos != null){  
              this.cargarServicios()
            }else{
               this.notificaciones('NO se encontro coincidencias')
               this.limpiar()
            }
          },e =>{
            this.notificaciones(e.message)
          })
        }
     },
    cancelar(){
       http('ordenSalida/update', {id:this.dato.id, estado: 'Cancelado'}, response =>{
          console.log(response.data.datos)
       },e =>{
           this.notificaciones(e.message)
       })
    },
    cargarTecnicos(){
      http('persona/tecnico', null, response =>{
        this.tecnicos = mapear.persona(response.data.datos)
        this.tecnicos.unshift({value:0,label:' '})
        this.tecnico = 0
      },e =>{
          this.notificaciones(e.message)
      })
    },
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
  padding: 15px 0;
}
.q-if > .q-if-inner{
  background: blue!important;
}



.q-field-label{
  color: red!important;
  width: 25%
}
.q-field-label-inner{
  color: red!important;
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