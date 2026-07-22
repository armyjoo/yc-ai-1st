import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlE093-UtBCsj08i3hcHmxDWc9600TAEg",
  authDomain: "yc-ai-1stdb.firebaseapp.com",
  projectId: "yc-ai-1stdb",
  storageBucket: "yc-ai-1stdb.firebasestorage.app",
  messagingSenderId: "955983200176",
  appId: "1:955983200176:web:bc6e1ea21154a502bd2075"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
