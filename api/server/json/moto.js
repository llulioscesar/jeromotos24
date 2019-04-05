const obj = {
    modelo: {
        "id": "/Moto",
        "type": "object",
        "properties": {
            "id":{ "type": "number" },
            "placa": { "type": "string" },
            "color": { "type": "string" },
            "km_promedio": { "type": "number" },
            "tipo_motoId": { "type": "number" },
            "propietarioId": { "type": "number" }
        },
        "required": ["placa","color","tipo_motoId","propietarioId"]
    }

}

export default obj