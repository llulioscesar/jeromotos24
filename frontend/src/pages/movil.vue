<template>
  <div >
    <q-page padding style="background:#292d2b;color:white">
     {{options}}
    <q-list separator no-border class="q-mt-xs q-pt-md inset-separator"  style="max-width:650px;width:100%;margin:auto" >
      <q-list-header class="q-display-1 text-center" style="color:#FFFFFF;">Motocicletas App</q-list-header>
        <q-item link v-for="(dato, i) in datos" :key="i" @click.native="proximos(dato)" >
          <q-item-side link @click.native="ver(dato)">
            <q-item-tile icon>
              <img src="/statics/icon-moto.svg">
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile class="q-ma-xs" label>{{dato.placa}}</q-item-tile>
              <q-item-tile sublabel><strong> Referencia:</strong>{{dato.tipo_moto.referencia}}</q-item-tile>
              <q-item-tile sublabel><strong> Marca:</strong>{{dato.tipo_moto.marca.nombre}}</q-item-tile>
              <q-item-tile sublabel><strong> Km Promedio:</strong>{{dato.km_promedio}}</q-item-tile>
          </q-item-main>
            <q-item-side right>
              <q-btn class="q-mr-xs" color="red" @click.native.stop="tablaContador(dato)" icon="create"/>
              <q-btn class="q-mr-xs" color="yellow" label="Tabla" @click.native.stop="tablaMantenimiento(dato)" icon="create"/>
              
              <q-btn class="q-mr-xs" color="primary" label="Orden" @click.native.stop="cargarListaOrden(dato)" icon="create"/>
            </q-item-side>
        </q-item>
      </q-list>
      <q-collapsible v-if="false" icon="explore" label="Tabla Mantenimiento">
        <q-table
          title="Table Title"
          :data="tableData"
          :columns="columns"
          row-key="name"
        />
      </q-collapsible>
      <q-collapsible icon="explore" label="Proximos Servicios">
        <q-list v-if="listaContador != null">
          <q-item link v-for="(item, i) in listaContador" :key="i" >
            <q-item-main>
              <q-item-tile class="q-ma-xs" label>{{item.servicioTaller.nombre}}</q-item-tile>
                <q-item-tile sublabel><strong> Referencia:</strong>{{item.fecha_km}}</q-item-tile>
                <q-item-tile sublabel><strong> Marca:</strong>{{item.fecha_time}}</q-item-tile>
            </q-item-main>
          </q-item>  
        </q-list>
      </q-collapsible>
      <q-select v-model="option" class="q-mx-md" :options="options" @input="verOrden" float-label="Orden Servicio"/>
    </q-page>
  </div>
</template> 

<script>
  import http from 'src/funciones/http'
  import mapear from 'src/funciones/mapeo'
  
  export default {
    data(){
      return{
        listaContador: null,
        option: null,
        options:[],
        contador:{
          id: null,
          fecha_km: null,
          fecha_time: null,
          servicioId: null,
          motoId: null,
          servicioTaller: {
            id: null,
            nombre: null
          }
        },
        datos:[],
        columns: [
          { name: 'servicioTaller', label: 'Servicio Taller', field: 'serviciotaller',  align: 'left', },
          { name: 'kilometraje', label: 'Kilometraje', field: 'kilometraje'},
          { name: 'tiempo', label: 'Tiempo(dias)', field: 'tiempo' },
        ],
        tableData:[]
        /*dato:{
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
          }
        }*/
      }
    },
    beforeMount(){
      this.$nextTick(()=> {
        this.cargarListaMotos()
      })
    },
    methods: {
      
      proximo(dato){
        
      },
      ver(dato){
        
      },
      cargarListaMotos(){
        var ruta = 'moto/findByPersona'
        var datos = {propietarioId: 1}
        http(ruta, datos, response =>{
          this.datos = response.data.datos
        },e=> {
          this.notificaciones(e.message)
        })
      },
      cargarListaOrden(dato){
        this.option = null
        var ruta = 'ordenEntrada/findByMotoMovil'
        var datos = {motoId: dato.id}
        http(ruta, datos, response =>{
          this.options = mapear.ordenMovil(response.data.datos)
        },e=> {
          this.notificaciones(e.message)
        })
      },
      verOrden(){
        if(this.option != null){
          
        }
      },
      tablaMantenimiento(dato){
        var ruta = 'tablamantenimiento/serviciosactivos'
        var datos = {tipoMoto: dato.tipo_motoId}
        http(ruta, datos, response =>{
          this.tableData = mapear.tablaMovil(response.data.datos)
        },e=> {
          this.notificaciones(e.message)
        })
      },
      tablaContador(dato){
        var ruta = 'contador/findByMoto'
        var datos = {motoId: dato.id}
        http(ruta, datos, response =>{
          this.listaContador = (response.data.datos)
        },e=> {
          this.notificaciones(e.message)
        })
      }
    }
  }
</script>
   