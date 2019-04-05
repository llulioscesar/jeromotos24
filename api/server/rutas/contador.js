import express from 'express'
import { sequelize, TablaMantenimiento,TipoMoto,ServicioTaller, Contador } from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'

var router = express.Router()
const Op = Sequelize.Op

router.post('/create', async (req, res) => {
    console.log(req.body)
    return sequelize.transaction(t => {
        return Contador.bulkCreate(req.body.lista,{ transaction: t })
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})

router.post('/findByMoto', async (req, res) => {
    
    return sequelize.transaction(t => {
        return Contador.findAll({ 
            where:{
                motoId: req.body.motoId
            },
            include:[{model: ServicioTaller}],
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


router.post('/createOne', async (req, res) => {
    console.log(req.body)
    return sequelize.transaction(t => {
        return Contador.create(req.body,{ transaction: t })
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})

router.post('/findAllGroup', async (req, res) => {
    return sequelize.transaction(t => {
        return Contador.findAll( { 
                group: ['motoId'],
                attributes: ['motoId'],
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

router.post('/bUpdate', async (req, res) => {
    console.log(req.body)
    return sequelize.transaction(t => {
        return TablaMantenimiento.Update(req.body.lista,{
            where: {
                id: req.body.id
            }
            },
            { transaction: t })
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})


router.post('/update', async (req, res) => {
    return sequelize.transaction(t => {
       return Contador.update(req.body, {
            where: {
                servicioId: req.body.servicioId,
                motoId: req.body.motoId
            }
            }, { transaction: t })
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})



router.post('/listar', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        
        
        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            return TablaMantenimiento.findAll({
                where:{
                    tipo_motoId: req.body.tipoMoto,
                },
                include:[
                  {model: ServicioTaller}
                ],
                transaction: t
            })
        }).then(result => { // Obtener la respuesta de la operacion
            // Responder y notifica
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            console.log("hola=>"+e)
            res.json(error(e))
        })
    
})

router.post('/cargar', async (req, res) => {
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



router.post('/editar', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        
        console.log(req.body)
        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            return TablaMantenimiento.findAll({
                where:{
                    tipo_motoId: req.body.tipoMoto,
                },
                include:[
                  {model: ServicioTaller}
                ],
                transaction: t
            })
        }).then(result => { // Obtener la respuesta de la operacion
            // Responder y notifica
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            console.log("hola=>"+e)
            res.json(error(e))
        })
    
})



    




export default router