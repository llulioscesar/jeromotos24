var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

client.subscribe("mqtt/demo")

client.on("message", function (topic, payload) {
    console.log([topic, payload].join(": "))
    
    client.end()
  })
 
  client.publish("mqtt/demo", "world!")

console.log('subscribe persona')