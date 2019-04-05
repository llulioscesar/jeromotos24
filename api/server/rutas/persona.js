import express from 'express'
import { sequelize, Persona, Moto, TipoMoto , Marca } from '../database'
import error from '../funciones/error'
import JsonPerona from '../json/persona'
import { Validator as JSF } from 'jsonschema'
import admin from 'firebase-admin'
const validar = new JSF()
var router = express.Router()

const Op = sequelize.Op

router.post('/insert', async (req, res) => {
    return sequelize.transaction(t => {
        if(req.body.id > 0){
            return Persona.update(req.body, {
                where: {
                    id: req.body.id
                }
            },{ transaction: t })
            }else{
                return Persona.create(req.body, { transaction: t })
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

router.post('/createLista', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.bulkCreate(req.body.lista,{ transaction: t })
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
            return Persona.destroy({ 
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
router.post('/nueva', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.create(req.body, { transaction: t })
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
router.post('/editar', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.update(req.body, {
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

router.post('/findAllotro', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findAndCountAll({
            where:{
                rol:{
                    [Op.in]: req.body.vector
                  }
            },
            order: [
                ['nombre', 'asc']
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

router.post('/findAdmin', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findAll({
            where:{
                rol:{
                    [Op.in]: [2,3]
                  }
            },
            order: [
                ['nombre', 'asc']
            ],
            attributes: [
               ['id', 'value'],['nombre', 'label'],['correo', 'sublabel'],['rol', 'letter']
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

router.post('/findAll', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findAll({
            where:{
                rol:{
                    [Op.in]: req.body.vector
                  }
            },
            order: [
                ['nombre', 'asc']
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
    return sequelize.transaction(t => {
        return Persona.findAll({
            where:{
                rol:{ [Op.in]: req.body.vector},
                [Op.or]:[
                 
                 { nombre:{ [Op.like]:req.body.buscar + '%'}},
                 {telefono:{[Op.like]:req.body.buscar + '%'}}
               ]  
            },
            limit: 10,
            order: [
                ['nombre', 'asc']
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





router.post('/findAllMap', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findAll({
            order: [
                    ['nombre', 'asc']
            ],
            attributes: [['id', 'value'],['nombre', 'label']],
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

// ruta anterior
router.post('/listar', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findAll({
            where:{
                rol:{
                    [Op.lt]: 2
                  }
            },
            limit: 10,
            include:[
                {model:Moto,
                    include:[
                        {model:TipoMoto, 
                            include:[
                                {model: Marca}
                            ]
                        }
                    ]
                }
            ],
               order: [
                ['nombre', 'asc']
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


router.post('/listarEmpleados', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findAll({
              where:{
                  rol: 1
              },include:[{model:Moto,
                include:[{model:TipoMoto, include:[{model: Marca}]}
                ]
             }
            ],
               order: [
                ['nombre', 'asc']
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




router.post('/buscar', async (req, res) => {
    // Validar los campos enviado sean identicos a los campos de la tabla        
    var vacia = (JSON.stringify(req.body.buscar.trim().length)) 
       if(vacia == 0){
           req.body.buscar=""
       }
       // Iniciar la transacion automaticamente a la base de datos
    if(req.body.buscar != null ){
        return sequelize.transaction(t => {
            // Insertar los datos recibidos a la tabla Persona
           console.log("buscar: "+ req.body.buscar)
            return Persona.findAll({
                include:[{model:Moto,
                    include:[{model:TipoMoto, include:[{model: Marca}]}
                    ]
                 }
                ],
                 order: [
                    ['nombre', 'asc']
                 ],
                where: {
                    [Op.or]: [
                        {
                          identificacion: {
                            [Op.like]: '%'+req.body.buscar+'%'
                          }
                        },
                        {
                          nombre: {
                            [Op.like]: '%'+req.body.buscar+'%'
                          }
                        },
                        {
                          telefono: {
                            [Op.like]: '%'+req.body.buscar+'%'
                          }
                        }
                      ]
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
    }
})

router.post('/tecnico', async (req, res) => {
    
    return sequelize.transaction(t => {
        return Persona.findAll({
            where:{
                rol: 1
            },
            order: [
                ['nombre', 'asc']
            ],
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


router.post('/buscarUid', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findOne({
            where:{
                uid: req.body.uid
            },transaction: t
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

router.post('/findOne', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findOne({
            where:{
               id: req.body.id
            },transaction: t
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

router.post('/findOneLogin', async (req, res) => {
    return sequelize.transaction(t => {
        return Persona.findOne({
            where:{
               id : req.body.id
            },
            include:[{model: Moto}],
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