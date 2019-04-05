<template>
  <div class="bg-white">
    <br>
    <br>
    <br>
    <br>
    
    <!--<div class="row q-mt-xl"> 
      <div class="col-xs-12 col-md-3"> 
        <q-search inverted-light color="light" class="no-shadow q-mx-md" v-model="buscar">
          <q-autocomplete :min-characters="3" @search="searchMoto" @selected="selectedMoto" />
        </q-search>
      </div>  
    </div>-->
    <div class="row">
      {{habilitar}}
      <div class="col-xs-12 col-md-3"> 
        <q-select v-model="orden" class="q-mx-md" :options="ordenes" 
           float-label="Orden Servicio" @input="selectedOrden" />
      </div>
      <div class="col-xs-12 col-md-1"> 
        <q-btn color="red" :label ="listaOrden.length.toString()" />
      </div>
      <div class="col-xs-12 col-md-3"> 
        <q-select v-model="estado" class="q-mx-md" :options="estados" float-label="Estado" @input="selectEstado" 
          @change="inputChange"  />
      </div> 
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-3">
        <q-input v-model="placa" type="text" :readonly= true class="text-black q-mx-md" float-label="Placa"/>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-input v-model="propietario" type="text"  class="text-black q-mx-md" float-label="Propietario"/>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-select v-model="tecnico" class="q-mx-md" :options="tecnicos" float-label="Tecnico"/>
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-xs-12 col-md-3">
        <q-input v-model="fechaIngreso" type="text"  class="text-black q-mx-md" float-label="Fecha Ingreso"/>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-input v-model="kilometraje" type="text"  class="text-black q-mx-md" float-label="Kilometraje"/>
      </div>
    </div>
    <br>
    <br>
   {{orden}}
    <div class="row" >
      <div class="col-xs-12 col-sm-6 column inline">
        <q-collapsible opened icon="motorcycle" label= "Servicios Solicitados" >
          <q-list link  >
             <q-item v-for="(solicitado, i) in listaServicios" :key="i"  >
               <q-checkbox disable :val="solicitado.servicioTaller.id"  v-model="checkedSolicitados" :label="solicitado.servicioTaller.nombre" class="check-box"/>
             </q-item>
              <textarea :disabled = "habilitar" class="full-width wrap " v-model="solicitudes" @keydown ="validacionNombre($event)"></textarea>
          </q-list>
        </q-collapsible>
      </div>
      <div class="col-xs-12 col-sm-6 column inline">
        <q-collapsible opened icon="motorcycle" label= "Servicios Realizados">
          <q-list link v-if="true">
             <q-item v-for="(realizado, i) in listaServicios" :key="i" >
               <q-checkbox  :val="realizado.servicioTaller.id"  v-model="checkedRealizados" :label="realizado.servicioTaller.nombre" class="check-box"/>
             </q-item>
              <textarea class="full-width wrap " v-model="respuestas"></textarea>
          </q-list>
        </q-collapsible>
      </div>
    </div>
    <q-btn @click.native="guardar" v-if="estado === 'Iniciado'" color="primary">Guardar</q-btn>
    <q-btn @click.native="cancelar" v-if="estado === 'Iniciado'" color="primary">Cancelar</q-btn>
  </div>
</template>

<script>
import { filter } from 'quasar'
import mapear from 'src/funciones/mapeo'
import validar from 'src/funciones/validar'
import { format } from 'quasar'
const { pad } = format

function notifyMe() {
  
  //console.log("Notification" in window)
  if (!("Notification" in window)) {
      //alert("This browser does not support desktop notification");
      console.log("noticia")
  }else if (Notification.permission === "granted") {
				// Si está bien vamos a crear una notificación
				var body = "Hola";
				//var icon = "http://www.elcapa8.com/img/favicon.ico";
				var title = "Notificación";
				var options = {
					body: body,
					//icon: icon,
					lang: "ES",
					renotify: "true"
				}
				var notification = new Notification(title,options);
				//var audio = new Audio('/statics/notificacion.mp3');
				//audio.play();
				setTimeout(notification.close.bind(notification), 5000);
	}else if (Notification.permission !== 'denied') {
				Notification.requestPermission(function (permission) {
					// Si el usuario acepta, vamos a crear una notificación
					if (permission === "granted") {
						var notification = new Notification("Gracias, Ahora podras recibir notifiaciones de nuestra página");
					}
				});
	}	
  
}  


export default{
  data(){
    return{
      orden: null ,
      ordenes:[],
      estado: 'Iniciado',
      estadoAnterior : 'Iniciado',
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
      horaActual: new Date(),
      fechaIngreso:null,
      kilometraje:null,
      checkedSolicitados:[],
      checkedRealizados:[],
      solicitudes:"",
      respuestas:null,
      propietario:null,
      buscar:null,
      motoId:null,
      ordenId:null,
      placa: null,
      tipoMoto: null,
      listaServicios:null,
      tecnicos:[],
      tecnico: null,
      hora:null,
      habilitar:true,
      vectorValidacion:[],
      listaOrden:[],
   }
  },
  beforeMount(){
    this.cargarTecnicos()
    this.cargarOrdenes()
    //this.notificaciones(pad('2', 8))
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
     inputChange(){
       this.notificaciones("cambio")
     },
     selectEstado(){
       //console.log(this.estadoAnterior === this.estado)
       var audio = new Audio('/statics/notificacion.mp3');
			 audio.play();
       if(this.estadoAnterior !== this.estado){
          this.estadoAnterior = JSON.parse(JSON.stringify(this.estado))
          this.placa = null 
          this.propietario = null
          this.tecnico = null
          this.fechaIngreso = null
          this.kilometraje = null
          this.orden = null
          this.listaServicios = []
          this.solicitudes = null
          this.respuestas = null
          this.cargarOrdenes()
      }
       //this.cargarOrdenes()
       //this.orden = null
     },
     selectedOrden(obj) {
        this.listaOrden.forEach(item => {
          if(item.id == obj){
            this.motoId = item.motoId
            this.placa = JSON.parse(JSON.stringify(item.moto.placa))
            this.propietario = JSON.parse(JSON.stringify(item.moto.persona.nombre))
            this.tecnico = JSON.parse(JSON.stringify(item.persona.id))
            this.fechaIngreso = JSON.parse(JSON.stringify(item.fechaIngreso))
            this.kilometraje = JSON.parse(JSON.stringify(item.kilometraje))
            //this.listaServicios = JSON.parse(JSON.stringify(item.servicios))
            //console.log(item.servicios)
            this.cargarServicios(item.id)
            return
          }
        })
    },
     guardar(){
       //this.vectorValidacion=[]
       //this.vectorValidacion.push(h, this.kilometraje, this.motoId, this.tecnico)
       //this.notificaciones(JSON.stringify(this.solicitudes.trim().length))
       if(this.checkedRealizados.length > 0 || this.respuestas !== null){
          this.$axios.post('http://localhost:8080/ordensalida/update',{fechaSalida:this.$moment().format("X") , 
            Observaciones: this.respuestas, CostoServicio: 0, CostoRepuestos: 0, estado:'Finalizado', ordenId: this.orden
          }).then((res) => {
                this.listaServicios.forEach(item =>{
                    if(this.checkedRealizados.indexOf(item.servicioTaller.id) > -1){
                        this.$axios.post('http://localhost:8080/ordensalida/insertServicios',
                          {servicioId: item.servicioTaller.id, ordenId: this.orden, realizados: 1
                        }).then((res) => {
                            this.$axios.post('http://localhost:8080/contador/update',
                              { servicioId: item.servicioTaller.id, motoId: this.motoId, kilometraje:0, tiempo:0,
                                ultimoKm: this.kilometraje, ultimaFecha: this.$moment().format("X"), notifico:0
                            }).then((res) => {
                          
                            }).catch(e => {
                              this.notificaciones(e.message)
                            })
                        }).catch(e => {
                          this.notificaciones(e.message)
                        })
                    }    
                })
          }).catch((e) => {
              this.notificaciones(e.message)
          })
       }else{
         this.notificaciones("Llenar los campos")
       }
    },
    cargarServicios(id){
      this.$axios.post('http://localhost:8080/servicios/findAll',{ordenId: id}).then(res =>{
        this.checkedRealizados = []
        this.checkedSolicitados = []
        this.listaServicios = res.data.datos
          if(this.listaServicios.length > 0){
            this.solicitudes = JSON.parse(JSON.stringify(this.listaServicios[0].ordenEntrada.solicitudes))
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
    cargarOrdenes(){
      this.$axios.post('http://localhost:8080/ordensalida/findAll',{estado:this.estado}).then(res =>{
        this.listaOrden = res.data.datos
        //console.log(this.listaOrden)
        this.ordenes = mapear.orden(res.data.datos)
        //console.log(res.data.datos)
      }).catch((e) => {
         this.notificaciones(e.message)
       })
    },

    selectedMoto (obj) {
      this.listaMotos.forEach(item => {
        if(item.id == obj.value){
          this.motoId = item.id
          this.placa = item.placa
          this.propietario = item.persona.nombre
          this.tipoMoto = item.tipo_motoId
          this.buscar = null
          this.cargarServicios()
          return
        }    
      })
    },
    searchMoto(terms,done){
      this.$axios.post('http://localhost:8080/moto/listar').then(res =>{
        this.listaMotos = res.data.datos
        done(filter(terms, {field: 'label', list: mapear.moto(res.data.datos) }))
      }).catch((e) => {
         this.notificaciones(e.message)
       })
     },
     cargarTecnicos(){
      this.$axios.post('http://localhost:8080/persona/tecnico').then(res =>{
        this.tecnicos = mapear.persona(res.data.datos)
      }).catch((e) => {
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