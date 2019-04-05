<template>
  <q-layout class="flex-center body">
  <q-page-container>
    <q-page class="flex flex-center">
      <q-card class="login">
        <q-card-main>
          <q-select v-model="select" :options="selectOptions" separator  @input="selected"
            :readonly="only" :float-label="!true ? 'Usuario' : ''" ref="selectRef" class="text-black" />
          <br>
          <q-input type="password" v-model="pwd" placeholder="Contraseña" no-pass-toggle class="text-white" />
        </q-card-main>
        <br>
        <q-card-actions>
          <q-btn  class="btn" @click="sesion" label="Iniciar tttt" />
          <q-btn  class="btn"  label="Recuperar Contraseña" />
        </q-card-actions>
      </q-card>
    </q-page>
  </q-page-container>
</q-layout>
</template>

<script>
  
  import mapear from 'src/funciones/mapeo'
  //import sesion from 'src/funciones/sesion'
  
  export default {
    data () {
      return {
        usuario: null,
        //correo: null,
        //pwd: null,
        correo: null,
        pwd: '1065864163',
        datos: null,
        uid: null,
        select: null,
        selectOptions: [],
        length: 0,
        only: false,
        list:[],
        
      }
    },
    beforeMount(){
      this.$nextTick(()=>{
        
        if(this.$q.localStorage.get.all().cambio === undefined){
          LocalStorage.set("cambio",[])
        }
        if(this.$q.localStorage.get.all().rutas === undefined){
          LocalStorage.set("ruta",null)
        }

        this.cargarAdmin()
        //this.crearLista()
        //LocalStorage.clear()
        //console.log(LocalStorage.isEmpty())
        //SessionStorage.clear()
        //this.listar(this.$store.state)
        //LocalStorage.set("cambios",{change:0})
        
        //this.notificaciones('before Admin')
        //this.notificaciones(this.length.toString())
      })
    },
    mounted(){
      this.listar(this.$store.state)
      
    },
    computed:{
    ...Vuex.mapState(['lista','color','estado','count','countOld']),
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
      listar(state){
        state.estado = false
        var ruta = 'ordenEntrada/notificaciones'
        var datos = {fecha: new Date()}
        http(ruta, datos, response => {
          LocalStorage.set('old',{n:response.data.datos.length})
        },e =>{
          this.notificaciones(e.message)
        })
      },
      crearLista(){
        //console.log(mapear.crear(1,10))
        http('persona/createLista',{lista:mapear.crear(1,10)}, response =>{
        },e =>{
          this.notificaciones(e.message)
        }) 
      },
      cargarAdmin(){
        http('persona/findAdmin', null, response => {
            this.selectOptions = mapear.admin(response.data.datos)
            this.length = response.data.datos.length
            if(response.data.datos.length == 0){
              this.only = true
            }
            else if(response.data.datos.length == 1){
              this.select = response.data.datos[0].value
              this.correo = response.data.datos[0].sublabel
              this.only = true
            }
            else{
              this.$refs.selectRef.show()
              this.only = false
            }
            
        },e =>{
          this.notificaciones(e.message)
        })
      },
      selected(obj){
        this.selectOptions.forEach(item => {
          if(obj === item.value){
            this.correo = item.sublabel
            return
          }
        })
      },
      recuperar(){
        if(this.correo !== null){
          this.notificaciones("enviado")
          this.$auth.sendPasswordResetEmail(this.correo)
          .then((response) => {
            console.log("correo enviado")
          })
          .catch((e) => {
            this.notificaciones(e.message)
          })
        }else{
          this.notificaciones("llenar correo")
        }  
      },
      sesion(){
        var self = this
        if(this.correo !== null && this.pwd !== null){
          this.$auth.signInWithEmailAndPassword(this.correo, this.pwd)
          .then((response) => {
            //console.log(response)
            if(response){
              this.uid = response.user.uid 
              this.$axios.post('http://localhost:8080/persona/buscarUid',{uid: this.uid})
              .then(response => {
                this.datos = response.data.datos
                if(true){
            //if(this.datos.rol > 0){
              //LocalStorage.set("administrador",this.datos)
                  SessionStorage.set("administrador",this.datos)
                  //LocalStorage.set("cambios",{change:true})
            //console.log(SessionStorage.get("administrador"))
                  LocalStorage.set("ruta",{ruta:'admin'})
                  this.$router.push('app/ordenEntrada')
                  
            //console.log("true")
                }else{
                  this.notificaciones("No eres administrador") 
                }  
              })
          .catch((e) => {
            this.notificaciones(e.message)
          })
        }
      }).catch(function(error) {
 
      //console.log(error.code)
      //console.log(error.message)
         el.notificaciones(error.message)
       })  
     }
     },
     salir(){
       this.$auth().signOut().then(function() {
        // Sign-out successful.
       }).catch(function(error) {
        // An error happened.
       })
     },
    }
  }
</script>

<style>
.body{
  background: url('/statics/fondo4.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right;
}
.login {
  backdrop-filter: blur(4px);
  max-width: 500px;
  width: 100%;
  padding: 24px;
  /*background: rgba(0,0,0,0.55);*/
  background: transparent;
  box-shadow: none!important;
}
input{
  color: black!important;
}
.q-if-label{
  color: black!important;
}

.q-if-label .q-if-label-above{
  color: red!important;
}

.q-item-letter{
  border-radius: 50%!important;
  background: blue!important;
  text-align: center!important;
}


.btn{
   border: none;
   outLine: none;
   width: 500px;
   background: #b80f22;
   margin: 10px;
}
</style>
