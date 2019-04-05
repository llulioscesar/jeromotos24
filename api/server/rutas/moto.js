import express from 'express'
import { sequelize, Moto,TipoMoto,Persona,Marca, OrdenEntrada } from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'
import { Validator as JSF } from 'jsonschema'
const validar = new JSF()
var router = express.Router()

const Op = Sequelize.Op

router.post('/insert', async (req, res) => {
    return sequelize.transaction(t => {
            if(req.body.id > 0){
                return Moto.update(req.body, {
                    where: {
                        id: req.body.id
                    }
                }, { transaction: t })
            }else{
                return Moto.create(req.body, { transaction: t })
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
            return Moto.destroy({ 
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


//ruta vieja
router.post('/create', async (req, res) => {
    return sequelize.transaction(t => {
            return Moto.create(req.body, { transaction: t })
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

router.post('/findAll', async (req, res) => {
    return sequelize.transaction(t => {
             return Moto.findAll({
                 include:[
                   {model: TipoMoto,include:[{model: Marca}]},
                   {model: Persona}
                 ],order: [
                     ['placa', 'asc']
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


router.post('/findOneByPlaca', async (req, res) => {
    return sequelize.transaction(t => {
        return Moto.findOne({
            where:{
                placa: req.body.placa
            },
            include:[
                {model: Persona, attributes: ['nombre','telefono']},
                {model: OrdenEntrada, attributes: ['id','kilometraje','kmTotal']},
            ],
            transaction: t

        })
    }).then(result => {
        res.json({
            error: false,
            datos: result
        })
    }).catch(e =>{
        res.json(error(e))
    })
})


//ruta vieja
router.post('/listar', async (req, res) => {
   return sequelize.transaction(t => {
            return Moto.findAll({
                include:[
                  {model: TipoMoto},
                  {model: Persona}
                ],order: [
                    ['placa', 'asc']
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
            res.json(error(e))
        })
})

router.post('/findByPersona', async (req, res) => {
    return sequelize.transaction(t => {
             return Moto.findAll({
                where:{
                    propietarioId: req.body.propietarioId
                }, 
                include:[
                    {
                       model: TipoMoto,
                       include:[
                           {model:Marca}
                        ]
                    },
                 ],order: [
                     ['placa', 'asc']
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

 router.post('/findAllHook', async (req, res) => {
    return sequelize.transaction(t => {
        return Moto.findAll({
            where:{
                id: 1
            },
            include:[{model: OrdenEntrada, limit:1, order: [['fechaIngreso', 'desc']]
              }],
                 transaction: t
             })
        }).then(result => {
            console.log(JSON.stringify(result)) 
            res.json({
                 error: false,
                 datos: result
             })
         }).catch(e => { 
             res.json(error(e))
         })
})



/*router.post('/findOneByPlaca', async (req, res) => {
    return sequelize.transaction(t => {
        if(req.body.id == null){ 
          
            return Moto.findAll({
            include:[
                {model:TipoMoto,required: true,
                    where:{
                        id:req.body.tipo
                    },
                    include:[
                        {model:Marca,required: true,
                            where:{
                                id: req.body.marca
                            }
                        }
                    ]
                },
                {model:Persona, attributes: { exclude: ['rol'] }}
            ],
            transaction: t
         })
       }else{
        return Moto.findAll({
            where:{
              id: req.body.id
            },
            include:[
                {model:TipoMoto,required: true,
                    where:{
                        id:req.body.tipo
                    },
                    include:[
                        {model:Marca,required: false,
                            where:{
                                id: req.body.marca
                            }
                        }
                    ]
                },
                {model:Persona, attributes: { exclude: ['rol'] }}
            ],
            transaction: t
         }) 
       }
       }).then(result => { // Obtener la respuesta de la operacion
            // Responder y notifica
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            res.json(error(e))
        })
})*/

router.post('/buscarMotoMarca', async (req, res) => {
    
        return sequelize.transaction(t => {
            
            return Moto.findAll({
                include:[
                    {model: TipoMoto,
                        where: {
                          marcaId: req.body.buscar
                        }
                      },
                  ],order: [
                    ['placa', 'asc']
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

router.post('/findAllByTipoMotoAndMarca', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        

        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            //return Moto.findAll( { transaction: t })
            
            if(req.body.buscarTipo == "" && req.body.buscarMarca == ""){
                return Moto.findAll({
                    include:[
                        {model: TipoMoto,include:[{model:Marca}]},{model:Persona, attributes: { exclude: ['rol'] }}
                      ],order: [
                        ['placa', 'asc']
                      ],
                      transaction: t
                })
            }else if(req.body.buscarTipo != "" && req.body.buscarMarca != ""){
                return Moto.findAll({
                    include:[
                        {model: TipoMoto,
                            where: {
                              id: req.body.buscarTipo,
                              marcaId:req.body.buscarMarca
                            },
                            include:[{model:Marca}]
                        },{model:Persona, attributes: { exclude: ['rol'] }}
                      ],order: [
                        ['placa', 'asc']
                      ],
                      transaction: t
                })
            }else if(req.body.buscarTipo == ""){
                return Moto.findAll({
                    include:[
                        {model: TipoMoto,
                            where: {
                              marcaId:req.body.buscarMarca
                            },
                            include:[{model:Marca}]
                        },{model:Persona, attributes: { exclude: ['rol'] }}
                      ],order: [
                        ['placa', 'asc']
                      ],
                      transaction: t
                })
            }else if(req.body.buscarMarca == ""){
                return Moto.findAll({
                    include:[
                        {model: TipoMoto,
                            where: {
                                id: req.body.buscarTipo,
                            },
                            include:[{model:Marca}]
                        },{model:Persona, attributes: { exclude: ['rol'] }}
                      ],order: [
                        ['placa', 'asc']
                      ],
                      transaction: t
                })
            }
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


router.post('/buscartodo', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        

        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            //return Moto.findAll( { transaction: t })
            return Moto.findAll({
                where:{
                    placa:{
                        [Op.like]: req.body.buscar+'%'
                    }
                },
                include:[
                    {model: Persona,attributes: ['nombre']},
                    {model: TipoMoto,where:{id: req.body.idTipoMoto},
                        include:[
                            {model:Marca,where:{id:req.body.idMarca}}
                        ]
                    },
                    ],order: [
                       ['placa', 'asc']
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
            res.json(error(e))
        })
    
})


export default router