// lib/firebaseService.ts
import { 
  doc, 
  setDoc, 
  getDoc, 
  DocumentData, 
  WithFieldValue 
} from 'firebase/firestore';
import { db } from './firebase';

// Generic function to save data
export async function saveUserData<T extends WithFieldValue<DocumentData>>(
  userId: string, 
  collectionName: string, 
  data: T
) {
  try {
    await setDoc(doc(db, 'users', userId, collectionName, 'data'), data);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error saving ${collectionName}:`, error);
    return { success: false, error };
  }
}

// Generic function to get data
export async function getUserData<T>(
  userId: string, 
  collectionName: string
): Promise<T | null> {
  try {
    const docRef = doc(db, 'users', userId, collectionName, 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.error(`❌ Error getting ${collectionName}:`, error);
    return null;
  }
}

// ---------------------------
// 🔹 Guest Management
// ---------------------------
export async function saveGuests(userId: string, guests: any[]) {
  return saveUserData(userId, 'guests', { items: guests });
}

export async function getGuests(userId: string) {
  const data = await getUserData<{ items: any[] }>(userId, 'guests');
  return data?.items || [];
}

// ---------------------------
// 🔹 Budget Management
// ---------------------------
export async function saveBudget(userId: string, budget: any) {
  return saveUserData(userId, 'budget', budget);
}

export async function getBudget(userId: string) {
  return (await getUserData(userId, 'budget')) || { total: 0, items: [] };
}

// ---------------------------
// 🔹 Tasks / Checklist
// ---------------------------
export async function saveTasks(userId: string, tasks: any[]) {
  return saveUserData(userId, 'tasks', { items: tasks });
}

export async function getTasks(userId: string) {
  const data = await getUserData<{ items: any[] }>(userId, 'tasks');
  return data?.items || [];
}

// ---------------------------
// 🔹 Moodboard Management
// ---------------------------
export async function saveMoodboard(userId: string, images: any[]) {
  return saveUserData(userId, 'moodboard', { items: images });
}

export async function getMoodboard(userId: string) {
  const data = await getUserData<{ items: any[] }>(userId, 'moodboard');
  return data?.items || [];
}

// ---------------------------
// 🔹 Onboarding / Survey
// ---------------------------
export async function saveOnboarding(userId: string, onboardingData: any) {
  return saveUserData(userId, 'onboarding', onboardingData);
}

export async function getOnboarding(userId: string) {
  return await getUserData(userId, 'onboarding');
}
