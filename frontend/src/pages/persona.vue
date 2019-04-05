<template>
  <div >
    <q-page padding style="background:#292d2b;color:white">
      <div style="max-width:650px;width:100%;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px">
        <q-select inverted-light style="max-width:250px;width:100%;margin:auto" v-model="select" :options="selectOptions"
           @input="selected"/> 
      </div>
      {{buscar}}
      <q-list separator no-border class="q-mt-xs q-pt-md inset-separator" link style="max-width:650px;width:100%;margin:auto" >
        <q-list-header class="q-display-1 text-center" style="color:#FFFFFF;">Personas</q-list-header>
        <div class="flex" style="max-width:550px;width:100%;margin-left:auto;margin-right:auto">
        <q-search ref="searchRef" style="margin-left:auto;margin-right:auto;width:100%;max-width:450px" class="q-my-md" 
                  inverted-light v-model.trim="buscar" clearable @clear="clean" >
            <q-autocomplete :min-characters="1" @search="searchPersona" @selected="selectedPersona"  />
        </q-search>
        <q-btn v-if="false" color="red" style="margin-top:auto;margin-bottom:auto;" round icon="close" @click.native="clearSearch"/>
        </div>
        
        <q-item v-for="(dato, i) in datos" :key="i" >
          <q-item-side link @click.native="editar(i,'Ver')">
            <q-item-tile >
              <img src="/statics/icons/icon-persona.svg">
            </q-item-tile>
          </q-item-side>
          <q-item-main >
            <q-item-tile label>{{dato.nombre}}</q-item-tile>
            <q-item-tile sublabel><strong> Cedula:</strong>{{dato.identificacion}}</q-item-tile>
          </q-item-main>
          <q-item-side right >
           <q-btn class="q-mr-xs" color="red" @click.native.stop="editar(i,'Editar')" icon="create"/>
          </q-item-side>
        </q-item>
      
      </q-list>
     
    </q-page>

    

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click.native="agregar" round color="red" icon="add" />
    </q-page-sticky>
    
    <q-modal minimized :content-css="{minWidth: '50vw'}" ref="modalRef" @show="modal">
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">{{accion}}</p>
        <q-field class="q-mt-lg" label="Cedula:">
          <q-input ref="inputFocus" color="light" v-model="dato.identificacion" upper-case inverted-light 
              :readonly=" accion === 'Editar' || accion === 'Agregar' ? false :true"/>
        </q-field>
        <q-field class="q-mt-lg" label="Nombre:">
          <q-input color="light" v-model="dato.nombre" upper-case inverted-light
              :readonly=" accion === 'Editar' || accion === 'Agregar' ? false :true"/>
        </q-field>
        <q-field class="q-mt-lg" label="Telefono:">
          <q-input color="light" v-model="dato.telefono" upper-case inverted-light
              :readonly=" accion === 'Editar' || accion === 'Agregar' ? false :true"/>
        </q-field>
        <q-field class="q-mt-lg" label="Correo:">
          <q-input color="light" v-model="dato.correo" inverted-light
              :readonly=" accion === 'Editar' || accion === 'Agregar' ? false :true"/>
        </q-field>
        <q-field label="Tecnico" v-if="true"> 
          <q-checkbox v-model="roles" :val = 1 :disable=" accion === 'Editar' || accion === 'Agregar' ? false :true" />
        </q-field>
        <q-field label="Administrador" v-if="true"> 
          <q-checkbox v-model="roles" :val = 2 :disable=" accion === 'Editar' || accion === 'Agregar' ? false :true" />
        </q-field>
        <div class="row q-pt-lg justify-center">
          <q-btn-group>
            <q-btn color="negative" label="aceptar" @click.native.stop="guardar" v-if="accion !== 'Ver'" />
            <q-btn outline color="negative" label="cerrar" @click.native.stop="cerrar"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

    <q-modal minimized :content-css="{minWidth: '50vw'}" ref="modalRef2" 
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
    </q-modal>
    <q-pagination boundary-links @input="pagination" class="q-mb-lg" v-model="page" :min="minPages" :max="maxPages" :max-pages="3" />
    <!--<pagination v-model="page" @input="pagination" :min="minPages" :max="maxPages" :mp="3" />-->
  </div>
</template>

<script>
  import validar from 'src/funciones/validar'
  import http from 'src/funciones/http'
  import mapear from 'src/funciones/mapeo'
  import { filter, openURL } from 'quasar'
  import pagination from 'src/components/pagination'
   //Cliente=0
   //Tecnico=1
   //Administrador=2
   //Administrador,Tecnico=3
  
  export default{
    components:{
      pagination
    },
    data(){
      return {
        count:0,
        page: 1,
        minPages: 1,
        maxPages: 0,
        lista:[],
        buscar: '',
        mensaje: null,
        dato:{
          id: null,
          identificacion: null,
          nombre: null,
          telefono: null,
          correo: null,
          rol: null,
          uId: null
        },
        datos: null,
        listaPersona: [],
        accion: null,
        vectorValidacion:[],
        vectorRol:[0,1,2,3],
        roles:[],
        select: 0,
        selectOptions:[{value:0,label:'Clientes'},{value:1,label:'Tecnico'},{value:2,label:'Administrador'}],
        one: true,
        cambio: false
      }
    },
    beforeMount(){
      this.$nextTick(()=> {
        this.cargarLista()
        //this.crearLista()
        //console.log(mapear.crear(0,5))
      })
    },
    methods: {
      clean(){
        this.notificaciones(this.buscar)
        this.buscar = ''
        this.cargarLista()
      },
      notificaciones(mensaje){
       this.$q.notify({
          color: 'negative',
          position: 'top',
          message: mensaje,
          icon: 'report_problem'
         })
      },
      pagination(){
        
        
        if(this.one && this.cambio){
          this.cargarLista()
        }
        this.cambio = true
      },
      cargarLista(){
         if(this.maxPages != 0){
           this.cambio = true
         }
         var cantidad = 5
         this.buscar = null
         this.one = true
         const datos = {vector:this.vectorRol}
         http('persona/findAll', datos, response =>{
            this.lista = response.data.datos
            console.log('cargar: ' + response.data.datos.length)
            var n = (parseInt(response.data.datos.length) % cantidad)
            n = n==0 ? 0 : 1
            this.maxPages=(Math.trunc(response.data.datos.length / cantidad) + n)
            this.datos = response.data.datos.slice((this.page-1)*cantidad,this.page*cantidad)
            this.datos = response.data.datos.slice((this.page-1)*cantidad,this.page*cantidad)
            this.$refs.searchRef.focus()
      },e =>{
            this.notificaciones(e.message)
        })
      },
      searchPersona(terms, done){
        done(filter(terms, {field: 'label', list: mapear.persona(this.lista)}))
      },
      selectedPersona(obj){
        this.lista.forEach(item => {
          if (item.id == obj.value) {
            this.datos = []
            this.datos.push(item)
            //console.log(this.datos)
            this.notificaciones(item.nombre)
            this.buscar = item.nombre
            //this.buscar = "item.nombre"
            this.maxPages = 1
            this.one = false
            return
          }
        })
      },
      clearSearch(){
        this.buscar = null
        this.cargarLista()
        this.$refs.searchRef.focus()
      },
      ver(i,accion){
        this.dato = JSON.parse(JSON.stringify(this.datos[i]))
        this.roles = []
        if(this.dato.rol == 1){
             this.roles.push(this.dato.rol)
        }
        this.accion = accion
        this.$refs.modalRef.show()
      },
      agregar(){
        this.accion = 'Agregar'
        this.dato = {
          id: null,
          identificacion: null,
          nombre: null,
          telefono: null,
          correo: null,
          rol: null,
          uId: null
        }
        this.roles=[]
        this.$refs.modalRef.show()
      },
      editar(i, accion){
        this.dato = JSON.parse(JSON.stringify(this.datos[i]))
        this.roles = []
        if(this.dato.rol == 1){
          this.roles.push(this.dato.rol)
        }
        else if(this.dato.rol == 2){
          this.roles.push(this.dato.rol)   
        }
        else if(this.dato.rol == 3){
          this.roles = [1,2]
        }
        this.accion = accion
        this.$refs.modalRef.show()
      },
      modal(){
        //this.notificaciones(this.$refs.inputFocus.toString())
        this.$refs.inputFocus.focus()
      },
      guardar(){
        var ruta = ""
        var rutaHttp = ""
        var datos = ""
        if(this.accion == 'Agregar'){
          ruta = 'persona/insert'
          rutaHttp = 'login/createUid'
        }else if(this.accion == 'Editar'){
          ruta = 'persona/insert'
          rutaHttp = 'login/updateUid'
        }
        else if(this.accion == 'Eliminar'){
          ruta = 'persona/destroy'
          rutaHttp = 'login/destroyUid'
        }
            
        this.vectorValidacion=[]
        this.vectorValidacion.push(this.dato.identificacion, this.dato.nombre, this.dato.telefono, this.dato.correo)
        if(this.roles.length === 2){
          this.dato.rol = 3
        }
        else if(this.roles.length === 1){
            this.dato.rol = this.roles[0]
        }else{
            this.dato.rol = 0
        }
        
        

        //if(true){
        if(validar.campos(this.vectorValidacion)){
            
          var datosFb = {email:this.dato.correo, telefono: "+57"+this.dato.telefono,
                         pwd: this.dato.identificacion , nombre: this.dato.nombre, uid: this.dato.uId}
            
          //console.log(datosFb)
          http(rutaHttp,datosFb,result =>{
            if(this.accion == 'Eliminar'){
              datos = {id: this.dato.id}
            }else{
              datos = {id:this.dato.id, identificacion: this.dato.identificacion, 
                       nombre: this.dato.nombre, telefono: this.dato.telefono,
                       correo : this.dato.correo, rol: this.dato.rol, uId: result.data.datos.uid}
                       //console.log(datos.uId)
              }
              http(ruta, datos, result => {
                if(result.data.error){
                  http('login/destroyUid', {uid: datos.uId}, result => {
                  }, 
                  e =>{
                    this.notificaciones(e.message)
                  })
                  this.notificaciones(result.data.mensaje)
                }else{
                  this.cargarLista()
                  this.$refs.modalRef.hide()
                }
              },e =>{
                this.notificaciones(e.message)
              })
          },e =>{
            this.notificaciones(e.message)
          })
             
            
            
            /*http(ruta, datos, result => {
              this.cargarLista()
              this.$refs.modalRef.hide()
            }, e =>{
              this.notificaciones(e.message)
            })*/
            
            
        }else{
          this.notificaciones("Debe llenar todos los campos")
        }
            
        },
      cerrar(){
        this.$refs.modalRef.hide()
        this.$refs.searchRef.focus()   
      },
      selected(){
          this.vectorRol = []
          if(this.select === 0){
              this.vectorRol = [0,1,2,3]
          }
          else if(this.select === 1){
              this.vectorRol = [1,3]
          }
          else if(this.select === 2){
              this.vectorRol = [2,3]
          }
          this.cargarLista()
      }
    }
  }
</script>

<style>
  
</style>