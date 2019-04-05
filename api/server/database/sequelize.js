import { Sequelize } from 'sequelize'
import Transacciones from '../funciones/transaccion'

const db = 'jeronimo'

//const sequelize = new Sequelize('jeronimo', 'root', '', {
const sequelize = new Sequelize( db, 'root', '', {  
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
  timezone : "-05:00",
  operatorsAliases: false,
  define: {
    hooks: {
      /*afterCreate: (model, options) => {
        Transacciones.create()
        //Transacciones.create({registro: 'registro'})
        //Transacciones.create()
        console.log(model)
        console.log(model.changed)
        console.log(model.constructor.name)
      },
      beforeUpdate: (user, options) =>{
        if(Object.keys(user._changed).length > 0){
          console.log('Modifico')
        }
        //let size = Object.keys(user._changed).length
        //console.log("hubo " + size + " cambios")
        //console.log(user._changed)
        //console.log(_changed)
        //console.log(typeof user.attributes)
        //console.log(options)
      }*/
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  version: 1,
})

export default sequelize
