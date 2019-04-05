const obj = {
    modelo: {
        "id": "/OrdenEntrada",
        "type": "object",
        "properties": {
            "id": { "type": "number" },
            "kilometraje": { "type": "number" },
            "solicitudes": { "type": "string" },
            "motoId": { "type": "number" },
        },
        "required": ["id","kilometraje","solicitudes","motoId"]
    }

}

export default obj

