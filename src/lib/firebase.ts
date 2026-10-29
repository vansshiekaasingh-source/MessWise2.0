import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0k7vN85r-wxpivtNY15q31FVKQj5OSlA",
  authDomain: "messwise-bf4b4.firebaseapp.com",
  projectId: "messwise-bf4b4",
  storageBucket: "messwise-bf4b4.firebasestorage.app",
  messagingSenderId: "752772944331",
  appId: "1:752772944331:web:11f13868fa6fbe75d3264e",
  measurementId: "G-XBQ1Y7WP05"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
