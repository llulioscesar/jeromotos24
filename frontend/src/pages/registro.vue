<template>
    
</template>
<script>

import http from 'src/funciones/http'

export default {
  data(){
    return{

    }
  },
  beforeMount(){
    this.$nextTick(()=> {
      this.cargarLista()
    })
  },
  methods:{
    cargarLista(){
      var ruta = 'transacciones/findAll'
      http(ruta, null, response => {
        //var datos = JSON.parse(JSON.stringify(response.data.datos))
        var datos = (JSON.stringify(response.data.datos))
        datos = JSON.parse(datos)
        console.log(datos)
        //console.log(JSON.parse(datos[0].registro))
      },e => {

      })
    }
  }
}
</script>
