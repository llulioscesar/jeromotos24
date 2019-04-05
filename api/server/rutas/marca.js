import express from 'express'
import { sequelize, Marca, TipoMoto} from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'

var router = express.Router()
const Op = Sequelize.Op

router.post('/insert', async (req, res) => {
    return sequelize.transaction(t => {
        if(req.body.id > 0){
            return Marca.update(req.body, {
                where: {
                    id: req.body.id
                },
                individualHooks: true,
                transaction: t })
            }else{
                return Marca.create(req.body, { 
                    individualHooks: true,
                    transaction: t 
                })
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
        return Marca.findAll({
            order: [
                    ['nombre', 'asc']
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

router.post('/findAllMap', async (req, res) => {
    var opt = {model: TipoMoto}
    if(req.body.required){
        opt = {model: TipoMoto,required:true}
    }
    
    console.log(req.body.required)
    return sequelize.transaction(t => {
        return Marca.findAll({
            order: [
                    ['nombre', 'asc']
            ],
            attributes: [['id', 'value'],['nombre', 'label']],
            //include:[{model: TipoMoto,required:true}],
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

router.post('/FindOneByTipo', async (req, res) => {
    return sequelize.transaction(t => {
       return Marca.findOne({     
                where:{
                    id:req.body.id
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


export default router