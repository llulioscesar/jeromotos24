import express from 'express'
import { sequelize, OrdenEntrada, Servicios, OrdenSalida, Moto, Persona, TipoMoto, ServicioTaller} from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'
import { Validator as JSF } from 'jsonschema'
const validar = new JSF()
var router = express.Router()

const Op = Sequelize.Op

router.post('/create', async (req, res) => {
   return sequelize.transaction(t => {
        return OrdenSalida.create(req.body, { transaction: t })
        }).then(result => {
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})

router.post('/insertServiciosRealizados', async (req, res) => {
    console.log(req.body)
    return sequelize.transaction(t => {
        return Servicios.bulkCreate(req.body.lista,{ transaction: t })
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
    console.log(req.body)
    return sequelize.transaction(t => {
        return Servicios.findAll({ 
            where:{
                ordenId : req.body.ordenId
            },
            include:[
                {
                    model: ServicioTaller
                },
                {
                    model: OrdenEntrada,attributes:['solicitudes'],include:[{model: OrdenSalida}]
                }
            ],transaction: t })
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})

router.post('/findAllByOrden', async (req, res) => {
    console.log(req.body)
    return sequelize.transaction(t => {
        return Servicios.findAll({ 
            where:{
                ordenId : req.body.ordenId
            },
            include:[
                {
                    model: ServicioTaller
                }
            ],transaction: t })
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