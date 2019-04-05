import sequelize from './sequelize'
import Sequelize from 'sequelize'
//import registro from '../funciones/transaccion'

const afterCreate = () => {
  console.log('after create');
};

const afterBulkUpdate = () => {
  console.log('after update');
};

const Marca = sequelize.define('marca', {
    nombre:{
        type:Sequelize.STRING(30),
        unique: true,
        allowNull: false
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'marca',
    //individualHooks: true,
    hooks:{
      //afterCreate: registro.create()
      /*afterCreate: (user, options) => {
        console.log(user)    
        console.log(options)
      },
      beforeBulkUpdate: (user, options) =>{
        console.log(user)
        console.log(typeof user.attributes)
        console.log(options)
      }*/
    }
})

export default Marca