// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv464SUYoHlXaHG2wmKJ3G4LKJKg7AY_4",
  authDomain: "mentovia-c6352.firebaseapp.com",
  projectId: "mentovia-c6352",
  storageBucket: "mentovia-c6352.firebasestorage.app",
  messagingSenderId: "835345475809",
  appId: "1:835345475809:web:04ef657793d88df89d2fa0",
  measurementId: "G-KZR2GQT822"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();