import sequelize from './sequelize'
import Persona from './persona'
import TipoMoto from './tipoMoto'
import Moto from './moto'
import TablaMantenimiento from './tablaMantenimiento'
import ServicioTaller from './servicioTaller'
import OrdenEntrada from './ordenEntrada'
import Servicios from './servicios'
import Contador from './contador'
import Marca from './marca'
import servicioTaller from './servicioTaller'
import Transaccion from './transacciones'
import registro from '../funciones/transaccion';
import { Transacciones } from '.'
import moment from 'moment'

const Op = sequelize.Op

Marca.hook('afterCreate', (user, options) => {
    //console.log(user)
    //console.log(user.dataValues)
    //console.log(user._modelOptions.tableName)
    var registro = user.dataValues
    registro.tabla = user._modelOptions.tableName
    registro.accion = 'create'
    console.log(registro)
    Transacciones.create({registro:registro})

    servicioTaller.findAll().then(response => {
    
    }).catch(e => {})
    
})

Marca.hook('beforeUpdate', (user, options) => {
    console.log('Marca update')
})

ServicioTaller.hook('beforeUpdate', (user, options) => {
  console.log('beforeUpdate')  
  console.log(user)
})

ServicioTaller.hook('beforeBulkUpdate', (user, options) => {
  console.log('beforeBulkUpdate')  
  console.log(user)
})

Servicios.hook('beforeBulkUpdate', (user) => {
  console.log('Servicios beforeBulkUpdate')
  //console.log(JSON.parse(JSON.stringify(user.attributes)))
  var ordenId = user.attributes.ordenId
  var servicioId = user.attributes.servicioId
  var motoId = 0
  var tipo_moto = 0
  var kmPromedio = 0
  var kmOrden = 0
  var ordenes = 0
  OrdenEntrada.findOne({
    where:{
      id:ordenId
    },
    attributes:['motoId','kilometraje']
  }).then(response =>{
      motoId = response.dataValues.motoId
      kmOrden = response.dataValues.kilometraje
      Moto.findAll({
        where:{
          id: motoId
        },
        include:[{model: OrdenEntrada, limit:2, order: [['fechaIngreso', 'desc']]}]
      }).then(result => {
          tipo_moto = result[0].dataValues.tipo_motoId
          kmPromedio = result[0].dataValues.km_promedio
          ordenes = result[0]
          var query = "SELECT contador.prueba, contador.id, contador.fecha_km, contador.fecha_time, tabla_mantenimiento.kilometraje, tabla_mantenimiento.tiempo " +
                      "FROM contador, tabla_mantenimiento WHERE " +
                      " tabla_mantenimiento.estado = 1 AND tabla_mantenimiento.servicioId = " + servicioId +
                      " AND contador.servicioId = " + servicioId +" AND contador.motoId = " + motoId + " AND tabla_mantenimiento.tipo_motoId = " + tipo_moto
          sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
          .then(result =>{
            //console.log(result)
            if(kmPromedio == 0){
              var km = (parseInt(ordenes.dataValues.ordenEntradas[0].kilometraje) + parseInt(result[0].kilometraje))
              Contador.update({prueba: km},{
                where:{
                  motoId: motoId,
                  servicioId: servicioId
                }
              }) 
            }else{
              console.log('kmReal2 = ' + (parseInt(ordenes.dataValues.ordenEntradas[0].kilometraje) + parseInt(result[0].kilometraje)))
              var sg = (result[0].kilometraje/kmPromedio)*(24*3600)
              var t = moment().add(sg,'seconds')
              var km = (parseInt(ordenes.dataValues.ordenEntradas[0].kilometraje) + parseInt(result[0].kilometraje))
              Contador.update({fecha_km: t, prueba: km},{
                where:{
                  motoId: motoId,
                  servicioId: servicioId
                  }
                }) 
            }  
          })
      })
  })
})




ServicioTaller.hook('afterCreate', (response) => {
    let id = response.dataValues.id
    Contador.findAll({ 
        group: ['motoId'],
        attributes: ['motoId'],
    }).then((response) => {
        //console.log(response)
        if(response.length > 0){
            response.forEach(item => {
                Contador.create({id:0, estado:0, motoId:item.dataValues.motoId,servicioId:id})
                .then((response) =>{
                    console.log(response.dataValues)
                })
            })
        }
    }).catch((e) => {
        console.log(e.message)
    })

    TablaMantenimiento.findAll({ 
        group: ['tipo_motoId'],
        attributes: ['tipo_motoId']
    }).then((response) => {
        if(response.length > 0){
            response.forEach(item => {
                TablaMantenimiento.create({id:0,kilometraje:0, tipo_motoId:item.dataValues.tipo_motoId,servicioId:id})
                .then((response) =>{
                    //console.log(response.dataValues)
                })
            })
        }
    }).catch((e) => {
        console.log(e.message)
    })
})

Moto.hook('afterCreate',(response) => {
    var motoId = response.dataValues.id
    servicioTaller.findAll({
    }).then((response) =>{
        response.forEach(item => {
            Contador.create({ servicioId: item.dataValues.id, motoId: motoId })
        })
    })
})

TipoMoto.hook('afterCreate',(response) => {
    var id = response.dataValues.id
    servicioTaller.findAll({
    }).then((response) =>{
        response.forEach(item => {
            TablaMantenimiento.create({tipo_motoId: id, servicioId: item.dataValues.id})
        })
    })
})



 
OrdenEntrada.hook('afterCreate', (response) => {
  var motoId = response.dataValues.motoId
  var tipo_moto = null
  var promedio = 0
  var promedioAnterior = 0
    //console.log(motoId)
  Moto.findOne({
    where:{
      id : motoId
    }
  }).then(response =>{
    tipo_moto = response.dataValues.tipo_motoId
    promedioAnterior = response.dataValues.km_promedio
    console.log(promedioAnterior)
    OrdenEntrada.findAll({
      where:{
        motoId: motoId,
      },order: [
        ['fechaIngreso', 'desc']
      ]
    }).then(response =>{
      //console.log(response.length)
      promedio = 0
      if(response.length > 1){
        for (let i = 0; i < response.length-1; i++) {
          let km = (response[i].dataValues.kmTotal-response[i+1].dataValues.kmTotal)
          let dias = parseFloat((moment(response[i].dataValues.fechaIngreso).diff(moment(response[i+1].dataValues.fechaIngreso),'seconds'))/(24*3600))
          //let h = moment().diff(moment(),'hours')
          console.log('km:  ' + km +'/dias: ' + dias + ' = ' + km/dias)
          promedio += km/dias
          //console.log('promedio:  ' + promedio)
        }
        console.log('promedio:  ' + promedio/(response.length-1))
        //promedio = promedio/(response.length-1)
        Moto.update({km_promedio : promedio}, {
          where: {
              id: motoId
          }
        }).then(()=> {
          TablaMantenimiento.findAll({
            where:{
              tipo_motoId: tipo_moto,
              estado: 1
            }
          }).then(response => {
            
            response.forEach(item =>{
              //console.log(item.servicioId)
              Contador.findOne({
                where:{
                  motoId: motoId,
                  servicioId: item.dataValues.servicioId
                }
              }).then(response =>{
                if(item.dataValues.kilometraje != 0){
                  if(response.dataValues.fecha_km == null){
                    var sg = (item.dataValues.kilometraje/promedio)*(24*3600)
                    var t = moment().add(sg,'seconds')
                    
                    Contador.update({fecha_km: t},{
                      where:{
                        motoId: motoId,
                        servicioId: item.dataValues.servicioId
                      }
                    })
                  }else{
                    var dias = (moment(response.dataValues.fecha_km).diff(moment(),'seconds'))/(24*3600)
                    var sg =  (dias*promedioAnterior/promedio)*(24*3600)
                    var t = moment().add(sg,'seconds')
                    Contador.update({fecha_km: t},{
                      where:{
                        motoId: motoId,
                        servicioId: item.dataValues.servicioId
                      }
                    })
                  }
                }
                if(item.dataValues.tiempo != 0){
                  if(response.dataValues.fecha_time == null){
                    var t = moment().add(item.dataValues.tiempo,'days')
                    Contador.update({fecha_time: t},{
                      where:{
                        motoId: motoId,
                        servicioId: item.dataValues.servicioId
                      }
                    })
                  }
                } 
                
              })


              /*Contador.update({fecha_km: new Date()},{
                  where:{
                    motoId: motoId,
                    servicioId: item.servicioId
                  }
                })*/
             })
          })
        
        
        })

        
        

      }
    })
  })




})



 /*OrdenEntrada.hook('afterCreate', (response) => {
    
    let motoId = response.dataValues.motoId
    let tipo_moto = response.dataValues.tipo_motoId
    //console.log(response)
    /*OrdenEntrada.findAll({ 
        where:{
            motoId: motoId,
        },order: [
            ['fechaIngreso', 'desc']
        ],
        //include:[{model: Moto}]
    }).then(response => { 
        let promedio = 0
        
        if(response.length > 1){
            for (let i = 0; i < response.length-1; i++) {
                let km = (response[i].dataValues.kilometraje-response[i+1].dataValues.kilometraje)
                let dias = moment(response[i].dataValues.fechaIngreso).diff(moment(response[i+1].dataValues.fechaIngreso),'seconds')
                promedio += km/dias
                //console.log(promedio)
            }
            /*Contador.findAll({
                where:{
                    id:motoId
                },
                include:{model: TablaMantenimiento}
            }).then(response => {
                response.forEach(item => {
                    Contador.update({fecha_time:0},{where:{
                        id: item.dataValues.id
                    }})
                })
            })*/

            /*Moto.update({km_promedio : promedio/(response.length-1) }, {
                where: {
                    id: motoId
                }
            })*/

        //}
        /*if(response.length > 1){
           let km = (response[0].dataValues.kilometraje-response[1].dataValues.kilometraje)
           let dias = (response[0].dataValues.fechaIngreso-response[1].dataValues.fechaIngreso)/(60*60*24)
             OrdenEntrada.update({km_promedio : (km/dias)}, {
                where: {
                    id: id,
                }
            }).then(() =>{
                OrdenEntrada.findAll({
                    where:{
                       km_promedio:{
                        [Op.gt]:0
                       },motoId:motoId
                    },
                    attributes: { include: [[sequelize.fn('AVG', sequelize.col('km_promedio')), 'km']] }
                  }).then((response) =>{
                    Moto.update({km_promedio : response[0].dataValues.km }, {
                        where: {
                            id: motoId
                        }
                    })  
                    console.log('update moto')
                  })
            })
        }
    }).catch(e => { 
        console.log(e.message)
    })


    
})*/



