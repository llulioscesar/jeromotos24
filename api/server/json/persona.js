const obj = {
    modelo: {
        "id": "/persona",
        "type": "object",
        "properties": {
            "id":{ "type": "number" },
            "identificacion": { "type": "string" },
            "nombre": { "type": "string" },
            "telefono": { "type": "string" },
            "correo": { "type": "string" },
            "user": { "type": "string" },
            "contrasena": { "type": "string" },
        },
        "required": ["id","identificacion","nombre","telefono","correo","user","contrasena"]
        
    }

}

export default obj