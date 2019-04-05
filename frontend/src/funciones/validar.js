const validar ={

    campos:(data) =>{
        var err = 0
          data.forEach(item => {
           //console.log(item)
            if(item != null){
                if((JSON.stringify(item.toString().trim().length)) == 0){
                    err++
                }
            }else{
                err++
            }            
          })
          
         if(err == 0){
             return true
         }else{
             return false
         }
    },

    enter:(event) =>{
        var k = event.keyCode
        console.log(k)
    },
    numeros:(event) =>{
        var k = event.keyCode
        if ((k > 47 && k < 58) || k == 8 || k == 9 || k == 46 || k == 16 )  {
            return true
        }else{  
          event.preventDefault()
          return false
        }
    },

    prueba:(event) =>{
        var patron = /\d/
        if (!((!patron.test(event.key)) || event.keyCode != 8 || event.keyCode != 9 ))  {
          event.preventDefault()
          alert("Solo numeros patron")
        }
    },
    
    nombre:(event,data) =>{
        var patron =/[A-Za-z]/
        var k = event.keyCode
        if(data == null){
            if(k == 32){
              event.preventDefault()
            }
        }else{
            if(data == "" && k == 32){
                event.preventDefault()
            }else{
                if (patron.test(event.key) || k == 8 || k == 9 || k == 46 || k == 16 || k == 32 )  {
                }else{  
                  event.preventDefault()
                  alert("Solo letras")
                }
            }
        }
    },
    
    readOnly:(event) =>{
        event.preventDefault()
    },

    placa:(placa) =>{
        var patron =/^[a-zA-Z]{3}[\d]{2}[a-zA-Z]{0,1}$/
        return patron.test(placa)
    },

    espacios:(event,data) =>{
        var patron =/[A-Za-z0-9]/
        var k = event.keyCode
        if(data == null){
            if(k == 32){
              event.preventDefault()
            }
        }else{
            if(data == "" && k == 32){
                event.preventDefault()
            }else{
                if (patron.test(event.key) || k == 8 || k == 9 || k == 46 || k == 16 || k == 32 )  {
                }else{  
                  event.preventDefault()
                  alert("solo letras o numeros")
                }
            }
        }
    },

    
}

export default validar