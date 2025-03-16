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
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Creates or retrieves a user by name.
 */
export async function getOrCreateUser(name) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("name", "==", name));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    // We also store voiceActive = false by default
    const userData = { name, createdAt: new Date(), voiceActive: false };
    const docRef = await addDoc(usersRef, userData);
    return { id: docRef.id, ...userData };
  } else {
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }
}

/**
 * Sets a user's voiceActive presence in Firestore.
 * @param {string} userId - The Firestore doc ID of the user.
 * @param {boolean} active - Whether the user is active in voice or not.
 */
export async function setUserVoiceStatus(userId, active) {
  const userRef = doc(db, "users", userId);
  // updateDoc is a partial update
  await updateDoc(userRef, { voiceActive: active });
}

/**
 * Subscribes to all users who have voiceActive == true in real time.
 * @param {function} callback - Called with an array of user objects
 * @returns {function} unsubscribe function
 */
export function subscribeToActiveUsers(callback) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("voiceActive", "==", true));
  return onSnapshot(q, (snapshot) => {
    const activeUsers = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(activeUsers);
  });
}

/**
 * Saves a journal entry (title + entry text) for the given userId.
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
 * Deletes a specific journal entry by its doc ID (journalId).
 */
export async function deleteJournalEntry(userId, journalId) {
  const userRef = doc(db, "users", userId);
  const journalRef = doc(userRef, "journals", journalId);
  await deleteDoc(journalRef);
}

/**
 * Sends a chat message to the specified group subcollection: /chatGroups/{group}/messages
 */
export async function sendChatMessage(group, messageData) {
  const messagesRef = collection(db, "chatGroups", group, "messages");
  return await addDoc(messagesRef, {
    ...messageData,
    timestamp: new Date()
  });
}

/**
 * Subscribes to chat messages for a specific group in real time.
 * @param {string} group - The chat group to subscribe to
 * @param {function} callback - Function to receive an array of message docs
 * @returns {function} unsubscribe function
 */
export function subscribeToChatMessages(group, callback) {
  const messagesRef = collection(db, "chatGroups", group, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
}
