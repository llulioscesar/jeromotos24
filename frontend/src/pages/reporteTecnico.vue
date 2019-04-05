<template>
    <div class="q-px-md q-py-xl" style="background:#292d2b;color:white"  >
      {{totalServicios}}
      {{totalRepuestos}}
      <q-list separator no-border >
      	<q-item v-for="(dato, i) in listaTecnicos" :key="i" >
        	<q-item-side>
            <q-item-tile icon>
              <img src="/statics/icons/icon-persona.svg">
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile class="q-ma-xs" label>{{dato.nombre}}</q-item-tile>
            <q-item-tile sublabel><strong> Total Servicios:</strong>{{dato.totalServicios}}</q-item-tile>
            <q-item-tile sublabel><strong> Total Repuestos:</strong>{{dato.totalRepuestos}}</q-item-tile>
          </q-item-main>
          <q-item-side right>
          	<q-btn class="q-mr-xs" color="primary" @click.native.stop="editar(i,'Editar')" icon="create"/>
          </q-item-side>
        </q-item> 
        <q-item>
          <q-item-main>
            <q-item-tile class="q-ma-xs " label></q-item-tile>
            <q-item-tile sublabel class="q-display-1"><strong> Total Servicios:</strong>{{totalServicios}}</q-item-tile>
            <q-item-tile sublabel class="q-display-1"><strong> Total Repuestos:</strong>{{totalRepuestos}}</q-item-tile>
            <q-item-tile sublabel class="q-display-1"><strong> Total:</strong>{{total}}</q-item-tile>
          </q-item-main>
        </q-item> 
      </q-list>    
    </div>
</template>

<script>

import http from 'src/funciones/http'
import mapear from 'src/funciones/mapeo'

export default {
 	data(){
		return{
			listaTecnicos: [],
		}
	},
	beforeMount(){
    this.cargarTecnicos()
  },
  computed:{
    totalServicios: function () {
      var suma = 0
      this.listaTecnicos.forEach(element => {
          suma += parseInt(element.totalServicios)
      })
      return suma
    },
    totalRepuestos: function () {
      var suma = 0
      this.listaTecnicos.forEach(element => {
          suma += parseInt(element.totalRepuestos)
      })
      return suma
    },
    total: function() {
      return parseInt(this.totalServicios) + parseInt(this.totalRepuestos)
    }

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
		cargarTecnicos(){
      http('ordenEntrada/reporte', null, response =>{
        this.listaTecnicos = mapear.reporte(response.data.datos)
        this.listaTecnicos.sort(function (a, b) {
          if (a.totalServicios > b.totalServicios) {
            return -1;
          }
          if (a.totalServicios < b.totalServicios) {
            return 1;
          }
          return 0;
        })
      },e =>{
        this.notificaciones(e.message)
      })
    },
	}
}
</script>

<style scoped>

.q-item-label{
  color:#FFF;
  margin: 10px 0px 10px 10px;
}
.q-item-sublabel{
  color:#FFF;
  margin: 4px 0px 4px 10px;
}


</style>


