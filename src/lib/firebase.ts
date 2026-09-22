import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocFromServer,
  query,
  orderBy
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../../firebase-applet-config.json';
import { RsvpSubmission } from '../types';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp({
  projectId: config.projectId,
  appId: config.appId,
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId
});

export const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection to Firestore
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore: client is offline or network restricted.");
    }
  }
}

// Automatically test connection on module load
testConnection().catch(() => {});

// RSVP Firestore Functions
const RSVPS_PATH = 'rsvps';

export async function saveRsvpToFirestore(rsvp: RsvpSubmission): Promise<void> {
  const docRef = doc(db, RSVPS_PATH, rsvp.id);
  try {
    await setDoc(docRef, {
      id: rsvp.id,
      name: rsvp.name,
      status: rsvp.status,
      guestCount: rsvp.guestCount || 1,
      message: rsvp.message || '',
      checkedIn: !!rsvp.checkedIn,
      createdAt: rsvp.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${RSVPS_PATH}/${rsvp.id}`);
  }
}

export async function getRsvpsFromFirestore(): Promise<RsvpSubmission[]> {
  try {
    const q = query(collection(db, RSVPS_PATH), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as RsvpSubmission);
  } catch {
    // If order index not built yet, fallback to simple fetch
    try {
      const snapshot = await getDocs(collection(db, RSVPS_PATH));
      return snapshot.docs.map(d => d.data() as RsvpSubmission);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, RSVPS_PATH);
      return [];
    }
  }
}

export function subscribeToRsvps(callback: (rsvps: RsvpSubmission[]) => void): () => void {
  try {
    const q = collection(db, RSVPS_PATH);
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as RsvpSubmission);
      // Sort in-memory to guarantee consistent latest-first ordering
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, RSVPS_PATH);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, RSVPS_PATH);
    return () => {};
  }
}

export async function updateRsvpCheckInFirestore(id: string, checkedIn: boolean): Promise<void> {
  const docRef = doc(db, RSVPS_PATH, id);
  try {
    await updateDoc(docRef, { checkedIn });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${RSVPS_PATH}/${id}`);
  }
}

export async function deleteRsvpFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, RSVPS_PATH, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${RSVPS_PATH}/${id}`);
  }
}

// Wishlist Claims Firestore Functions
const WISHLIST_PATH = 'wishlistClaims';

export interface WishlistClaim {
  id: string;
  itemId: string;
  reservedBy: string;
  reservedAt: string;
}

export async function claimWishlistItemInFirestore(itemId: string, reservedBy: string): Promise<void> {
  const docRef = doc(db, WISHLIST_PATH, itemId);
  try {
    await setDoc(docRef, {
      id: itemId,
      itemId,
      reservedBy,
      reservedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${WISHLIST_PATH}/${itemId}`);
  }
}

export async function unclaimWishlistItemInFirestore(itemId: string): Promise<void> {
  const docRef = doc(db, WISHLIST_PATH, itemId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${WISHLIST_PATH}/${itemId}`);
  }
}

export function subscribeToWishlistClaims(callback: (claims: Record<string, { reservedBy: string; reservedAt: string }>) => void): () => void {
  try {
    return onSnapshot(collection(db, WISHLIST_PATH), (snapshot) => {
      const claims: Record<string, { reservedBy: string; reservedAt: string }> = {};
      snapshot.forEach(d => {
        const data = d.data() as WishlistClaim;
        claims[data.itemId] = {
          reservedBy: data.reservedBy,
          reservedAt: data.reservedAt
        };
      });
      callback(claims);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, WISHLIST_PATH);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, WISHLIST_PATH);
    return () => {};
  }
}
