// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_Qqhm59rF_DLIqs1H4TT02rkor4CevwE",
  authDomain: "wedding-planner-6549f.firebaseapp.com",
  projectId: "wedding-planner-6549f",
  storageBucket: "wedding-planner-6549f.firebasestorage.app",
  messagingSenderId: "404274349277",
  appId: "1:404274349277:web:1be4f09336f4630db70734"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;