import os from 'os'
import exec from './exec'
var jwt = require('jsonwebtoken')

export default (mqtt) => {

  var client = mqtt.connect('mqtt://127.0.0.1', {
    username: 'frClient',
    password: 'FincaReport748596',
    clientId: 'servidor_' + os.hostname,
    qos: 1,
    clean: false
  })

  client.subscribe('app/servidor', { qos: 1 })

  client.on('message', function (topic, message) {
    let msj = String.fromCharCode.apply(null, message)
    var json = null
    try {
      json = JSON.parse(msj)
      console.log('------------------------------')
      console.log(json)
      console.log('------------------------------')
    }catch(err){
      console.log(err)
    }

    if(json != null){
      try {
        var decode = jwt.verify(json.token, '@#MiScAmElLoS8462', { algorithms: ['HS384'] })
        json['token'] = {
          uid: decode.uid,
          rol: decode.rol
        }
        if(json.datos != null){
          json['datos'] = JSON.parse(json.datos)
          exec(client, json)
        }
      } catch(err) {
        console.log(err);
      }
    }
  })

  client.on('connect', function () {
    console.log('MQTT RUNNING')
  })
}
