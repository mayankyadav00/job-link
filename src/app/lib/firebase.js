// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR CONFIG HERE (From the Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCnr6rzCM25xolsg4enG0JsIWn9_o9qnIg",
  authDomain: "job-link-60134.firebaseapp.com",
  projectId: "job-link-60134",
  storageBucket: "job-link-60134.firebasestorage.app",
  messagingSenderId: "441113702626",
  appId: "1:441113702626:web:c1973a83215ff1a77c2ebb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the specific tools we need
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
