// firebaseService.js
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  orderBy,
  onSnapshot,
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


/**
 * Sends a chat message to the specified group.
 * @param {string} group - The chat group (e.g., "General Chat")
 * @param {object} messageData - Object containing message details (sender, text, etc.)
 */
export async function sendChatMessage(group, messageData) {
  const messagesRef = collection(db, "chatGroups", group, "messages");
  return await addDoc(messagesRef, {
    ...messageData,
    timestamp: new Date()
  });
}

/**
 * Subscribes to chat messages for a specific group.
 * @param {string} group - The chat group to subscribe to.
 * @param {function} callback - Function to call with the updated list of messages.
 * @returns {function} unsubscribe function.
 */
export function subscribeToChatMessages(group, callback) {
  const messagesRef = collection(db, "chatGroups", group, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
}