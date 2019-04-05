import axios from 'axios'

const ruta = 'http://localhost:8080/'

const http = function(url, datos, result ,err){
    axios.post(ruta + url, datos).then((response) => {
                result(response)
            }).catch((e) => {
                err(e)
            })
}

export default http