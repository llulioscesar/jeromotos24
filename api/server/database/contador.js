import sequelize from './sequelize'
import Sequelize from 'sequelize'

const contador = sequelize.define('Contador', {
    
    fecha_km:{
        type:Sequelize.DATE,
        defaultValue: null
    },
    fecha_time: {
        type: Sequelize.DATE,
        defaultValue:null
        //allowNull: false
    },
    prueba:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
    /*notifico:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
        //allowNull: false
    }*/
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'contador',
})

export default contador