<template>
    <q-layout class="flex-center body">
      <div class="zonatransparencia">
        <div class="seccionlogin">
          <div class="logo"></div>
          <div class="grupo">
              <input type="text" class="input_login">
              <label>Usuario</label>
          </div>
          <div class="grupo"></div>
        </div>
      </div>
    </q-layout>    
</template>
<style scoped>
.body{
  background: url('/statics/fondo4.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right;

  
    background-attachment: fixed;
    /*background-position: center center;*/
    overflow: hidden;
    position: relative;
}

.zonatransparencia{
    float: right;
    position: relative;
    width: 400px;
    height: 100vh;
    background: rgba(16,15,15,0.82);
    display: flex;
    justify-content: center;
    align-items: center;
}

.seccionlogin{
    padding-top: 20%;
    padding-bottom: 20%;
    height: auto;
    min-width: 320px;
}

.logo{
    height: 90px;
    
    background-position: center center;
    background-repeat: no-repeat;
    margin-bottom: 40px;
}

.grupo {
    position: relative;
    margin-bottom: 45px;
    text-align: center;
}

.input_login {
    font-size: 16px;
    padding: 10px 10px 5px 5px;
    width: 250px;
    border: none;
    border-bottom: 1px solid #ffffff;
    background: none;
    color: #fff;
}

</style>

