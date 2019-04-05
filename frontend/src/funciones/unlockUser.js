import CryptoJS from 'crypto-js'

export default function unlockUser (user) {
  var bytes = CryptoJS.AES.decrypt(user, 'KK@#JCcaicedo1995')
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}
