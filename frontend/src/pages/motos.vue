<template>
  <div >
    <q-page padding style="background:#292d2b;color:white">
     
     <q-list separator no-border class="q-mt-xs q-pt-md inset-separator"  style="max-width:650px;width:100%;margin:auto" >
        <q-list-header class="q-display-1 text-center" style="color:#FFFFFF;">Motocicletas</q-list-header>
          <q-search upper-case style="margin-left:auto;margin-right:auto;width:100%;max-width:450px" class="q-my-md" inverted-light v-model.trim="buscar"  
                  ref="searchRef" clearable @keydown ="buscarPlaca($event)" @keyup ="buscarPress($event)"  @clear="cargarLista">
          </q-search>
          <q-btn color="light" label="Inbox">
            <q-chip floating color="primary">{{n}}</q-chip>
          </q-btn>
          <q-item link v-for="(dato, i) in datos" :key="i" >
            <q-item-side link @click.native="ver(i)">
              <q-item-tile icon>
                <img src="/statics/icon-moto.svg">
              </q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-item-tile class="q-ma-xs" label>{{dato.placa}}</q-item-tile>
              <q-item-tile sublabel><strong> Referencia:</strong>{{dato.tipo_moto.referencia}}</q-item-tile>
              <q-item-tile sublabel><strong> Marca:</strong>{{dato.tipo_moto.marca.nombre}}</q-item-tile>
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
    
    <q-modal minimized :content-css="{minWidth: '50vw'}" ref="modalRef" @show="$refs.inputFocus.focus()"
     @hide ="$refs.searchRef.focus()" >
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0"><strong>{{accion}}</strong></p>
        <q-field class="q-mt-lg" label="Placa:">
          <q-input ref="inputFocus" color="light" v-model="dato.placa" upper-case inverted-light 
              :readonly=" accion !== 'Ver' ? false :true"
              :clearable=" accion === 'Ver' ? false : true" />
        </q-field>
        <q-field class="q-mt-lg" label="Color:">
          <q-input color="light" v-model="dato.color" upper-case inverted-light
              :readonly=" accion !== 'Ver' ? false :true"
              :clearable=" accion === 'Ver' ? false : true"/>
        </q-field>
        <q-field  class="q-mt-lg" label="Marca:" >
          <q-select  v-model="selectMarcaModal" :options="listaMarcasModal" @input="selectedMarcaModal" v-if="accion === 'Editar' || accion === 'Agregar'" />
          <q-input color="light" v-model="dato.tipo_moto.marca.nombre" upper-case inverted-light v-else
            :readonly=" accion !== 'Ver' ? false :true" />
        </q-field>
        <q-field  class="q-mt-lg" label="Referencia:">
          <q-select  v-model="selectTipoModal" :options="listaTipoModal" @input="selectedTipoModal" v-if="accion === 'Editar' || accion === 'Agregar' " />
          <q-input color="light" v-model="dato.tipo_moto.referencia" upper-case inverted-light v-else
           :readonly=" accion !== 'Ver' ? false :true" />
        </q-field>
        <q-field class="q-mt-lg" label="Km Promedio:" v-if="accion === 'Ver'">
          <q-input color="light" v-model="dato.km_promedio" upper-case inverted-light readonly/>
        </q-field>
        <q-field class="q-mt-lg" label="Propietario:">
          <q-search v-model="labelPersona" v-if="accion !== 'Ver'" clearable >
            <q-autocomplete :min-characters="4" @search="searchPersona" @selected="selectedPersona"   />
          </q-search>
          <q-input color="light" v-model="dato.persona.nombre" upper-case inverted-light v-else
           :readonly=" accion !== 'Ver' ? false :true"/>
        </q-field>
        <div class="row q-pt-lg justify-center">
          <q-btn-group>
            <q-btn color="negative" label="aceptar" @click.native.stop="guardar" v-if="accion !== 'Ver'" />
            <q-btn  color="negative" icon="person" @click.native.stop="$refs.modalRef2.show()"  v-if="accion === 'Ver'"/>
            <q-btn outline color="negative" label="cerrar" @click.native.stop="$refs.modalRef.hide()"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

    
    <q-modal minimized :content-css="{minWidth: '40vw'}" ref="modalRef2" 
             @show="$refs.modalRef.hide()" @hide ="$refs.modalRef.show()" >
            
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0"><strong>Propietario {{dato.placa}}</strong></p>
        <q-field class="q-mt-lg" label="Nombre:">
          <q-input  color="light" v-model="dato.persona.nombre" upper-case inverted-light readonly/>
        </q-field>
        <q-field class="q-mt-lg" label="Cedula:">
          <q-input color="light" v-model="dato.persona.identificacion" upper-case inverted-light readonly/>
        </q-field>
        <q-field class="q-mt-lg" label="Telefono:">
          <q-input color="light" v-model="dato.persona.telefono" upper-case inverted-light readonly/>
        </q-field>
        
        <div class="row q-pt-lg justify-center">
          <q-btn-group>
            <q-btn outline color="negative" label="cerrar" @click.native.stop="$refs.modalRef2.hide()"/>
          </q-btn-group>
        </div>
      
      </div>
    </q-modal>

  </div>
</template>

<script>
  import validar from 'src/funciones/validar'
  import http from 'src/funciones/http'
  import mapear from 'src/funciones/mapeo'
  import { filter, openURL } from 'quasar'
  
  
  export default{
    data(){
        return {
            buscar: '',
            dato:{
              id: null,
              placa: null,
              color: null,
              km_promedio: null,
              tipo_motoId: null,
              propietarioId: null,
              tipo_moto:{
                id: null,
                referencia: null,
                marcaId: null,
                marca:{
                  id: null,
                  nombre: null
                }
              },
              persona:{
                id: null,
                identificacion: null,
                nombre: null,
                telefono: null,
                correo: null,
                rol: null,
               uId: null
              }
          },
          n: 25,
          datos: null,
          listaMarcas:[],
          listaMarcasModal:[],
          listaTipoModal: [],
          listaPersonas: [],
          selectMarcaModal: 0,
          selectTipoModal : 0,
          labelMarca: ' ',
          labelTipo: ' ',
          personaId: null,
          labelPersona: '',
          accion: null,
          vectorValidacion:[],
          vectorRol:[0,1],
          //select: 0,
        }
    },
    beforeMount(){
      this.$nextTick(()=> {
        this.cargarLista()
        this.cargarListaMarcas()
        this.cargarListaPersonas()
        this.$refs.searchRef.focus()
      })
    },
    methods: {
        
      notificaciones(mensaje){
       this.$q.notify({
          color: 'negative',
          position: 'top',
          message: mensaje,
          icon: 'report_problem',
          timeout: 1000,
         })
     },
      cargarLista(){
         http('moto/findAll', null, response =>{
            this.datos = response.data.datos
        },e =>{
            this.notificaciones(e.message)
        })
      },
      cargarListaPersonas(){
         http('persona/findAllMap', null, response =>{
            this.listaPersonas = response.data.datos
        },e =>{
            this.notificaciones(e.message)
        })
      },
      searchPersona(terms,done){
        this.personaId = 0
        done(filter(terms, {field: 'label', list: this.listaPersonas}))
      },
      selectedPersona(obj){
        this.labelPersona = obj.label
        this.personaId = obj.value
      },
      searchMoto(terms,done){
        done(filter(terms, {field: 'label', list: mapear.moto (this.datos)}))
      },
      
      buscarPlaca(event){
        if(event.key == 'Backspace' && this.buscar.toString().length == 1){
          console.log('cargo')
          this.cargarLista()
        }
        if(event.key == 'Delete'){
          this.buscar = null
          this.cargarLista()
        }
        console.log(this.buscar.length)
        if(this.buscar.length){
          console.log('lleno')
        }else{
          console.log('vacio')
        }
        if(event.key === 'Enter'){
          let cont = 0
          this.datos.forEach(item => {
            if(item.placa == this.buscar){
                cont++
                this.datos = []
                this.datos.push(item)
                return
            }
          })
          if(cont == 0){
              this.cargarLista()
              this.notificaciones('No Hay Coincidencias')
          }
        }
      },
     buscarPress(event){
          
      },
      cargarListaMarcas(){
        var ruta = 'marca/findAllMap'
        http(ruta, {required:true}, response => {
          this.listaMarcasModal = JSON.parse(JSON.stringify(response.data.datos))
          this.selectMarcaModal = response.data.datos[0].value
          //this.listaMarcasModal.unshift({value:0,label:' '})
          this.cargarTipoMotos()
          this.listaMarcas = response.data.datos
          this.listaMarcas.unshift({value:0,label:' '})
        },e => {
          this.notificaciones(e.message)
        })
        
        
        
        
      },
      cargarTipoMotos(){
        var ruta = 'tipoMoto/findAllMapByMarca'
        var datos = {marcaId: this.selectMarcaModal}
            
        http(ruta, datos, response => {
          this.listaTipoModal = []
          this.listaTipoModal = response.data.datos
          this.selectTipoModal = response.data.datos[0].value
            //this.listaTipoModal.unshift({value:0,label:' '})
          },e => {
            this.notificaciones(e.message)
          })
      },
      selectedMarcaModal(){
        this.cargarTipoMotos()
        //this.notificaciones('selectmarca')
        //if(this.selectMarcaModal > 0){ 
          /*var ruta = 'tipoMoto/findAllMapByMarca'
          var datos = {marcaId: this.selectMarcaModal}
            
          http(ruta, datos, response => {
            this.listaTipoModal = []
            this.listaTipoModal = response.data.datos
            this.selectTipoModal = response.data.datos[0].value
            //this.listaTipoModal.unshift({value:0,label:' '})
          },e => {
            this.notificaciones(e.message)
          })
            
            
            
          }else{
              //this.listaTipoModal = [] 
              //this.listaTipoModal.unshift({value:0,label:' '}) 
              //this.selectTipoModal = 0
          } */    
      },
      selectedTipoModal(){

      },
      agregar(){
        this.accion = 'Agregar'
        //this.selectMarcaModal = 0
        //this.selectTipoModal = 0
        this.personaId = 0
        this.labelPersona = ''
        this.dato = {
          id: null,
          placa: null,
          color: null,
          km_promedio: null,
          tipo_motoId: null,
          propietarioId: null,
          tipo_moto:{
            id: null,
            referencia: null,
            marcaId: null,
            marca:{
              id: null,
              nombre: null
            }
          },
          persona:{
            id: null,
            identificacion: null,
            nombre: null,
            telefono: null,
            correo: null,
            rol: null,
            uId: null
          } 
        }
        
        this.$refs.modalRef.show()
      },
      ver(i){
        this.dato = JSON.parse(JSON.stringify(this.datos[i]))
        this.accion = 'Ver'
        this.$refs.modalRef.show()
      },
      editar(i, accion){
        this.dato = JSON.parse(JSON.stringify(this.datos[i]))
        this.selectMarcaModal = JSON.parse(JSON.stringify(this.dato.tipo_moto.marcaId))
        this.selectedMarcaModal()
        this.labelPersona = JSON.parse(JSON.stringify(this.dato.persona.nombre))
        this.personaId = JSON.parse(JSON.stringify(this.dato.persona.id))
        this.selectTipoModal = JSON.parse(JSON.stringify(this.dato.tipo_moto.id))
        this.accion = 'Editar'
        this.$refs.modalRef.show()
      },
      guardar(){
        
        
        this.vectorValidacion=[]
        this.vectorValidacion.push(this.dato.placa, this.dato.color)
        
        
        
          if(validar.campos(this.vectorValidacion) && this.selectMarcaModal > 0 && 
            this.selectTipoModal > 0 && this.personaId > 0){
            if(validar.placa(this.dato.placa)){
              
              var ruta = 'moto/insert'
              var datos = {id:this.dato.id, placa: this.dato.placa, 
                           color: this.dato.color, tipo_motoId: this.selectTipoModal,
                           propietarioId : this.personaId} 
             
              http(ruta, datos, result => {
                if(result.data.error){
                  this.notificaciones(result.data.mensaje)
                }else{
                  this.notificaciones(result.data.datos.placa.toString())
                  this.cargarLista()
                  this.$refs.modalRef.hide()
                }
              }, e =>{
                this.notificaciones(e.message)
              })
            }else{
              this.notificaciones("Formato de placa incorrecto")
            } 
          }else{
            this.notificaciones("Debe llenar todos los campos")
          }
        
      }
     
     
    }
  }
</script>

<style>
  
</style>