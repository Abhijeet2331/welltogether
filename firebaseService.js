'use client';
// firebaseService.js
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase.js"; // Adjust if your firebase.js is in another folder

export async function getOrCreateUser(name) {
  const q = query(collection(db, "users"), where("name", "==", name));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    const userData = { name, createdAt: new Date() };
    const docRef = await addDoc(collection(db, "users"), userData);
    return { id: docRef.id, ...userData };
  } else {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }
}

export async function saveJournalEntry(userId, entry) {
  const journalData = { entry, date: new Date() };
  const userRef = doc(db, "users", userId);
  await addDoc(collection(userRef, "journals"), journalData);
}
