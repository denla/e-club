// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFuWmg0xE4cxjfmJLjx5yA-Yd6_c9lkPI",
  authDomain: "e-club-5f192.firebaseapp.com",
  projectId: "e-club-5f192",
  storageBucket: "e-club-5f192.firebasestorage.app",
  messagingSenderId: "371676651362",
  appId: "1:371676651362:web:41d99cff0813ebc302163b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
