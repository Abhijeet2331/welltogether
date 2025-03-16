// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqePJF0jrp7pnlJyzvKMyuHqmBDxz1Z5U",
  authDomain: "welltogether-33f27.firebaseapp.com",
  projectId: "welltogether-33f27",
  storageBucket: "welltogether-33f27.firebasestorage.app",
  messagingSenderId: "911567741308",
  appId: "1:911567741308:web:a76f1edee8eaad3aec04f9",
  measurementId: "G-6G4D5N0TFM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
