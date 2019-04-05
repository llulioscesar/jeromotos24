<template>
  <transition appear enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
    <div class="row justify-center">
      <div class="bg-white shadow-2 desk" style="width:100%">
        <q-toolbar inverted class="text-primary" style="max-width:1012px; margin:0 auto">
          <img src="/statics/logo.png"/>
          <q-toolbar-title></q-toolbar-title>
          <q-btn color="primary" outline >
            Crear cuenta
          </q-btn>
        </q-toolbar>
      </div>
      <div class="col-md-12" style="padding:15px;">
        <vue-particles
            color="#dedede"
            :particleOpacity="0.7"
            :particlesNumber="100"
            shapeType="circle"
            :particleSize="4"
            linesColor="#dedede"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="2"
            :hoverEffect="false"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
          >
          </vue-particles>
        <div class="box-login">
          <div class="bg-white" style="max-width: 480px; width:100%;margin:0 auto;padding:15px;border-radius:15px;">
            <img src="/statics/logo.png"/>
            <h5 class="titulo-bienvenida"><strong>Iniciar sesión</strong></h5>
            <br>
            <q-input placeholder="Nombre de usuario" v-model="email"/>
            <q-input type="password" placeholder="Contraseña" v-model="password"/>
            <br>
            <div class="row items-center">
              <div class="col-md-6">
                <q-btn @click="sesion" class="btn-entrar" color="primary">
                  <strong>Iniciar sesión</strong>
                </q-btn>
                 <q-btn  @click="recuperar" class="btn-entrar" color="primary" >
                  <strong>Recuperar Contraseña</strong>
                </q-btn>
              </div>
            </div>
          </div>
          <ul class="box-footer-mobil">
            <li>Recuperar contraseña</li>
            <li>Crear cuenta</li>
          </ul>
          <div class="box-login-footer">
            <p style="line-height:45px" class="text-center text-white"><strong>2018 © Finca Report</strong></p>
            <p style="font-size:12px;margin-top:-40px;line-height:45px" class="text-center text-white"><strong>Creado por Nelson Caicedo y JCesar.co</strong></p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { LocalStorage, SessionStorage } from 'quasar'
  import sesion from 'src/funciones/sesion'
  
  export default {
    data () {
      return {
        correo:null,
        email: null,
        user: null,
        password: null,
        datos: null,
        uid: null,
      }
    },
    mount(){
     
    },
    beforeMount(){
      this.$nextTick(()=>{
        LocalStorage.clear()
        SessionStorage.clear()
        //this.email = ""
        //this.password = ""
        console.log(this.email)
        console.log(this.password)
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
     recuperar(){
       if(this.email !== null){
         this.notificaciones("enviado")
         this.$auth.sendPasswordResetEmail(this.email)
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
      var el = this
      if(this.email !== null && this.password !== null){
      this.$auth.signInWithEmailAndPassword(this.email, this.password)
      .then((response) => {
        console.log(response)
        if(response){
        this.uid = response.user.uid 
          this.$axios.post('http://localhost:8080/persona/buscarUid',{uid: this.uid})
          .then((response) => {
            this.datos = response.data.datos
            if(this.datos.rol === 2){
              LocalStorage.set("administrador",this.datos)
              //SessionStorage.set("administrador",this.datos)
            //console.log(SessionStorage.get("administrador"))
              this.$router.push('app/persona')
            }else if(this.datos.rol === 1){
              LocalStorage.set("tecnico",this.datos)
              this.$router.push('tecnico/ordenSalida')
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
body{
  background: #f1f6fa;
  background-image: url('/statics/entrar.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding-right: 0px!important;
}
.desk{
  display: block;
}
.box-login{
  max-width:1012px;
  width:100%;
  margin:80px auto 0 auto;
  border-radius: 15px;
}
.box-login-footer{
  /*background: linear-gradient(45deg, #08afe9 0%, #2bf498 100%)!important;*/
  border-radius: 0 0 15px 15px;
  width: 100%;
  margin-top: 200px;
  min-height: 50px;
  display: block;
}
.q-if{
  background: rgba(240,240,240,1);
  border-radius: 15px;
  padding: 4px 8px;
  margin-top: 15px;
}
.q-if-focused:before, .q-if-focused:after, .q-if:before, .q-if:after{
  color: transparent!important;
}
.btn-entrar{
  background: linear-gradient(45deg, #08afe9 0%, #2bf498 100%)!important;
  border-radius: 15px;
}
.box-footer-mobil{
  display: none;
}
.opciones{
  display: block;
}
.box-login img {
  display: none;
}
@media (max-width:767px) {
  .desk{
    display: none!important;
  }
  .box-footer-mobil{
    list-style: none;
    width: 200px;
    margin: 0 auto;
    display: block;
    margin-top: 40px;
    padding: 0;
  }
  .box-footer-mobil li {
    margin-bottom: 10px;
    text-align: center;
  }
  body{
    background: #fff;
  }
  .box-login{
    margin-top: 0px;
  }
  .btn-entrar{
    width: 100%;
  }
  .box-login-footer{
    display: none;
  }
  .opciones{
    display: none;
  }
  .box-login img {
    display: block;
    width: 150px;
    margin: 0 auto;
  }
  .titulo-bienvenida{
    text-align: center;
    font-size: 18px;
  }
}
.particles-js-canvas-el{
  position: absolute;
  right: 0;
  left: 0;
  bottom: -50px;
  top:50px;
  width: 100%!important;
  height: calc(100% - 50px)!important;
  z-index: -1;
}
</style>
