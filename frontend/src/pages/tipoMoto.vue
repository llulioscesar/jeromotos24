<template>
  <div class="q-mt-xl">
    
    <q-page padding style="background:#292d2b;color:white">
      <div style="max-width:650px;width:100%;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px">
        <q-select style="max-width:250px;width:100%;margin:auto" v-model="select"  :options="listaMarcas"
           @input="selected" :clearable="select == 0 ? false : true" @clear="clearSelect" /> 
      </div>
      
      <q-list separator no-border class="q-mt-xl q-pt-xl inset-separator" link style="max-width:450px;width:100%;margin:auto" >
        <q-list-header class="q-display-1 text-center" style="color:#FFFFFF;">Referencias</q-list-header>
               
        <q-item v-for="(dato, i) in datos" :key="i" >
           <q-item-side >
            <q-item-tile icon>
              <img src="/statics/icon-moto.svg">
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile class="q-ma-xs" label>{{dato.referencia}}</q-item-tile>
            <q-item-tile class="q-ma-xs" sublabel><strong> {{dato.marca.nombre}}</strong></q-item-tile>
          </q-item-main>
          <q-item-side right>
           <q-btn class="q-mr-xs" color="red" @click.native.stop="editar(i,'Editar')" icon="create"/>
           <q-btn v-if="false" class="q-mr-xs" color="primary" @click.native.stop="editar(i,'Eliminar')" icon="delete"/> 
           <q-btn color="red" @click.native.stop="verTabla(i)" icon="build"/> 
          </q-item-side>
        </q-item>
      </q-list>
    </q-page>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click.native="agregar" round color="red" icon="add" />
    </q-page-sticky>
    
    <q-modal minimized :content-css="{minWidth: '50vw'}" ref="modalRef" @show="showModal">
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">{{accion}}</p>
        <q-field  class="q-mt-lg" label="Marca:" >
          <q-select  v-model="selectModal" ref="selectRef" :options="listaMarcasModal"   />
        </q-field>
        <q-field class="q-mt-lg" label="Referencia:">
          <q-input  color="light" v-model.trim="dato.referencia" upper-case inverted-light />
        </q-field>
        <div class="row q-pt-lg justify-center">
          <q-btn-group>
            <q-btn color="negative" label="aceptar" @click.native.stop="guardar" />
            <q-btn outline color="negative" label="cerrar" @click.native.stop="cerrar"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

    <!--<q-modal minimized :content-css="{minWidth: '50vw'}" ref="modalRef2" 
          @show="$refs.modalRef.hide()" @hide ="$refs.modalRef.hide()">
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">{{accion}}</p>
        <div class="row q-pa-lg justify-center text-bold q-headline ">{{mensaje}}</div>

        <div class="row q-pt-lg justify-center">
          
          <q-btn-group>
            <q-btn color="negative" label="aceptar" @click.native.stop="ok" />
            <q-btn outline color="negative" label="cancelar" @click.native.stop="no"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>-->



  </div>
</template>

<script>
  import validar from 'src/funciones/validar'
  import http from 'src/funciones/http'
  import { LocalStorage, SessionStorage } from 'quasar'
  
  export default{
    data(){
      return {
        dato:{
          id: null,
          referencia: null,
          marcaId: null,
          marca:{
            id: null,
            nombre: null
          }
        },
        datos: null,
        buscar:'',
        accion: null,
        vectorValidacion:[],
        select: 0,
        selectModal: null,
        listaMarcas:[],
        listaMarcasModal:[],
        mensaje: null
      }
    },
    beforeMount(){
      this.$nextTick(()=> {
        this.cargarLista()
        this.cargarListaMarcas()
      })
    },
    methods: {
      
      notificaciones(mensaje){
       this.$q.notify({
          color: 'negative',
          position: 'top',
          message: mensaje,
          icon: 'report_problem'
         })
      },
      clearSelect(){
        this.select = 0
      },
      cargarLista(){
        var ruta = 'tipomoto/findAll'
        http(ruta, null, response => {
          this.datos = response.data.datos
        },e => {
          this.notificaciones(e.message)
        })
      },
      cargarListaMarcas(){
        var ruta = 'marca/findAllMap'
        http(ruta, {required:false}, response => {
          this.listaMarcasModal = JSON.parse(JSON.stringify(response.data.datos))
          this.listaMarcas = response.data.datos
          this.listaMarcas.unshift({value:0,label:' '})
        },e => {
          this.notificaciones(e.message)
        })  
      },
      agregar(){
        
        this.accion = 'Agregar'
        //this.selectModal = 0
        this.dato = {
          id: 0,
          referencia: null,
          marcaId: null,
          marca:{
            id: null,
            nombre: null
          }
        }
        
        this.$refs.modalRef.show()
      },
      showModal(){
          //this.$refs.inputFocus.focus()
          this.$refs.selectRef.show()
      },
      verTabla(i){
        let dato = JSON.parse(JSON.stringify(this.datos[i]))
        SessionStorage.set('referencia', dato)
        this.$router.push('/app/tablaMantenimiento')
      },
      editar(i){
        this.dato = JSON.parse(JSON.stringify(this.datos[i]))
        this.selectModal = JSON.parse(JSON.stringify(this.dato.marcaId))
        this.accion = 'Editar'
        this.$refs.modalRef.show()
      },
      guardar(){
        
        this.vectorValidacion=[]
        this.vectorValidacion.push(this.dato.referencia)
        
        if(validar.campos(this.vectorValidacion)){
          var ruta = 'tipoMoto/insert'
          var datos = {id:this.dato.id, referencia: this.dato.referencia, marcaId: this.selectModal}
          http(ruta, datos, response => {
            if(!response.data.error){
              this.cargarLista()
              this.$refs.modalRef.hide()
              if(this.accion == 'Agregar'){
                SessionStorage.set('referencia', response.data.datos)
                this.$router.push('/app/tablaMantenimiento')
              } 
            }else{
              this.notificaciones(response.data.mensaje)
            }
          },e => {
            this.notificaciones(e.message)
          })    
        }else{
          this.notificaciones("Debe llenar todos los campos")
        }
      },
      cerrar(){
        this.$refs.modalRef.hide()   
      },
      selected(){
        if(this.select > 0){ 
          
          var ruta = 'tipoMoto/findAllByMarca'
          var datos = {marcaId: this.select}
          
          http(ruta, datos, response => {
            this.datos = response.data.datos
          },e => {
            this.notificaciones(e.message)
          })
            
            
            
            /*this.$axios.post('http://localhost:8080/tipomoto/findAllByMarca',{marcaId: this.select})
            .then((response) => {
              
            }).catch((e) => {
              
            })*/
          }else{
              this.cargarLista()
          }     
      }
    }
  }
</script>

<style>

.q-item-label{
  margin: 4px 4px!important;
}
 
</style>