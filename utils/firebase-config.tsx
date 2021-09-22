// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuFNWfJFkeB5odXMvNIbE9xTzDd-2XKZ0",
    authDomain: "fir-crm-4a06a.firebaseapp.com",
    projectId: "fir-crm-4a06a",
    storageBucket: "fir-crm-4a06a.appspot.com",
    messagingSenderId: "456718419550",
    appId: "1:456718419550:web:5d2a0f56fa082edea156cf",
    databaseURL: "https://fir-crm-4a06a-default-rtdb.firebaseio.com/",

};


function initializeFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}
initializeFirebase();


export { firebase }
