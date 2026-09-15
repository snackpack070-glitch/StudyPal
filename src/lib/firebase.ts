import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ScannedItem } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};
export type { User };

// Firestore database operations for history items
export async function syncUserHistoryToFirestore(userId: string, items: ScannedItem[]) {
  try {
    const historyRef = collection(db, 'history');
    const batch = writeBatch(db);
    
    // Write up to 50 items
    items.slice(0, 50).forEach((item) => {
      const docRef = doc(historyRef, `${userId}_${item.id}`);
      batch.set(docRef, {
        ...item,
        userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });
    
    await batch.commit();
  } catch (err) {
    console.error('Error syncing history to Firestore:', err);
  }
}

export async function loadUserHistoryFromFirestore(userId: string): Promise<ScannedItem[]> {
  try {
    const historyRef = collection(db, 'history');
    const q = query(historyRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const items: ScannedItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: data.id,
        timestamp: data.timestamp,
        title: data.title,
        subject: data.subject,
        solution: data.solution,
        imageBase64: data.imageBase64 || ''
      });
    });

    // Sort by timestamp desc
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.error('Error loading history from Firestore:', err);
    return [];
  }
}

export async function deleteFirestoreHistoryItem(userId: string, itemId: string) {
  try {
    const docRef = doc(db, 'history', `${userId}_${itemId}`);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting item from Firestore:', err);
  }
}

export async function saveSingleHistoryItemToFirestore(userId: string, item: ScannedItem) {
  try {
    const docRef = doc(db, 'history', `${userId}_${item.id}`);
    await setDoc(docRef, {
      ...item,
      userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving item to Firestore:', err);
  }
}
