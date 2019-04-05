import sequelize from './sequelize'
import Sequelize from 'sequelize'

const ordenSalida = sequelize.define('ordenSalida', {
    fechaSalida:{
        type:Sequelize.INTEGER.UNSIGNED,
    },
    Observaciones:{
        type: Sequelize.TEXT
    },
    CostoServicio:{
        type: Sequelize.INTEGER.UNSIGNED
    },
    CostoRepuestos:{
        type: Sequelize.INTEGER.UNSIGNED
    },
    estado:{
        type: Sequelize.ENUM('Iniciado', 'Finalizado','Cancelado'),
        allowNull: false,
        defaultValue: 'Iniciado'
    }

},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'ordenSalida',
})

export default ordenSalida