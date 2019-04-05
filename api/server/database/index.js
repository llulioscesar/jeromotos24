import sequelize from './sequelize'
import Persona from './persona'
import TipoMoto from './tipoMoto'
import Moto from './moto'
import TablaMantenimiento from './tablaMantenimiento'
import ServicioTaller from './servicioTaller'
import OrdenEntrada from './ordenEntrada'
import OrdenSalida from './ordenSalida'
import Servicios from './servicios'
import Contador from './contador'
import Marca from './marca'
import Hook from  './hooks'
import Transacciones from './transacciones'
import ordenSalida from './ordenSalida';
import pmq from '../conexion/persona'






//OrdenSalida.hasMany(OrdenSalida, {foreignKey : 'categoriaId', onDelete: 'cascade'})
//OrdenSalida.belongsTo(OrdenSalida , {foreignKey : 'categoriaId'})

// Relacion tipomoto -> moto
TipoMoto.hasMany(Moto, {foreignKey: 'tipo_motoId', onDelete: 'cascade'})
Moto.belongsTo(TipoMoto, {foreignKey: 'tipo_motoId'})

//Relacion tipomoto -> tablaMantenimiento
TipoMoto.hasMany(TablaMantenimiento, {foreignKey: 'tipo_motoId', onDelete: 'cascade'})
TablaMantenimiento.belongsTo(TipoMoto, {foreignKey: 'tipo_motoId'})

// Relacion propietario -> moto
Persona.hasMany(Moto, {foreignKey: 'propietarioId', onDelete: 'cascade'})
Moto.belongsTo(Persona, {foreignKey: 'propietarioId'})

//Relacion moto -> OrdenEntrada
Moto.hasMany(OrdenEntrada, {foreignKey: 'motoId', onDelete: 'cascade'})
OrdenEntrada.belongsTo(Moto, {foreignKey: 'motoId'})

//Relacion servicio taller -> tablaMantenimiento
ServicioTaller.hasMany(TablaMantenimiento, {foreignKey: 'servicioId', onDelete: 'cascade'})
TablaMantenimiento.belongsTo(ServicioTaller, {foreignKey: 'servicioId'})

//Relacion ServicioTaller -> ServiciosSolicitados
ServicioTaller.hasMany(Servicios, {foreignKey: 'servicioId', onDelete: 'cascade'})
Servicios.belongsTo(ServicioTaller, {foreignKey: 'servicioId'})

//Relacion ServicioTaller -> ServiciosSolicitados
OrdenEntrada.hasMany(Servicios, {foreignKey: 'ordenId', onDelete: 'cascade'})
Servicios.belongsTo(OrdenEntrada, {foreignKey: 'ordenId'})

//Relacion Contador -> ServiciosTaller
ServicioTaller.hasMany(Contador, {foreignKey: 'servicioId', onDelete: 'cascade'})
Contador.belongsTo(ServicioTaller, {foreignKey: 'servicioId'})

//Relacion Contador -> ServiciosTaller
Moto.hasMany(Contador, {foreignKey: 'motoId', onDelete: 'cascade'})
Contador.belongsTo(Moto, {foreignKey: 'motoId'})

//Relacion ordenEntrada -> ServiciosSolicitados
//OrdenEntrada.hasMany(ServicioSolicitados, {foreignKey: 'servId', onDelete: 'cascade'})
//servicioSolicitados.belongsTo(OrdenEntrada, {foreignKey: 'servId'})

//Relacion Marca -> Tipomoto
Marca.hasMany(TipoMoto, {foreignKey: 'marcaId', onDelete: 'cascade'})
TipoMoto.belongsTo(Marca, {foreignKey: 'marcaId'})

//Transacciones
//Persona.hasMany(Marca, {foreignKey: 'adminId', onDelete: 'cascade'})
//Marca.belongsTo(Persona, {foreignKey: 'adminId'})

//Relacion ordenEntrada -> ServiciosSolicitados
//OrdenEntrada.hasMany(OrdenSalida, {foreignKey: 'ordenId', onDelete: 'cascade'})
//OrdenSalida.belongsTo(OrdenEntrada, {foreignKey: 'ordenId'})

//Relacion ordenEntrada -> ServiciosSolicitados
Persona.hasMany(OrdenEntrada, {foreignKey: 'tecnicoId', onDelete: 'cascade'})
OrdenEntrada.belongsTo(Persona, {  as: 'tecnico',foreignKey: 'tecnicoId'})





//Persona.hasMany(RolPersona, {foreignKey: 'personaId', onDelete: 'cascade'})
//RolPersona.belongsTo(Persona, {foreignKey: 'personaId'})

//Rol.hasMany(RolPersona, {foreignKey: 'rolId', onDelete: 'cascade'})
//RolPersona.belongsTo(Rol, {foreignKey: 'rolId'})
//Se crea llave primaria de dos campos
//Persona.belongsToMany(Rol, { through: RolPersona, onDelete: 'cascade' })
//Rol.belongsToMany(Persona, { through: RolPersona, onDelete: 'cascade' })

//sequelize.query("SET GLOBAL event_scheduler=on;")

export {
  sequelize,
  Persona,
  TipoMoto,
  Moto,
  TablaMantenimiento,
  ServicioTaller,
  OrdenEntrada,
  OrdenSalida,
  Contador,
  Marca,
  Servicios,
  Transacciones,
  Hook
};
