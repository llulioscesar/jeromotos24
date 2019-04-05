<template>
  <div>
    <q-page padding style="background:#292d2b;color:white">
      <q-list  separator no-border class="q-mt-xl q-pt-xl inset-separator"  style="max-width:500px;width:100%;margin:auto;" >
        <q-list-header class="q-display-1 text-center" style="color:#FFFFFF;">Servicios Taller</q-list-header>
               
        <q-item v-for="(dato, i) in datos" :key="i" >
          <q-item-side icon="build">
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
    
    <q-modal minimized :content-css="{minWidth: '50vw'}" ref="modalRef"  @show="$refs.inputFocus.focus()" @keydown ="enter($event)" >
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">{{accion}}</p>
        <q-field class="q-mt-lg" label="Servicio Taller:">
          <q-input ref="inputFocus" color="light" v-model.trim="dato.nombre" upper-case inverted-light 
            clearable  @keydown ="enter($event)" />
        </q-field>
        <div class="row q-pt-lg justify-center">
          <q-btn-group>
            <q-btn color="negative" label="aceptar" @click.native.stop="guardar" />
            <q-btn outline color="negative" label="cerrar" @click.native.stop="cerrar"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

  </div>
</template>

<script>
  
  import validar from 'src/funciones/validar'
  import http from 'src/funciones/http'
  
  export default{
    data(){
        return {
          dato:{
              id: null,
              nombre: null
          },
          datos: null,
          accion: null,
          mensaje: null,
          vectorValidacion:[]
        }
    },
    beforeMount(){
      this.$nextTick(()=> {
        this.cargarLista()
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
      enter(event){
        if(event.key == 'Enter'){
          this.guardar()
        }
        if(event.key == 'Delete'){
          this.dato.nombre = null
        }
      },
      cargarLista(){
        var ruta = 'servicioTaller/findAll'

        http(ruta, null, response => {
          this.datos = response.data.datos
        },e => {
          this.notificaciones(e.message)
        })
      },
      agregar(){
        this.accion = 'Agregar'
        this.dato = {
          id: 0,
          nombre : null
        }
        this.$refs.modalRef.show()
      },
      editar(i){
        this.dato = JSON.parse(JSON.stringify(this.datos[i]))
        this.accion = 'Editar'
        this.$refs.modalRef.show()
      },
      guardar(){
        this.vectorValidacion=[]
        this.vectorValidacion.push(this.dato.nombre)
        if(validar.campos(this.vectorValidacion)){
          var ruta = 'servicioTaller/insert'
          var datos = {id:this.dato.id, nombre: this.dato.nombre}
          
          http(ruta, datos, response => {
            if(response.data.error){
              this.notificaciones(response.data.mensaje)
            }else{
              this.cargarLista()
              this.$refs.modalRef.hide()
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
      }
    }
  }
</script>

<style>
  
</style>