import CryptoJS from 'crypto-js'

export default function lockUser(user) {
  var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(user), 'KK@#JCcaicedo1995')
  return ciphertext.toString()
}
