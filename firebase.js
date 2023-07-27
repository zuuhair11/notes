import { initializeApp } from 'firebase/app' ;
import { getFirestore, collection } from 'firebase/firestore' ;



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUY8u44uELwkKimkid2pkSn1br63uj3v8",
    authDomain: "react-notes-990e0.firebaseapp.com",
    projectId: "react-notes-990e0",
    storageBucket: "react-notes-990e0.appspot.com",
    messagingSenderId: "795138433659",
    appId: "1:795138433659:web:ed6ebb67150d5e2dd1b8de"
};

// Initialize Firebase
// app variable give me an access to my app as it lives in firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore database:
// The getFirestore function is used to get a reference 
// To the Firestore database associated with the initialized Firebase app.
export const db = getFirestore(app);

// Export a reference to the 'notes' collection in Firestore:
export const notesCollection = collection(db, 'notes');
