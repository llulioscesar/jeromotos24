import firebase from "firebase/app"
import 'firebase/auth'

var config = {
    apiKey: "AIzaSyC8g0r5FYg0twLZv43RhjaHgDeiyMkyIq8",
    authDomain: "jeromoto-a920c.firebaseapp.com",
    databaseURL: "https://jeromoto-a920c.firebaseio.com",
    projectId: "jeromoto-a920c",
    storageBucket: "jeromoto-a920c.appspot.com",
    messagingSenderId: "826180265231"
  }
 
  export const fireApp = firebase.initializeApp(config);

  export const AUTH = fireApp.auth()

  export default ({Vue}) =>{
      Vue.prototype.$auth = AUTH
  }

