// auth.js — ZARO Firebase Authentication Logic
import { auth, db, provider } from "./firebase.js";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Session Persistence ──────────────────────────────────────────────────────
setPersistence(auth, browserLocalPersistence);

// ── Save / update user in Firestore ─────────────────────────────────────────
export async function saveUserToFirestore(user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      username: user.displayName || user.email.split("@")[0],
      email: user.email,
      profileImage: user.photoURL || "",
      bio: "",
      github: "",
      linkedin: "",
      createdAt: serverTimestamp()
    });
  }
}

// ── Google Login ─────────────────────────────────────────────────────────────
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  await saveUserToFirestore(result.user);
  return result.user;
}

// ── Email / Password Login ────────────────────────────────────────────────────
export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// ── Email Signup ─────────────────────────────────────────────────────────────
export async function signupWithEmail(name, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await saveUserToFirestore({ ...result.user, displayName: name });
  return result.user;
}

// ── Forgot Password ──────────────────────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ── Auth State Observer ───────────────────────────────────────────────────────
export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}

// ── Firebase Error Messages ───────────────────────────────────────────────────
export function getFirebaseError(code) {
  const map = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/invalid-credential": "Invalid credentials. Check your email & password.",
  };
  return map[code] || "An unexpected error occurred. Please try again.";
}
