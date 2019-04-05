import Vue from 'vue'
import Vuex from 'vuex'
import http from 'src/funciones/http'
import mapear from 'src/funciones/mapeo'



//import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default new Vuex.Store({

  state:{
    lista:[],
    count: 0,
    color: 'primary',
    estado: false,
    countOld: 0,
    cantidad: 0
  },
  mutations:{
    llenarLista(state){
      console.log(state)
      var ruta = 'ordenEntrada/notificaciones'
      var datos = {fecha: new Date()}
      
      //console.log(state.color)
      http(ruta, datos, response => {
        //state.lista = mapear.notificacionesServicios(response.data.datos)
        state.lista = response.data.datos
        state.count = state.lista.length
        //console.log(state.cantidad)
        //state.color = 'black'
      },e => {
        console.log(e.message)
      })
    },
    llenarListaInterval(state){
      setInterval(function(){
        //mutations.prueba()
        state.mensaje = (new Date()).toString()
        var ruta = 'ordenEntrada/notificaciones'
        var datos = {fecha: new Date()}
        //console.log(state.count)
        http(ruta, datos, response => {
          state.lista = response.data.datos
          if(state.lista.length > state.count){
            state.color = 'red'
            console.log('ping')
            state.count = state.lista.length
          }
          return state.mensaje
        },e => {
          console.log(e.message)
        }) 
      }, 5000)
    },
    mostrar(state){
      console.log(state)
    }
  },
  actions:{
    peticion: function({commit}){
      var ruta = 'ordenEntrada/notificaciones'
      var datos = {fecha: new Date()}
      const lista = []
      http(ruta, datos, response => {
        //lista = response.data.datos
        commit('llenarLista',response.data.datos)
      },e => {
        console.log(e.message)
      })
      //commit('llenarLista',lista)
    }
  },
})
  
