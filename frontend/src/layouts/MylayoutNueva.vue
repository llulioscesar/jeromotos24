<template>
  <q-layout view="lHh Lpr lFf" style="background:#292d2b;padding-top: 0px;">
    <q-layout-header>
      <q-toolbar
        color="red"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Jeromotos24 
          <div slot="subtitle">{{open}}</div>
          <div  v-for="(dato, i) in lista" :key="i" slot="subtitle">{{dato.id}}</div>
        </q-toolbar-title>
        
        <q-btn color="light" @click="ver" label="">{{leftDrawerOpen}}
            <q-chip floating :color="color">{{lista.length}}</q-chip>
          </q-btn>
      </q-toolbar>
      
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      
  
      <q-list no-border link inset-delimiter  >
    
        <q-item v-for="(dato, i) in datos[0]" :key="i" link @click.native="rutas(dato.to, 0)" 
                :class="{ activo : dato.to == ruta }" >
          <q-item-side >
            <q-item-tile >
                <img :src= "dato.icon">
            </q-item-tile>
          </q-item-side>

          <q-item-main >
            <q-item-tile label>{{dato.label}}</q-item-tile>
          </q-item-main>
        </q-item>  
    
        <q-collapsible ref="refColap1" avatar="/statics/icon-moto-menu.svg" label="Motos"
                        :class="{ colapsibleActive : open1}" @show="show1()" @hide="hide1()" >
          
          <q-item v-for="(dato, i) in datos[1]" :key="i" link @click.native="rutas(dato.to, 1)" :class="{ activo : dato.to == ruta }" >
            <q-item-side >
              <q-item-tile >
                <img :src= "dato.icon">
              </q-item-tile>
            </q-item-side>

            <q-item-main >
              <q-item-tile label>{{dato.label}}</q-item-tile>
            </q-item-main>
          </q-item>  
        </q-collapsible>
    
        <q-collapsible ref="refColap2" avatar="/statics/icon-moto-menu.svg" label="Orden de Servicio" 
                      :class="{ colapsibleActive : open2}" @show="show2()" @hide="hide2()" >
          <q-item style="margin: 0px;" v-for="(dato, i) in datos[2]" :key="i" link @click.native="rutas(dato.to, 2)" :class="{ activo : dato.to == ruta, input: true }" >
            <q-item-side >
              <q-item-tile >
                <img :src= "dato.icon">
              </q-item-tile>
            </q-item-side>

            <q-item-main >
              <q-item-tile label>{{dato.label}}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-collapsible>
    
        <q-item v-for="(dato, j) in datos[3]" :key="j+2" link @click.native="rutas(dato.to, 3)" :class="{ activo : dato.to == ruta, input: true }" >
          <q-item-side >
            <q-item-tile >
                <img :src= "dato.icon">
            </q-item-tile>
          </q-item-side>

          <q-item-main >
            <q-item-tile label>{{dato.label}}</q-item-tile>
          </q-item-main>
        </q-item>
   
      </q-list>
    </q-layout-drawer>

    <q-modal minimized :content-css="{minWidth: '30vw'}" ref="modalRef"  @hide="$store.state.cantidad = 0" >
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">Ordenes</p>
        <q-list separator>
          <q-item v-for="(dato, i) in lista" :key="i" >
            <q-item-main>
              <q-item-tile label :color=" i < cantidad ? 'red' : 'black' "><strong>{{dato.id}}</strong></q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </div>
    </q-modal>
    
    <q-page-container>
      <router-view />
    </q-page-container>
  
  </q-layout>
</template>

<script>

import { openURL } from 'quasar'
import { LocalStorage, SessionStorage } from 'quasar'
import http from 'src/funciones/http'
import mapear from 'src/funciones/mapeo'
import menu from 'src/statics/menu.js'
import Vuex from 'vuex'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: true,
      administrador: SessionStorage.get.item('administrador').nombre,
      n: 0,
      datos:[],
      dato: null,
      cant: 0,
      index: 0,
      ruta: null,
      open: null,
      open1: false,
      open2: false,
      //datos: menu,
      datos:[
        [
          {to: '/app/persona', label: 'Personas', icon:"/statics/icon-persona-menu.svg"},
          {to: '/app/servicioTaller', label: 'Servicios Taller', icon: '/statics/icon-persona-menu.svg'}
        ],
        [
          {to: '/app/motos', label: 'Motocicletas', icon:"/statics/icon-persona-menu.svg"},
          {to: '/app/tipoMoto', label: 'Referencias', icon: '/statics/icon-persona-menu.svg'},
          {to: '/app/marca', label: 'Marcas', icon:"/statics/icon-persona-menu.svg"}
        ],
        [
          {to: '/app/ordenEntrada', label: 'Nueva', icon:"/statics/icon-persona-menu.svg"},
          {to: '/app/ordenSalidaNueva', label: 'Orden de Salida', icon: '/statics/icon-persona-menu.svg'},
          {to: '/app/buscarOrden', label: 'Buscar', icon:"/statics/icon-persona-menu.svg"},
          {to: '/app/reporteTecnico', label: 'Reporte Tecnico', icon: '/statics/icon-persona-menu.svg'}
        ],
        [
          {to: '/app/registro', label: 'Registro', icon:"/statics/icon-persona-menu.svg"},
          {to: '/app/movil', label: 'Movil', icon: '/statics/icon-persona-menu.svg'},
          {to: '/', label: 'Salir', icon:"/statics/icon-persona-menu.svg"}
        ]

      ],
      dato:{
        to: null,
        label: null,
        icon: null
      }
    }
  },
  beforeMount(){
    this.$nextTick(()=>{
      if(LocalStorage.get.item('ruta').ruta == 'admin'){
        this.rutas('/app/ordenEntrada', 2)
        this.$refs.refColap2.show()
      }
      else{
        this.rutas(LocalStorage.get.item('ruta').ruta,LocalStorage.get.item('ruta').open)
      }
      //console.log(menu)
      this.sesion()
        if(SessionStorage.get.item('administrador')){
          //console.log(true)
        }else{
          this.$router.push('/')
        }
    })
    //LocalStorage.set("ruta",{ruta:'admin'})
    
  },
  mounted(){
    //this.rutas('/app/ordenEntrada', 2)
    //this.$refs.refColap2.show()
    //this.dato = {to: '/app/ordenEntrada', label: 'Nueva', icon:"/statics/icon-persona-menu.svg"}
    
    //this.prueba()
    
    //LocalStorage.set("cambios",{change:++i})
    /*if((LocalStorage.get.item("ruta").ruta) == 'admin'){
      LocalStorage.set("ruta",{ruta:''})
    }*/
    //this.listar()
    //LocalStorage.set('old',{n:15})
    //this.Interval(this.$store.state,10000)
  },
  computed:{
    
    ...Vuex.mapState({
      lista: 'lista',
      color: 'color',
      mensaje: 'mensaje',
      count: 'count',
      countOld:'countOld',
      cantidad:'cantidad'
    })
  },
  methods: {
    openURL,
    /*...Vuex.mapMutations({
      llenarLista : 'llenarLista',
    }),*/
    rutas(to, open){
      //this.notificaciones(open.toString())
      LocalStorage.set("ruta",{ruta:to, open: open})
      this.open = open
      //if(false){
      if(open == 0 || open == 3){
        this.$refs.refColap1.hide()
        this.$refs.refColap2.hide()
      }
      if(open == 1){
        this.$refs.refColap1.show()
        this.$refs.refColap2.hide()
      }
      if(open == 2){
        this.$refs.refColap2.show()
        this.$refs.refColap1.hide()
      }
      this.ruta = to
      this.$router.push(to)
    },
    show1(){
      if(this.open != 2){
         this.$refs.refColap2.hide()
      }
    },
    hide1(){
      if(this.open == 1){
        this.$refs.refColap1.show()
      }
    },
    show2(){
      if(this.open != 1){
         this.$refs.refColap1.hide()
      }
    },
    hide2(){
      if(this.open == 2){
        this.$refs.refColap2.show()
      }
    },
    notificaciones(mensaje){
      this.$q.notify({
        color: 'negative',
        position: 'top',
        message: mensaje,
        icon: 'report_problem'
      })
    },salir(){
      this.notificaciones('salir')
    },
    sesion(){
      //console.log(SessionStorage.get.item('administrador'))
    },
    ver(){
      this.$store.state.color = 'primary'
      LocalStorage.set("cambio",[])
      this.$refs.modalRef.show()
    },
    prueba(){
      console.log(this.$store.state.cantidad)
    },
    listar(){
      //state.cantidad = state.cantidad
      var state = this.$store.state
      var self = this
      var ruta = 'ordenEntrada/notificaciones'
      var datos = {fecha: new Date()}
      state.estado = true
      if((LocalStorage.get.item("ruta").ruta) == 'admin'){

      }
      http(ruta, datos, response => {
        state.lista = response.data.datos
        state.count = response.data.datos.length
        if(state.count > LocalStorage.get.item('old').n){
          state.lista.visto = 'false'
          console.log((state.count - LocalStorage.get.item('old').n) + 'notificaciones nuevas')
          state.color = 'red'
          self.cant = (state.count - LocalStorage.get.item('old').n)
          //state.cantidad = (state.count - LocalStorage.get.item('old').n)
          console.log('entro :' + state.cantidad)
          LocalStorage.set('old',{n:state.count})
        }
      },e =>{
        this.notificaciones(e.message)
      })
    },
    Interval(state,timer){
      var self = this
      
      var time = 0
      var time2 = 0
      state.estado = true
      if((LocalStorage.get.item("ruta").ruta) == 'admin'){
        console.log('cargo')
        var set1 = setInterval(function(){
          time += 100
          if(LocalStorage.get.item('cambio').length > 0){
            state.color = 'red'
          }
          //console.log(time)
          if(time > timer - 1){
            console.log(time)
            clearInterval(set1)
          }else{
            var ruta = 'ordenEntrada/notificaciones'
            var datos = {fecha: new Date()}
            http(ruta, datos, response => {
              state.lista = response.data.datos
              state.count = response.data.datos.length
              if(state.count > LocalStorage.get.item('old').n){
                state.color = 'red'
                var condicion = state.count - LocalStorage.get.item('old').n
                var cambio = LocalStorage.get.item('cambio')
                var cont = 0
                state.lista.forEach(item => {
                  if(cont < condicion){
                    cambio.push(item.id)
                    cont++
                  }
                })
                LocalStorage.set("cambio",cambio)
                LocalStorage.set("old",{n:state.lista.length})
              }
              //console.log(LocalStorage.get.item('cambio').length)
            },e => {
              this.notificaciones(e.message)
            })
            LocalStorage.set("ruta",{ruta:''})
          }
        },100)
      
      }

      var set2 = setInterval(function(){
        if(!state.estado){
          clearInterval(set2)
        }else{
          var ruta = 'ordenEntrada/notificaciones'
          var datos = {fecha: new Date()}
          ++time2 
          console.log(time2)
          if(LocalStorage.get.item('cambio').length > 0){
            state.color = 'red'
          }
          http(ruta, datos, response => {
            state.lista = response.data.datos
            if(state.lista.length > LocalStorage.get.item('old').n){
              state.color = 'red'
              console.log('ping')
              //state.color = 'red'
              var condicion = state.lista.length - LocalStorage.get.item('old').n
              var cambio = LocalStorage.get.item('cambio')
              var cont = 0
              state.lista.forEach(item => {
                if(cont < condicion){
                  cambio.push(item.id)
                  cont++
                }
              })
              LocalStorage.set("cambio",cambio)
              LocalStorage.set("old",{n:state.lista.length})
            }
          },e => {
            self.notificaciones(e.message)
          })
        }
      }, timer)
    
    },
  }
}
</script>

<style scoped>
  .activo{
    color: blue!important;
    font-weight: bold;
  }
  .item{
    padding: 0px!important;
    height: 20px!important;
  }
  .colapsibleActive{
    font-weight: bold;
  }
  .pointer {
   cursor: pointer;
  }
  .q-item-label{
    /*font-weight: bold;*/
    
  }

</style>
