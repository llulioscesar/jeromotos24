import express from 'express'
import midleware from '../midleware'
import { sequelize, ServicioTaller, TipoMoto, Moto, TablaMantenimiento, Contador } from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'

import { Validator as JSF } from 'jsonschema'
const validar = new JSF()
var router = express.Router()

const Op = Sequelize.Op

router.post('/insert' ,async (req, res) => {
    return sequelize.transaction(t => {
        if(req.body.id > 0){
            return ServicioTaller.update(req.body, {
                where: {
                    id: req.body.id
                }, 
                individualHooks: true,
                transaction: t })
            }else{
                return ServicioTaller.create(req.body, { transaction: t })
            }   
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})

router.post('/destroy', async (req, res) => {
    return sequelize.transaction(t => {
            return ServicioTaller.destroy({ 
                where:{
                    id: req.body.id
                },
                transaction: t 
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

router.post('/findOrCreate', async (req, res) => {
    return sequelize.transaction(t => {
        return ServicioTaller.findOrCreate({
            where: 
            {
             nombre: req.body.nombre
            },
            transaction: t
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



//ruta vieja
router.post('/create' ,async (req, res) => {
    return sequelize.transaction(t => {
        if(req.body.id > 0){
            return ServicioTaller.update(req.body, {
                where: {
                    id: req.body.id
                }
            },{ transaction: t })
            }else{
                return ServicioTaller.create(req.body, { transaction: t })
            }   
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})

router.post('/findAll', async (req, res) => {
    
    return sequelize.transaction(t => {
        return ServicioTaller.findAll( 
            { 
                order: [
                    ['nombre', 'asc']
                ],transaction: t 
            })
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            res.json(error(e))
        })
})




//ruta vieja
router.post('/editar', async (req, res) => {
    
        if(true){
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            return ServicioTalller.update(req.body, {
                where: {
                    id: req.body.id
                }
            }, { transaction: t })
        }).then(result => { // Obtener la respuesta de la operacion
            // Responder y notifica
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            res.json(error(e))
        })
    } else { // Notificar que faltan campos requeridos
        res.json({
            error: true,
            mensaje: 'Faltan algunos campos'
        })
    }
})



//ruta vieja
router.post('/listar', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        

        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            return ServicioTaller.findAll( { transaction: t })
        }).then(result => { // Obtener la respuesta de la operacion
            // Responder y notifica
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            res.json(error(e))
        })
    
})

router.post('/findAllGroup', async (req, res) => {
    return sequelize.transaction(t => {
        return TablaMantenimiento.findAll( { 
                group: ['tipo_motoId'],
                attributes: ['tipo_motoId'],
                transaction: t 
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

router.post('/listarprueba', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        

        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            return ServicioTaller.findAll({
               include:[
                   { model: TablaMantenimiento,required:false,
                    where:{
                        tipo_motoId: req.body.tipoMoto
                    }
                   }
                ], transaction: t })
        }).then(result => { // Obtener la respuesta de la operacion
            // Responder y notifica
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            res.json(error(e))
        })
    
})




router.post('/buscar', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        
       //var vacia = (typeof(JSON.stringify(req.body.buscar.strim().length)))
       ///console.log("vacia: "+vacia) 
       // Iniciar la transacion automaticamente a la base de datos
        //if(req.body.buscar != null || vacia !== 0 ){
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
           return ServicioTaller.findAll({
               include:[
                  {model: TipoMoto},
                  {model: Moto},
              ],
              order: [
                  ['nombre', 'asc']
              ]
                
              }, { transaction: t })
        }).then(result => { // Obtener la respuesta de la operacion
            // Responder y notifica
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            res.json(error(e))
        })
   // }
})


router.post('/progreso', async (req, res) => {
    return sequelize.transaction(t => {
        return ServicioTaller.findAll({
            order:['nombre'],
            include:[
                   { 
                    model: TablaMantenimiento,
                        where:{  
                            tipo_motoId: req.body.tipo_motoId,
                            estado : 1
                        },
                        attributes: ['kilometraje', 'tiempo']
                   },
                   { 
                    model: Contador,
                        where:{  
                            motoId: req.body.motoId,
                            estado : 1
                        },
                        attributes: ['kilometraje', 'ultimoKm']
                   },

            ], transaction: t })
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
    
})







export default router