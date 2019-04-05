<template>
  <div class="content" style="background:#292d2b; border-radius:5px">
    
    <q-table
      class="bg-white"
      :data="tabla"
      :columns="columns"
      :title= "titulo"
      row-key="name"
      style="max-width:650px;width:100%;margin-left:auto;margin-right:auto;display:blockd"
    >
    
    <q-tr slot="body" slot-scope="props" :props="props">
      <q-td key="servicioTaller" :props="props">
        <q-checkbox 
          v-model="checked"
          :val="props.row.servicioTaller.id" 
          :label="props.row.servicioTaller.nombre"
          @input="change(props.row)"/>
      </q-td>
      <q-td key="kilometraje" :props="props">
        {{ props.row.kilometraje }}
        <q-popup-edit persistent v-model="props.row.kilometraje" title="Update Kilometraje" buttons  @save="(val, row) => { guardarK(val, props.row) }"
         @hide="cerrar" @show="open(props.row)">
          <q-field count>
          <q-input type="number" @keydown ="kd($event,props.row)" @keyup="ku($event,props.row)"
                   clearable @blur="bl" @clear="cl"  v-model="props.row.kilometraje" />
          </q-field>
        </q-popup-edit>
      </q-td>
      <q-td key="tiempo" :props="props">
        {{ props.row.tiempo }}
        <q-popup-edit v-model="props.row.tiempo" title="Update Tiempo" buttons @save="(val, row) => { guardarK(val, props.row) }" >
          <q-input type="number" v-model="props.row.tiempo" />
        </q-popup-edit>
      </q-td>
    </q-tr>
  </q-table>
  
  <div class="row q-pt-lg justify-center">
    <q-btn-group>
     <q-btn  color="negative" @click.native="guardar" >Guardar</q-btn>
      <q-btn  outline color="negative" @click.native="cancelar" >Cancelar</q-btn>
    </q-btn-group>
  </div>
  {{tabla}}
  <q-modal minimized :content-css="{minWidth: '50vw'}" ref="modalRef" >
      <div class="q-pa-md relative" style="border: 1px solid red">
        <p class="absolute text-white q-pa-xs bg-negative" style="top:0;left:0;right:0">Cancelar</p>
        <div class="row q-pa-lg justify-center text-bold q-headline ">{{mensaje}}</div>

        <div class="row q-pt-lg justify-center">
          
          <q-btn-group>
            <q-btn color="negative" label="aceptar" @click.native.stop="ok" />
            <q-btn outline color="negative" label="cancelar" @click.native.stop="no"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>
 
  
 </div>
</template>

<script>
  import axios from 'axios'
  import { filter } from 'quasar'
  import { LocalStorage, SessionStorage } from 'quasar'
  import validar from 'src/funciones/validar'
  import http from 'src/funciones/http'

  export default{
    data(){
      return{
        columns: [
          { name: 'servicioTaller', label: 'Servicio Taller', field: 'serviciotaller',  align: 'left', },
          { name: 'kilometraje', label: 'Kilometraje', field: 'kilometraje'},
          { name: 'tiempo', label: 'Tiempo(dias)', field: 'tiempo' },
        ],
        tabla: [],
        lista: [],
        nueva: true,
        mensaje: null,
        checked:[],
        titulo: null,
        index: null
      }
    },
    beforeMount(){
      this.$nextTick(() => {
        this.cargarTabla()
        this.buscarMarca()
      })
    },
    updated(){
      console.log('update')
    },
    methods:{
      open(row){
        this.index = row.__index
      },
      kd(event,row){
        //console.log('kd: ' + event.key)
        var x = row.__index
        //console.log(this.tabla[x])
      },
      ku(event,row){
        //console.log('ku' + event.key)
        //console.log('row: ' + row.kilometraje)
        
      },
      bl(){
        //this.notificaciones('blur')
      },
      cl(clearVal){
        //this.notificaciones(clearVal)
      },
      cerrar(){
        console.log('cerrar')
      },
      cargarTabla(){
        const ruta = 'tablaMantenimiento/findAllByTipo'
        let item = SessionStorage.get.item('referencia').id
        //console.log(item)
        const datos = {tipo_motoId: item }
        http(ruta, datos, result => {
          //console.log(result.data.datos)
          this.tabla = result.data.datos
          this.tabla.forEach(item => {
            if(item.estado){
              this.checked.push(item.servicioId)
            }
          })
          if(this.checked.length > 0){
            this.nueva = false
          }
          }, e =>{
            this.notificaciones(e.message)
         })
    },
    buscarMarca(){
       const ruta = "marca/findOneByTipo"
       const datos = {id: SessionStorage.get.item('referencia').marcaId } 
       http(ruta, datos, result => {
            this.titulo = "Tabla Mantenimiento Motocicleta " + " " + result.data.datos.nombre + " " + SessionStorage.get.item('referencia').referencia
       }, e =>{
            this.notificaciones(e.message)
       })
    },
    notificaciones(mensaje){
       this.$q.notify({
          color: 'negative',
          position: 'top',
          message: mensaje,
          icon: 'report_problem'
         })
    },
    change(row){
        if(row.estado == 1){
          this.checked.push(row.servicioTaller.id)
        }else{
          let index = this.checked.indexOf(row.servicioTaller.id)
          if ( index > -1) {
               this.checked.splice(index, 1)
            }
        }
    },
    
    guardarK(val, row){
       /*console.log(val)
       console.log(row)
       if(row.kilometraje == null){
         row.kilometraje = 0
       }else if(row.tiempo == null){
         row.tiempo = 0
       }
       if(row.kilometraje > 0 || row.tiempo > 0){
          if(row.estado == 0){
            row.estado = 1
            this.checked.push(row.servicioTaller.id)
          }
       }
       if((row.kilometraje == null || row.kilometraje == 0) && (row.tiempo == null || row.tiempo ==0)){
         if(row.estado == 1){
            row.estado = 0
            let index = this.checked.indexOf(row.servicioTaller.id)
            if ( index > -1) {
               this.checked.splice(index, 1)
            }
          }
        }*/
      },
      
      guardar(){
       
        if(this.checked.length > 0){
          this.tabla.forEach(item => {
            if(item.kilometraje == null){
              item.kilometraje = 0
            }
            if(item.tiempo == null){
              item.tiempo = 0
            }
             
            const ruta = 'tablamantenimiento/update'
            http(ruta, item, result => {
              //console.log(result.data.datos)
              this.$router.push('/app/tipoMoto')
            }, e =>{
              this.notificaciones(e.message)
            })
            
          
          })
        }else{
          this.notificaciones("debe llenar la tabla")
        }
      },
      cancelar(){
        this.$refs.modalRef.show()
        if(this.nueva){
          this.mensaje = "Perdera los cambios Realizados y se eliminara la referencia"
        }else{
          this.mensaje = "Perdera los cambios Realizados "
        }
      },
      ok(){
        if(this.nueva){
          const ruta = 'tipomoto/destroy'
          let datos = { id: SessionStorage.get.item('referencia').id }
          http(ruta, datos, result => {
              this.$router.push('/app/tipoMoto')
            }, e =>{
              this.notificaciones(e.message)
            })
        }else{
          this.$router.push('/app/tipoMoto')
        }
        //this.$router.push('/app/tipoMotoNueva')
      },
      no(){
        this.$refs.modalRef.hide()
      }

    }
  }
</script>
<style>
.content{
  background: white;
  padding: 24px;
  margin: 0 auto;
  max-width: 1110px;
  width: 100%;
  display: block;
}
.q-item-label{
  
  margin: 4px 4px!important;
}
.no-pad{
  padding: 0 16px!important;
}
input {
  color: #000!important;
}
.q-table-title{
  font-weight: bold; 
}
.q-table-top{
  background: red;
  color: white; 
}
</style>