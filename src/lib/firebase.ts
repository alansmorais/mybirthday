import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
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

export async function clearAllRsvpsFromFirestore(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, RSVPS_PATH));
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, RSVPS_PATH, d.id));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, RSVPS_PATH);
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

export async function clearAllWishlistClaimsFromFirestore(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, WISHLIST_PATH));
    for (const d of snapshot.docs) {
      await deleteDoc(doc(db, WISHLIST_PATH, d.id));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, WISHLIST_PATH);
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

// -------------------------------------------------------------
// Twins Real Photos (Ada & Gabi) Shared Firestore Sync
// -------------------------------------------------------------
export const TWINS_PHOTOS_PATH = 'twinsPhotos';
export const TWINS_PHOTOS_DOC_ID = 'current';

export interface TwinsPhotosData {
  photoAda: string | null;
  photoGabi: string | null;
  photoJoint: string | null;
  photoViewMode?: 'individual' | 'joint';
  updatedAt?: string;
}

export async function saveTwinsPhotosToFirestore(data: Partial<TwinsPhotosData>): Promise<void> {
  const docRef = doc(db, TWINS_PHOTOS_PATH, TWINS_PHOTOS_DOC_ID);
  try {
    const existing = await getTwinsPhotosFromFirestore();
    const payload: TwinsPhotosData = {
      photoAda: data.photoAda !== undefined ? data.photoAda : (existing?.photoAda || null),
      photoGabi: data.photoGabi !== undefined ? data.photoGabi : (existing?.photoGabi || null),
      photoJoint: data.photoJoint !== undefined ? data.photoJoint : (existing?.photoJoint || null),
      photoViewMode: data.photoViewMode || existing?.photoViewMode || 'individual',
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${TWINS_PHOTOS_PATH}/${TWINS_PHOTOS_DOC_ID}`);
  }
}

export async function getTwinsPhotosFromFirestore(): Promise<TwinsPhotosData | null> {
  try {
    const docRef = doc(db, TWINS_PHOTOS_PATH, TWINS_PHOTOS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as TwinsPhotosData;
    }
    return null;
  } catch (error) {
    console.warn('Error reading twins photos from Firestore:', error);
    return null;
  }
}

export function subscribeToTwinsPhotos(callback: (photos: TwinsPhotosData | null) => void): () => void {
  try {
    const docRef = doc(db, TWINS_PHOTOS_PATH, TWINS_PHOTOS_DOC_ID);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data() as TwinsPhotosData);
      } else {
        callback(null);
      }
    }, (error) => {
      console.warn('Photos snapshot subscription notice:', error);
      callback(null);
    });
  } catch (error) {
    console.warn('Photos subscription setup notice:', error);
    return () => {};
  }
}

/**
 * Optimizes/compresses high-res user photos from smartphones or cameras
 * into a lightweight, high-fidelity WebP/JPEG data URL (~100-200KB).
 * This ensures the girls' authentic features remain crisp and natural,
 * while preventing Firestore document size issues and saving bandwidth on mobile.
 */
export async function compressImageFile(file: File, maxDimension: number = 1000, quality: number = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image or SVG, read standard
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Scale down proportionally if larger than maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Fallback to direct read
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Try image/webp first if supported, fallback to image/jpeg
      try {
        const webpData = canvas.toDataURL('image/webp', quality);
        if (webpData.startsWith('data:image/webp')) {
          resolve(webpData);
          return;
        }
      } catch {}

      const jpegData = canvas.toDataURL('image/jpeg', quality);
      resolve(jpegData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}
