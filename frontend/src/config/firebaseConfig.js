import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mentovia-c6352.firebaseapp.com",
  projectId: "mentovia-c6352",
  storageBucket: "mentovia-c6352.firebasestorage.app",
  messagingSenderId: "835345475809",
  appId: "1:835345475809:web:04ef657793d88df89d2fa0",
  measurementId: "G-KZR2GQT822",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
