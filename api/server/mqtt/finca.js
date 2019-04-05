import { Finca, sequelize, Contrato } from '../database'
import res from './respuesta'

export default (mqtt, json) => {

  let datos = json.datos

  switch (json.operacion) {

      case 'sync':
        switch (json.token.rol) {
          case 2:
            return sequelize.transaction(t => {
              return Finca.findAll({
                where:{
                  usuarioUID: json.token.uid
                }
              }, {transaction: t})
            }).then(result => {
              res(mqtt, null, result, json.token.uid, 'finca', 'sync')
            }).catch(err => {
              console.log(err);
            })
            break;
          case 3:
            return sequelize.transaction(t => {
              return Finca.findAll({
                where: {
                  administradorUID: json.token.uid
                }
              }, {transaction: t})
            }).then(result => {
              res(mqtt, null, result, json.token.uid, 'finca', 'sync')
            }).catch(err => {
              console.log(err);
            })
            break;
          case 5:
            return sequelize.transaction(t => {
              return Contrato.findAll({
                where:{
                  usuarioUID: json.token.uid,
                  fechaSalida: 0
                }
              }, {transaction: t}).then(contratos => {
                var fincasIds = []
                contratos.forEach(c => {
                  if(c.fincaID != null && c.fincaID != "" && c.fincaID != undefined){
                    fincasIds.push(c.fincaID)
                  }
                })
                if(fincasIds.length > 0) {
                  return Finca.findAll({
                    where: {
                      id: {
                        [Op.in]: fincasIds
                      }
                    }
                  }, {transaction: t})
                } else {
                  return fincasIds
                }
              })
            }).then(result => {
              res(mqtt, null, result, json.token.uid, 'finca', 'sync')
            }).catch(err => {
              console.log(err);
            })
            break;
        }
        break;
  }
}
