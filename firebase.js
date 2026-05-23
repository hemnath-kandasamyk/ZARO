// firebase.js — ZARO Firebase Configuration (Modular v10+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6KZxyKHlZaYdilHE99Te3xVg_gMGqwuE",
  authDomain: "zaro-authentication.firebaseapp.com",
  projectId: "zaro-authentication",
  storageBucket: "zaro-authentication.firebasestorage.app",
  messagingSenderId: "126896480910",
  appId: "1:126896480910:web:cbc9529c9d11281af11fdf",
  measurementId: "G-P37SDPY5W0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
