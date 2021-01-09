// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyDDCIAmp78oTvyj8aOhoCx4GuFt6km5WD4",
    authDomain: "whatsapp-5adbb.firebaseapp.com",
    projectId: "whatsapp-5adbb",
    storageBucket: "whatsapp-5adbb.appspot.com",
    messagingSenderId: "643020234910",
    appId: "1:643020234910:web:a91986172180dec6ffdb8f",
    measurementId: "G-PTCW08LKSJ"
  };

// var firebaseConfig = {
//   apiKey: "AIzaSyDriWgwK_rCB2QjLNVhrAwUbA1WagTn89w",
//   authDomain: "whatsapp-clone-adfc6.firebaseapp.com",
//   projectId: "whatsapp-clone-adfc6",
//   storageBucket: "whatsapp-clone-adfc6.appspot.com",
//   messagingSenderId: "575082804881",
//   appId: "1:575082804881:web:ded43d4d7d545c9236b130",
//   measurementId: "G-64ZNQD2XRK"
// };

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export {auth, provider}
export default db