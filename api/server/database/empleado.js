import sequelize from './sequelize'
import Sequelize from 'sequelize'

const empleado = sequelize.define('empleado', {
    tipo_contrato:{
        type: Sequelize.ENUM('Término indefinido', 'Término fijo', 'Obra o labor', 'Destajo'),
        allowNull: false,
        defaultValue: 'Obra o labor'
    },
    eps:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    arl: {
        type:Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    pension: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    censantias: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    transporte: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    fecha_inicio: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fecha_terminacion:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    examenes_realizados: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    sueldo: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    estado:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'empleado',
})

export default empleado