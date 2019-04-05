import express from 'express'
import midleware from '../midleware'
import { sequelize, TablaMantenimiento,TipoMoto,ServicioTaller } from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'
import servicioTaller from '../database/servicioTaller';

var router = express.Router()
const Op = Sequelize.Op

router.post('/create', async (req, res) => {
    //console.log(req.body)
    return sequelize.transaction(t => {
        return TablaMantenimiento.bulkCreate(req.body.lista,{ transaction: t })
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
    //console.log(req.body)
    return sequelize.transaction(t => {
        return TablaMantenimiento.create(req.body,{ transaction: t })
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

router.post('/bUpdate', async (req, res) => {
    //console.log(req.body)
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
       return TablaMantenimiento.update(req.body, {
            where: {
                id: req.body.id
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
   
    return sequelize.transaction(t => {
        return TablaMantenimiento.findAll({
            where:{
                tipo_motoId: req.body.tipoMoto,
            },
            include:[
                {model: ServicioTaller}
            ],transaction: t
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

router.post('/serviciosActivos', async (req, res) => {
    
    return sequelize.transaction(t => {
        
        return TablaMantenimiento.findAll({
            where:{
                tipo_motoId: req.body.tipoMoto,
                estado:1
            },
            include:[
                {model: ServicioTaller}
            ],transaction: t
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

router.post('/findAllByTipo', async (req, res) => {
    
    return sequelize.transaction(t => {
        return TablaMantenimiento.findAll({
            where:{
                tipo_motoId: req.body.tipo_motoId
            },   
            include:[
                   { model: servicioTaller},
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



router.post('/cargar', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        

        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            return ServicioTaller.findAll({
               include:[
                   { model: TablaMantenimiento,required:false,
                    where:{
                        tipo_motoId: req.body.tipo_motoId
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
        //console.log(req.body)
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
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            res.json(error(e))
        })
    
})


router.post('/km', async (req, res) => {
    return sequelize.transaction(t => {
        return TablaMantenimiento.findAll({
            where:{
                estado: 1,
                tipo_motoId: 1,
                servicioId: 1
            },transaction:t
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

router.post('/joinContador', async (req, res) => {
    
    return sequelize.query("SELECT * FROM tabla_mantenimiento as t INNER JOIN contador as c ON t.servicioId = c.servicioId AND c.motoId = 1", { type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        console.log(result)
        res.json({
            error: false,
            datos: result
        })
    }).catch(e => {
        res.json(error(e))
    })  

})



    




export default router