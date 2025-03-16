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
  updateDoc,
  getDoc,
  setDoc,
  arrayUnion
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
    // Create user with voiceActive = false by default
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
 */
export async function setUserVoiceStatus(userId, active) {
  if (!userId) {
    throw new Error("setUserVoiceStatus: userId is undefined");
  }
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { voiceActive: active });
}

/**
 * Subscribes to all users who have voiceActive == true.
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
 * Sends a chat message to the specified group.
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

/**
 * Voice call signaling functions (placeholder):
 * We use a fixed call document ("activeCall") for a two-peer call.
 */
export async function createCallDoc(offer) {
  const callDocRef = doc(db, "calls", "activeCall");
  await setDoc(callDocRef, { offer, callerCandidates: [] });
  return callDocRef;
}

export async function answerCall(callDocRef, answer) {
  await updateDoc(callDocRef, { answer });
}

export async function addIceCandidate(callDocRef, candidate, type) {
  if (type === "caller") {
    await updateDoc(callDocRef, {
      callerCandidates: arrayUnion(candidate.toJSON())
    });
  } else {
    await updateDoc(callDocRef, {
      calleeCandidates: arrayUnion(candidate.toJSON())
    });
  }
}
