import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlE093-UtBCsj08i3hcHmxDWc9600TAEg",
  authDomain: "yc-ai-1stdb.firebaseapp.com",
  projectId: "yc-ai-1stdb",
  storageBucket: "yc-ai-1stdb.firebasestorage.app",
  messagingSenderId: "955983200176",
  appId: "1:955983200176:web:bc6e1ea21154a502bd2075"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn("Firebase initialization skipped or deferred:", err);
}

export { app, auth, db };
export default app;
