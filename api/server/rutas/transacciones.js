import express from 'express'
import { sequelize, Transacciones} from '../database'
import Sequelize from 'sequelize'
import error from '../funciones/error'

var router = express.Router()
const Op = Sequelize.Op

router.post('/findAll', async (req, res) => {
    return Transacciones.findAll()
    .then(result => { 
        res.json({
            error: false,
            datos: result
        })
    }).catch(e => { 
            res.json(error(e))
    })
})

export default router