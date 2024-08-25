// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: "x-next-de4fd.firebaseapp.com",
  projectId: "x-next-de4fd",
  storageBucket: "x-next-de4fd.appspot.com",
  messagingSenderId: "112864299195",
  appId: "1:112864299195:web:1b576fc9025bdd2a6bc19e",
  measurementId: "G-5ZJS31XRYG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
if (typeof window !== 'undefined') {
  const { getAnalytics } = require('firebase/analytics');
  const analytics = getAnalytics(app);
}