// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqePJF0jrp7pnlJyzvKMyuHqmBDxz1Z5U",
  authDomain: "welltogether-33f27.firebaseapp.com",
  projectId: "welltogether-33f27",
  storageBucket: "welltogether-33f27.firebasestorage.app",
  messagingSenderId: "911567741308",
  appId: "1:911567741308:web:a76f1edee8eaad3aec04f9",
  measurementId: "G-6G4D5N0TFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);