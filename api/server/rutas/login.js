import express from 'express'
import { sequelize, Persona, Transacciones } from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'
import admin from 'firebase-admin'
import a from 'firebase'
var router = express.Router()

const Op = Sequelize.Op

router.post('/ingresar', async (req, res) => {
  return sequelize.transaction(t => {
    return Persona.findOne({
      where: {
        user: req.body.user,
        contrasena: req.body.contrasena
      }, transaction: t
    })
  }).then(result => { 
    res.json({    
      error: false,
      datos: result
    })
  }).catch(e => { 
        res.json(error(e))
  })
})



router.post('/recuperar', async (req, res) => {   
  admin.auth().getUser(req.body.uid).then(function(userRecord) {
    res.json({
      error: false,
      datos: userRecord.email
  })
  })
  .catch(function(error) {
    console.log("Error creating new user:", error);
  })
})

router.post('/updateUid', async (req, res) => {   
  admin.auth().updateUser(req.body.uid, {
      email: req.body.email,
      emailVerified: false,
      phoneNumber: req.body.telefono,
      displayName: req.body.nombre,
  }).then(function(userRecord) {
        res.json({
          error: false,
          datos: userRecord
        })
    })
    .catch(function(error) {
      console.log("Error updating user:", error);
      res.json(error(e))
    });
  })


router.post('/createUid', async (req, res) => {   
  admin.auth().createUser({
      email: req.body.email,
      emailVerified: false,
      phoneNumber: req.body.telefono,
      password: req.body.pwd,
      displayName: req.body.nombre,
  }).then(function(userRecord) {
     
      res.json({
        error: false,
        datos: userRecord
    })
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    })
  })

  router.post('/listar', async (req, res) => {   
    function listAllUsers(nextPageToken) {
        // List batch of users, 1000 at a time.
        admin.auth().listUsers(1000, nextPageToken)
          .then(function(listUsersResult) {
            listUsersResult.users.forEach(function(userRecord) {
              console.log("user", userRecord.toJSON());
            });
            if (listUsersResult.pageToken) {
              // List next batch of users.
              listAllUsers(listUsersResult.pageToken)
            }
          })
          .catch(function(error) {
            console.log("Error listing users:", error);
          });
      }
      // Start listing users from the beginning, 1000 at a time.
      listAllUsers();
})

router.post('/destroyUid', async (req, res) => {   
    admin.auth().deleteUser(req.body.uid)
  .then(function(userRecord) {
    res.json({
      error: false,
      datos: userRecord
  })
  })
  .catch(function(error) {
    console.log("Error deleting user:", error);
  });
})


router.post('/email', async (req, res) => {   
  admin.auth().getUserByEmail(req.body.email)
  .then(function(userRecord) {
    res.json({
      error: false,
      datos: userRecord
  })
  })
  .catch(e => {
    res.json(error(e))
})

})

router.post('/verificacion', async (req, res) => {   
  
})

router.post('/update', async (req, res) => {
  //var registro = {fecha: new Date(), accion: 'cerrar'}
  console.log(req.body)
  return Transacciones.update(req.body,{
    where:{
      id: 1
    }
  }).then (result=>{
      res.json({
        error: false,
        datos: result
      })
  }).catch(e => {
     res.json(error(e))
  })
})






export default router