import firebase from "firebase/app";

import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDCgHwYbFeHTXP_5AVk7mr1Rr4BkJovkeo",
    authDomain: "curso-8c446.firebaseapp.com",
    projectId: "curso-8c446",
    storageBucket: "curso-8c446.appspot.com",
    messagingSenderId: "252147762637",
    appId: "1:252147762637:web:e32fc1bbe19d7277653084",
    measurementId: "G-77LXQSPM49"
  };

if(!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  alert("Initialization")
}

export default firebase;
