const obj = {
    modelo: {
        "id": "/TipoMoto",
        "type": "object",
        "properties": {
            "id": { "type": "number" },
            "cilindraje": { "type": "string" },
            "referencia": { "type": "string" }
        },
        "required": ["id", "cilindraje", "referencia"]
    }

}

export default obj