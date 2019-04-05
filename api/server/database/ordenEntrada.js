import sequelize from './sequelize'
import Sequelize from 'sequelize'

const OrdenEntrada = sequelize.define('ordenEntrada', {
    fechaIngreso:{
        type: Sequelize.DATE,        
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    fechaEntregaEstimada: {
        type: Sequelize.DATE,
        allowNull: false
    },
    kilometraje:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    kmTotal:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    solicitudes:{
        type: Sequelize.TEXT
    },
    fechaSalida:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    observaciones:{
        type: Sequelize.TEXT
    },
    costoServicio:{
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    costoRepuestos:{
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0
    },
    estado:{
        type: Sequelize.ENUM('Iniciado', 'Finalizado','Cancelado'),
        allowNull: false,
        defaultValue: 'Iniciado'
    }

    /*km_promedio:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue:0
    }*/

},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'ordenEntrada',
})

export default OrdenEntrada