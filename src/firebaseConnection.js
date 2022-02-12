import firebase from "firebase/app";

import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "",
    authDomain: "curso-8c446.firebaseapp.com",
    projectId: "curso-8c446",
    storageBucket: "curso-8c446.appspot.com",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

if(!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
