import sequelize from './sequelize'
import Sequelize from 'sequelize'

const Transacciones = sequelize.define('transacciones', {
    registro:{
        type:Sequelize.JSON,
        allowNull: false
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'transacciones',
})

export default Transacciones