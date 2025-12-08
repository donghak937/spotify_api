import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCc0oeLi0tTtdR1jLlceImt5QegHnsmpYA",
    authDomain: "ossspotify-6f04c.firebaseapp.com",
    projectId: "ossspotify-6f04c",
    storageBucket: "ossspotify-6f04c.firebasestorage.app",
    messagingSenderId: "1067160469050",
    appId: "1:1067160469050:web:d7e232e69c941b8fc87f03",
    measurementId: "G-D102H0TSBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
