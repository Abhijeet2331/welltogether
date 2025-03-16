// firebaseService.js
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";

export async function getOrCreateUser(name) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("name", "==", name));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const userData = { name, createdAt: new Date() };
    const docRef = await addDoc(usersRef, userData);
    return { id: docRef.id, ...userData };
  } else {
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }
}

/**
 * Now accepts a title for the journal entry.
 */
export async function saveJournalEntry(userId, title, entry) {
  const userRef = doc(db, "users", userId);
  const journalsRef = collection(userRef, "journals");
  const journalData = { title, entry, date: new Date() };
  await addDoc(journalsRef, journalData);
}

/**
 * Retrieves all journals for a given user.
 */
export async function getAllJournals(userId) {
  const userRef = doc(db, "users", userId);
  const journalsRef = collection(userRef, "journals");
  const snapshot = await getDocs(journalsRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}
