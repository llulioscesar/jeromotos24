import error from '../funciones/error'
export default (mqtt, err, data, uid, t, o) => {
  if(err){
    console.log(err);
    var r = {
      error: true,
      mensaje: error(err)
    }
    mqtt.publish(uid.toLowerCase(), JSON.stringify(r), {qos: 0})
  } else {
    r = {
      tabla: t,
      operacion: o,
      datos: JSON.stringify(data)
    }
    console.log(uid.toLowerCase())
    mqtt.publish(uid.toLowerCase(), JSON.stringify(r), {qos: 1})
  }
}
