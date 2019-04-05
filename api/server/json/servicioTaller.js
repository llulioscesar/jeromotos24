const obj = {
    modelo: {
        "id": "/ServicioTaller",
        "type": "object",
        "properties": {
            "id": { "type": "number" },
            "nombre": { "type": "string" },
            "alerta": { "type": "number" },
        },
        "required": ["id","nombre","alerta"]
    }

}

export default obj