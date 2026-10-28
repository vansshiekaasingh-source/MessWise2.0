import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0k7vN85r-wxpivtNY15q31FVKQj5OSlA",
  authDomain: "messwise-bf4b4.firebaseapp.com",
  projectId: "messwise-bf4b4",
  storageBucket: "messwise-bf4b4.firebasestorage.app",
  messagingSenderId: "752772944331",
  appId: "1:752772944331:web:11f13868fa6fbe75d3264e",
  measurementId: "G-XBQ1Y7WP05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication only (No Firestore or Storage)
export const auth = getAuth(app);