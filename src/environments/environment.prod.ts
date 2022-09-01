export const environment = {
  production: true,
};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8yabx5BhJFpjhDj4gaODfUmxZardcoII",
  authDomain: "mafunzo-africa.firebaseapp.com",
  projectId: "mafunzo-africa",
  storageBucket: "mafunzo-africa.appspot.com",
  messagingSenderId: "168281819850",
  appId: "1:168281819850:web:5ece9c9e48043ba6ba8233",
  measurementId: "G-DS53FZZ8Z2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
