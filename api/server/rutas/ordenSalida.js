import express from 'express'
import { sequelize, OrdenEntrada, Servicios, OrdenSalida, Moto, Marca, Persona, TipoMoto, ServicioTaller, TablaMantenimiento} from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'
import { Validator as JSF } from 'jsonschema'

const validar = new JSF()
var router = express.Router()

const Op = Sequelize.Op

router.post('/update', async (req, res) => {
    return sequelize.transaction(t => {
        return OrdenSalida.update(req.body, {
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

router.post('/tabla', async (req, res) => {
    return sequelize.transaction(t => {
        return TablaMantenimiento.findAll({
            where:{
                tipo_motoId: 1
            },
            transaction:t
        }).then(result => {
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => {
            res.json(error(e))
        })
    })
})        

router.post('/insertServicios', async (req, res) => {
    console.log(req.body)
    return sequelize.transaction(t => {
        return Servicios.update(req.body,{
            where:{
                ordenId : req.body.ordenId,
                servicioId: req.body.servicioId
            }
        },{ transaction: t })
        }).then(result => { 
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})


router.post('/findAll2', async (req, res) => {
    return sequelize.transaction(t => {
        return OrdenSalida.findAll({
            where:{
                estado: req.body.estado
            },include:[ 
                {
                    model: OrdenEntrada,include:[
                        {model: Persona, as:'tecnico', attributes:['nombre']},
                        {model: Moto,attributes:['placa'], include:[
                            {model: Persona, attributes:['identificacion','nombre','telefono']},
                            {model: TipoMoto,include:[{model: Marca}]}
                        ]}
                    ] 
                }
            ],
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

router.post('/search', async (req, res) => {
    
    console.log(req.body.fechaSalida1)
    console.log(req.body.fechaSalida1 == null)
    var opt1 = req.body.fechaSalida1 == null ? {estado: req.body.estado} : { estado: req.body.estado,fechaSalida:{ [Op.gte]: req.body.fechaSalida1, [Op.lte]: (req.body.fechaSalida1+86399) } } 
    var opt2 = req.body.fechaIngreso1 == null ? {fechaIngreso:{[Op.gt]:0}} : {fechaIngreso: { [Op.gte]: req.body.fechaIngreso1, [Op.lte]: (req.body.fechaIngreso1+86399) } } 
    var opt3 = req.body.tecnico == null || req.body.tecnico == 0 ? {id:{[Op.gt]:0}} : {id: req.body.tecnico} 
    var opt4 = req.body.placa == null ? {} : {placa: req.body.placa} 
    var opt5 = req.body.identificacion == null ? {} : {identificacion: req.body.identificacion} 
    
    console.log(opt1)
    console.log(opt2)
    return sequelize.transaction(t => {
        return OrdenSalida.findAll({
           where:opt1,
            include:[ 
                {
                    model: OrdenEntrada, where: opt2,include:[
                        {model: Persona, as:'tecnico', where: opt3, attributes:['id','nombre']},
                        {model: Moto, where: opt4,attributes:['placa'], 
                        include:[
                            {model: Persona, where: opt5, attributes:['identificacion','nombre','telefono']},
                            {model: TipoMoto,include:[{model: Marca, attributes:['id','nombre']}]}
                        ]
                    }
                    ] 
                }
            ],
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

router.post('/search2', async (req, res) => {
    
    return sequelize.transaction(t => {
        return OrdenSalida.findAll({
            where:{
                estado: req.body.estado,
            },include:[ 
                {
                    model: OrdenEntrada, as: 'ordenEntrada'
                    
                }
            ],
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

router.post('/search3', async (req, res) => {
    
    return sequelize.transaction(t => {
        return OrdenSalida.findAll({
            include: [{ all: true, nested: false}],
            
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

router.post('/search4', async (req, res) => {
    
    var condition=
    {
        where:
        {
            estado:'Finalizado',
        }
            
    }   
    
    
    //return sequelize.transaction(t => {
        //return OrdenSalida.findAll({
            //include: [{ all: true, nested: false}],
             return OrdenSalida.findAll({
                 condition
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
        return OrdenEntrada.findAll({ 
            include:[
                {
                    model: Moto,
                    include:[
                        {
                            model: Persona,attributes:['id','nombre','telefono']
                        },
                        {
                            model: TipoMoto
                        }
                    ]
                },
                {
                    model: OrdenSalida,attributes:['estado'],
                        where:{
                            estado: req.body.estado
                        }
                },
                {
                    model: Persona,attributes: ['id','nombre']
                }

            ],
            transaction: t })
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