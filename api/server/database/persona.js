import sequelize from './sequelize'
import Sequelize from 'sequelize'

const persona = sequelize.define('persona', {
    identificacion: {
        unique: true,
        type: Sequelize.STRING(15),
        allowNull: false
    },
    nombre: {
        type : Sequelize.STRING(50),
        allowNull: false
    }, 
    telefono: {
        type:Sequelize.STRING(12),
        allowNull: false,
        defaultValue: 'No registra'
    },
    correo: {
        allowNull: false,
        type: Sequelize.STRING(50),
    },
    rol:{
       type : Sequelize.BIGINT,
       allowNull: false,
       defaultValue: 0
       /*default:[],
       get(){
           return typeof this.getDataValue('rol') === 'string' ? JSON.parse(this.getDataValue('rol')) : this.getDataValue('rol');
       },
       set(value){
           if(typeof this.getDataValue('rol') === 'string'){
              this.setDataValue('rol',JSON.parse(value));
           }else{
            this.setDataValue('rol',value);
           }
       }*/
    },
    uId:{
        type: Sequelize.TEXT,
        allowNull:false
    }

},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'persona',
})

export default persona