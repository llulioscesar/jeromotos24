import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import error from './funciones/error'
import admin from 'firebase-admin'
import adminSDK from './adminsdk.json'
import cors from 'cors'
//import VueAudio from 'vue-audio';



admin.initializeApp({
  credential: admin.credential.cert(adminSDK),
    apiKey: "AIzaSyC8g0r5FYg0twLZv43RhjaHgDeiyMkyIq8",
    authDomain: "jeromoto-a920c.firebaseapp.com",
    databaseURL: "https://jeromoto-a920c.firebaseio.com",
    projectId: "jeromoto-a920c",
    storageBucket: "jeromoto-a920c.appspot.com",
    messagingSenderId: "826180265231"
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

console.log(__dirname);


fs.readdirSync(path.join(__dirname, 'rutas')).forEach((file) => {
    var name = file.substr(0, file.indexOf('.'))
    if(name == "index"){
      const func = require(`./rutas/${name}`).default
      app.use('/', func)
    }else {
      const func = require(`./rutas/${name}`).default
      app.use('/' + name, func)
    }

})

app.use(function(err, req, res, next) {
 console.error(err);
  res.status(500).send(JSON.stringify(error(err)));
});

app.use((req, res, next) => {
  const err = new Error('No encontrado');
  err.status = 404;
  next(err);
});

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});

export default app
