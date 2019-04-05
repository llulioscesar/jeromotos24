import app from './app'
import http from 'http'
import {sequelize} from './database'
//import clientMQTT from './mqtt'
//import clientMQTT from './mqtt'
import mqtt from 'mqtt'
import moment from 'moment'
import clientMQTT from './conexion'
app.set('port', 8080)

const server = http.createServer(app)

server.listen(8080, () => {

  /*client.on('connect', function () {
    sequelize.sync({ force: false }).then(() => {
      console.log('MARIADB RUNNING');
        //client.publish('jeromotos/71', "hola mundo", {qos:1})
        clientMQTT(mqtt)
      }).catch(err => {
          console.log(err);
      })
  })*/



  sequelize.sync({ force: false }).then(() => {
    console.log('MARIADB RUNNING');
    //clientMQTT(mqtt)
  }).catch(err => {
    console.log(err);
  })
})

server.on('error', (error) => {
  if(error.syscall !== 'listen'){
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;


    
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
})

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
});
