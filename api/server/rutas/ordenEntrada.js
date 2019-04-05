import express from 'express'
import { sequelize, OrdenEntrada, Servicios, Persona, Moto, TipoMoto, Marca } from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'
import { Validator as JSF } from 'jsonschema'
import servicioTaller from '../database/servicioTaller';
const validar = new JSF()
var router = express.Router()

const Op = Sequelize.Op

router.post('/create', async (req, res) => {
   return sequelize.transaction(t => {
        return OrdenEntrada.create(req.body, { transaction: t })
        }).then(result => {
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { 
            res.json(error(e))
        })
})

router.post('/findByMotoMovil', async (req, res) => {
    return sequelize.transaction(t => {
        return OrdenEntrada.findAll({
            where: {
                motoId: req.body.motoId
            },include:[ 
                {model: Persona, as:'tecnico', attributes:['nombre']},
                {model: Servicios,include:[{model: servicioTaller}]}
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




router.post('/c', async (req, res) => {
    return sequelize.transaction(t => {
         return OrdenEntrada.findAll({where:{
             motoId:2
         }, transaction: t })
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
        return OrdenEntrada.update(req.body, {
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


router.post('/ultimoKm', async (req, res) => {
    return sequelize.transaction(t => {
        return OrdenEntrada.findAll({
            where:{
                motoId: req.body.motoId
            },
            order: [
                ['fechaEntregaEstimada', 'DESC']
            ],
            transaction: t
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

router.post('/findAllIniciado', async (req, res) => {
    return sequelize.transaction(t => {
        return OrdenEntrada.findAll({
            where:{
                estado: 'Iniciado'
            },include:[ 
                {model: Persona, as:'tecnico', attributes:['nombre']},
                {model: Moto, attributes:['placa'], include:[
                    {model: Persona, attributes:['identificacion','nombre','telefono']},
                    {model: TipoMoto, attributes:['referencia'],include:[{model: Marca, attributes:['nombre']}]}
                ]}
        ],
            transaction: t
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

router.post('/inTaller', async (req, res) => {
    return sequelize.transaction(t => {
        return OrdenEntrada.findAll({
            where:{
                estado: 'Iniciado',
                motoId: req.body.motoId
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
})        


router.post('/notificaciones', async (req, res) => {
    return sequelize.transaction(t => {
        return OrdenEntrada.findAll({
            
            order: [
                ['fechaEntregaEstimada', 'DESC']
            ],
            where:{
                estado: 'Iniciado',
                fechaEntregaEstimada:{
                    [Op.lte]: req.body.fecha
                }
            },include:[ 
                {model: Persona, as:'tecnico', attributes:['nombre']},
                {model: Moto, attributes:['placa'], include:[
                    {model: Persona, attributes:['identificacion','nombre','telefono']},
                    {model: TipoMoto, attributes:['referencia'],include:[{model: Marca, attributes:['nombre']}]}
                ]}
        ],
            transaction: t
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

router.post('/createServiciosSolicitados', async (req, res) => {
    //console.log(req.body)
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

router.post('/findAll', async (req, res) => {
    //console.log(req.body)
    var opt2 = req.body.id == null || req.body.id == 0 ? {[Op.gt]:0} : req.body.id  
    var opt6 = req.body.fechaIngreso == null ? Op.ne : Op.gte
    var opt7 = req.body.fechaIngresoFin == null ? Op.ne : Op.lte
    console.log(opt6)
    var opt = {
        id: opt2,
        estado: req.body.estado,
        fechaIngreso: {
                [opt6]: req.body.fechaIngreso,
                [opt7]: req.body.fechaIngresoFin
            }
    }
    
    //console.log(opt)    
    //var opt2 = !(req.body.id == null || req.body.id == 0)
    //var opt8 ={[Op.gt]:0}
    
    
    
    var opt1 = {estado: req.body.estado, id: opt2}
    if(req.body.fechaIngreso != null && req.body.fechaSalida == null){
        opt1 = 
        {
            id: opt2,
            estado: req.body.estado,
            fechaIngreso: {
                [Op.lte]: req.body.fechaIngresoFin,
                [Op.gte]: req.body.fechaIngreso
            }
        }
        
    }
    if(req.body.fechaIngreso == null && req.body.fechaSalida != null){
        opt1 = 
        {
            id: opt2,
            estado: req.body.estado,
            fechaSalida: {
                [Op.lte]: req.body.fechaSalidaFin,
                [Op.gte]: req.body.fechaSalida
            }
        }
        
    }
    if(req.body.fechaIngreso != null && req.body.fechaSalida != null){
        opt1 = 
        {
            id: opt2,
            estado: req.body.estado,
                fechaIngreso: {
                    [Op.lte]: req.body.fechaIngresoFin,
                    [Op.gte]: req.body.fechaIngreso
                },
                fechaSalida: {
                    [Op.lte]: req.body.fechaSalidaFin,
                    [Op.gte]: req.body.fechaSalida
                }
        }
        
    }
    

    var opt3 = req.body.tecnico == null || req.body.tecnico == 0 ? {id:{[Op.gt]:0}} : {id: req.body.tecnico} 
    var opt4 = req.body.placa == null ? {} : {placa: req.body.placa}
    var opt5 = req.body.identificacion == null ? {} : {identificacion: req.body.identificacion} 
    return sequelize.transaction(t => {
        return OrdenEntrada.findAll({
            where: opt, include:[ 
                
                    {model: Persona, as:'tecnico',where: opt3, attributes:['nombre']},
                    {model: Moto,where: opt4,attributes:['placa'], include:[
                        {model: Persona,where: opt5, attributes:['identificacion','nombre','telefono']},
                        {model: TipoMoto, attributes:['referencia'],include:[{model: Marca, attributes:['nombre']}]}
                    ]}
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

router.post('/reporteTecnico', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findAll({
            where:{
                rol:{
                    [Op.in]: [1,3]
                  }
            },
            include:[ 
                {model: OrdenEntrada},
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

router.post('/reporte', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findAll({
            group:['id'],
            attributes:['id','nombre'],
            include:[ 
                {
                 model: OrdenEntrada,
                 attributes: [
                    [sequelize.fn('sum', sequelize.col('costoServicio')), 'totalServicios'],
                    [sequelize.fn('sum', sequelize.col('costoRepuestos')), 'totalRepuestos']
                  ],
                  where:{
                      estado: 'Finalizado',
                      
                    //fechaSalida: 154856
                  },
                  required: false
                },
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

export default router