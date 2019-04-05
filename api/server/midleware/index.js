var jwt = require('jsonwebtoken')

export default async (req, res, next) => {

  const idToken = req.header('AUTH_TOKEN')
  let decode;
  try {
    decode =  jwt.verify(idToken, '@#MiScAmElLoS8462', { algorithms: ['HS384'] })
  } catch(err) {
    console.log(err);
    let err = new Error('Token invalido. Inicie sesion, e intente nuevamente')
    return next(err);
  }

  req.user = {
    uid: decode.uid,
    rol: decode.rol
  }
  
  next()
}
