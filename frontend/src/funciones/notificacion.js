import http from 'src/funciones/http'
import moment from "moment"
import VueMomentJS from "vue-momentjs"

const notif = {
    tiempo :(x) => setInterval(function(){
        console.log(x)
        return x+1
    },10000)
}

export default notif






/*const obj = setInterval(function(x){
    console.log(moment(new Date()).format("YYYY[-]MM[-]DD hh:mm:ss"))
    var ruta = 'ordenEntrada/notificaciones'
    var datos = {fecha: new Date()}
    //var x = new Date()
    //console.log(x)
    http(ruta, datos, response => {
      //x = response.data.datos.count
      //console.log(x)
    },e => {
      console.log(e.message)
    })
    return x++
  },2000)

export default obj*/