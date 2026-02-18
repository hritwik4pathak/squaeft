// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "sqft-estate.firebaseapp.com",
  projectId: "sqft-estate",
  storageBucket: "sqft-estate.firebasestorage.app",
  messagingSenderId: "149872120820",
  appId: "1:149872120820:web:a545c24b6c0334945a9fa1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


