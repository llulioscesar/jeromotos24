import express from 'express'
import { sequelize, TipoMoto, Marca } from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'

var router = express.Router()
const Op = Sequelize.Op


router.post('/insert' ,async (req, res) => {
    return sequelize.transaction(t => {
        if(req.body.id > 0){
            return TipoMoto.update(req.body, {
                where: {
                    id: req.body.id
                }
            },{ transaction: t })
            }else{
                return TipoMoto.create(req.body, { transaction: t })
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
   console.log(req.body)
    return sequelize.transaction(t => {
            return TipoMoto.destroy({
                where:{
                    id: req.body.id
                }
            }, { transaction: t })
         }).then(result => { // Obtener la respuesta de la operacion
            res.json({
                error: false,
                datos: result
            })
        }).catch(e => { // Capturar el error y enviar
            res.json(error(e))
        })
})

router.post('/findAllMap', async (req, res) => {
    return sequelize.transaction(t => {
        return TipoMoto.findAll({
            order: [
                    ['referencia', 'asc']
            ],
            attributes: [['id', 'value'],['referencia', 'label'],'marcaId'],
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

router.post('/findAllMapByMarca', async (req, res) => {
    return sequelize.transaction(t => {
        return TipoMoto.findAll({
            where:{
               marcaId : req.body.marcaId
            },
            order: [
                    ['referencia', 'asc']
            ],
            attributes: [['id', 'value'],['referencia', 'label'],'marcaId'],
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
router.post('/listar', async (req, res) => {
    return sequelize.transaction(t => {
        return TipoMoto.findAll({
            order:['nombre','ASC'],
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

router.post('/findAll', async (req, res) => {
     
    return sequelize.transaction(t => {
        return TipoMoto.findAll({
            order: [
                    ['referencia', 'asc']
            ],
            include:[{model: Marca}],
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

router.post('/findAllByMarca', async (req, res) => {
     
    return sequelize.transaction(t => {
        return TipoMoto.findAll({
            where:{
                marcaId: req.body.marcaId
            },
            order: [
                    ['referencia', 'asc']
            ],
            include:[{model: Marca}],
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

router.post('/listarOne', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        

        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            return TipoMoto.findAll({where:{id:req.body.buscarTipo},transaction: t })
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
           return TipoMoto.findAll({
               include:[{model: Marca,
                            where:{
                                [Op.or]: [{ 
                                 nombre: {
                                   [Op.like]: '%'+req.body.buscar+'%'
                              }}
                            ]
                            }
                        }]
                
              }, { transaction: t });
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

router.post('/findMarcaByTipoMoto', async (req, res) => {
         
       //var vacia = (typeof(JSON.stringify(req.body.buscar.strim().length)))
        
       //if(req.body.buscar != null || vacia !== 0 ){
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
           return TipoMoto.findAll({
                where: {
                    id: req.body.buscarTipo
                }
              }, { transaction: t });
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

router.post('/findAllTipoMotoByMarca', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        
       //var vacia = (typeof(JSON.stringify(req.body.buscar.strim().length)))
       ///console.log("vacia: "+vacia) 
       // Iniciar la transacion automaticamente a la base de datos
        //if(req.body.buscar != null || vacia !== 0 ){
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
           return TipoMoto.findAll({
                where: {
                    marcaId: req.body.buscarMarca
                }
              }, { transaction: t });
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

router.post('/findAllByTipoMotoAndMarca', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        
            console.log(req.body)
        // Iniciar la transacion automaticamente a la base de datos
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
            //return Moto.findAll( { transaction: t })
            
            if(req.body.buscarTipo == "" && req.body.buscarMarca == ""){
                return TipoMoto.findAll({
                      order: [
                        ['referencia', 'asc']
                      ],include:[{model:Marca}],
                      transaction: t
                })
            }else if(req.body.buscarTipo != "" && req.body.buscarMarca != ""){
                return TipoMoto.findAll({
                    where: {
                        id: req.body.buscarTipo,
                        marcaId:req.body.buscarMarca
                    },
                    order: [
                        ['referencia', 'asc']
                    ],include:[{model:Marca}],
                    transaction: t
                })
            }else if(req.body.buscarTipo == ""){
                return TipoMoto.findAll({
                    where: {
                      marcaId:req.body.buscarMarca
                    },
                    order: [
                        ['referencia', 'asc']
                    ],include:[{model:Marca}],
                    transaction: t
                })
            }else if(req.body.buscarMarca == ""){
                return TipoMoto.findAll({
                    where: {
                      id: req.body.buscarTipo,
                    },
                    order: [
                        ['referencia', 'asc']
                    ],include:[{model:Marca}],
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

export default router