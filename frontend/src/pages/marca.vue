<template>
  <div class="q-mt-xl">
    <q-page padding style="background:#292d2b;color:white">
      <q-list no-border class="q-mt-xl q-pt-xl inset-separator" style="max-width:450px;width:100%;margin:auto" >
        <q-list-header class="q-display-1 text-center" style="color:#FFFFFF;">Marcas</q-list-header>
        {{page}}
        <q-item v-for="(dato, i) in datos" :key="i" >
          <q-item-side >
            <q-item-tile icon>
              <img src="/statics/icon-moto.svg">
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile label><strong>{{dato.nombre}}</strong></q-item-tile>
          </q-item-main>
          <q-item-side right>
           <q-btn class="q-mr-xs" color="red" @click.native.stop="editar(i)" icon="create"/>
          </q-item-side>
        </q-item>
      
      </q-list>
    </q-page>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click.native="agregar" round color="red" icon="add" />
    </q-page-sticky>
    
    <q-modal minimized :content-css="{minWidth: '30vw'}" ref="modalRef" @show="$refs.inputFocus.focus()">
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">{{accion}}</p>
        <q-field class="q-mt-lg" label="Marca">
          <q-input ref="inputFocus" color="light" v-model.trim="dato.nombre" upper-case inverted-light
             clearable  @keydown ="enter($event)" />
        </q-field>

        <div class="row q-pt-lg justify-center">
          <q-btn-group>
            <q-btn color="negative" label="guardar" @click.native.stop="guardar" />
            <q-btn outline color="negative" label="cerrar" @click.native.stop="$refs.modalRef.hide()"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>
  <!--<my-select v-model="selected" :options="myOptions" />-->
  <pagination v-model="page" @change="pagin" @input="pagInput" :min="min" :max="max"/>
  </div>
</template>

<script>
  import { LocalStorage, SessionStorage } from 'quasar'
  import validar from 'src/funciones/validar'
  import http from 'src/funciones/http'
  import pagination from 'src/components/pagination'
  import MySelect from 'src/components/MySelect'
  
  export default{
    components:{
      pagination,
      MySelect
    },
    data(){
      return {
        dato:{
          id: null,
          nombre: null,
          adminId: null
        },
        datos: null,
        buscar:'',
        accion: null,
        vectorValidacion:[],
        sesion: SessionStorage.get.item('administrador'),
        page: 1,
        min: 1,
        max: 13,
        maxPages: 6,

        selected: null,
        myOptions: [{label: 'Google',value: 'goog'}, {label: 'face',value: 'face'} ]
      }
    },
    beforeMount(){
      this.$nextTick(()=> {
        this.cargarLista()
      })
    },
    updated(){
      //this.notificaciones('update')
    },
    methods: {
      pagin(newVal){
        console.log('changue: ' + newVal)
        this.page = newVal
        //this.notificaciones(newVal.toString())
      },
      pagInput(newVal){
        this.page = newVal
        console.log('input: ' + newVal)
        //this.notificaciones(newVal.toString())
      },
      notificaciones(mensaje){
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: mensaje,
          icon: 'report_problem'
        })
      },
      cargarLista(){
        http('marca/findAll', null, response =>{
            this.datos = response.data.datos
        },e =>{
            this.notificaciones(e.message)
        })
      },
      enter(event){
        if(event.key == 'Enter'){
          this.guardar()
        }
        if(event.key == 'Delete'){
          this.dato.nombre = null
        }
      },
      agregar(){
        this.accion = 'Agregar'
        this.dato = {
          id: 0,
          nombre : null,
          adminId : 1
        }
        this.$refs.modalRef.show()
      },
      editar(i, accion){
        this.dato = JSON.parse(JSON.stringify(this.datos[i]))
        this.accion = 'Editar'
        this.$refs.modalRef.show()
      },
      guardar(){
        
        this.vectorValidacion=[]
        this.vectorValidacion.push(this.dato.nombre)
        if(validar.campos(this.vectorValidacion)){
            var ruta = 'marca/insert'
            var datos = {id:this.dato.id, nombre: this.dato.nombre, adminId: this.dato.adminId}
            http(ruta, datos, result => {
              this.cargarLista()
              this.$refs.modalRef.hide()
            }, e =>{
              this.notificaciones(e.message)
            })
        }else{
            this.notificaciones("Debe llenar todos los campos")
            this.$refs.inputFocus.focus()
        }
      }
    }
  }
</script>

<style>
  
</style>