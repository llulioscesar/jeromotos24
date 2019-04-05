import http from 'src/funciones/http'

const mapear ={

  tablaMovil:(data)=>{
    return data.map(item =>{
      return {
        serviciotaller: item.servicioTaller.nombre,
        kilometraje: item.kilometraje,
        tiempo: item.tiempo
      }
    })
  },
  crear:(x,y) =>{
    var l = []
    var code = 65
    for (let i = x; i < y ; i++) {
      l.push({id:0, identificacion: i, 
        nombre: "Persona" + String.fromCharCode(code++), telefono: i,
        correo : "Persona"+String.fromCharCode(code++)+ "@hotmail.com", rol: 0, uId: ''})
    }
    return l
  },
  admin:(data)=>{
    return data.map(item => {
      return {
        value: item.value,
        label: item.label,
        sublabel: item.sublabel,
        letter: item.label.substring(0, 1).toLocaleUpperCase(),
        leftColor: "yellow"
      }
    })
  },
  
  notificacionesServicios:(data)=>{
    return data.map(item => {
      return {
        id: (item.id.toString()).padStart(6,"000000"),
        placa: item.placa,
        fechaEntregaEstimada: item.fechaEntregaEstimada,
        notificacion: item.id + ': la motocicleta de placa ' + item.moto.placa + ' debio ser terminada el ' + item.fechaEntregaEstimada 
      }
    })
  },
  
  reporte:(data)=>{
    return data.map(item => {
      
      var servicio = item.ordenEntradas.length == 0 ? 0 : item.ordenEntradas[0].totalServicios 
      var repuestos = item.ordenEntradas.length == 0 ? 0 : item.ordenEntradas[0].totalRepuestos
      
      return {
        id: item.id,
        nombre: item.nombre,
        totalServicios: servicio,
        totalRepuestos: repuestos
      }
    })
  },
  orden:(data)=>{
    return data.map(orden => {
      return {
        label: (orden.id.toString()).padStart(6,"000000"),
        sublabel: orden.moto.placa + " ==> " + orden.moto.tipo_moto.referencia,
        value: orden.id
      }
    })
  },
  ordenMovil:(data)=>{
    return data.map(orden => {
      return {
        label: (orden.id.toString()).padStart(6,"000000"),
        //sublabel: orden.moto.placa + " ==> " + orden.moto.tipo_moto.referencia,
        value: orden.id
      }
    })
  },
  servicios:(data,checked,id)=>{
    var x = 0 
    return data.map(servicios => {
      if(checked.indexOf(servicios.servicioTaller.id) > -1){
          x = 1
      }else{
          x = 0
      }
      return {
        solicitados: x,
        realizados: 0,
        servicioId : servicios.servicioTaller.id,
        ordenId:id
      }
    })
  },
  serviciosRealizados:(data,checked,id)=>{
    var x = 0 
    return data.map(servicios => {
      if(checked.indexOf(servicios.servicioTaller.id) > -1){
          x = 1
      }else{
          x = 0
      }
      return {
        solicitados: x,
        realizados: 0,
        servicioId : servicios.servicioTaller.id,
        ordenId:id
      }
    })
  },
  moto:(data)=>{
    return data.map(moto => {
      return {
        label: moto.placa,
        sublabel: 'Referencia: '+ moto.tipo_moto.referencia,
        value: moto.id,
      }
    })
  },  
  marca:(data) =>{
      return data.map(marca => {
        return {
          label: marca.nombre,
          value: marca.id
        }
      })
  },
  tipoMoto:(data)=>{
      return data.map(tipo => {
        return {
          label: tipo.referencia,
          value: tipo.id,
          marcaId: tipo.marcaId
        }
      })
  },
  persona:(data)=>{
      return data.map(persona => {
        return {
          label: persona.nombre,
          sublabel: 'Cedula: '+ persona.identificacion,
          value: persona.id,
        }
      })
  }
}

export default mapear