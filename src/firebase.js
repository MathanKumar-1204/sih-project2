// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8JJ2aobt-it02sDNKw5BkFYgwaSuHtOY",
  authDomain: "langtrans-c40eb.firebaseapp.com",
  projectId: "langtrans-c40eb",
  storageBucket: "langtrans-c40eb.appspot.com",
  messagingSenderId: "1007549309113",
  appId: "1:1007549309113:web:dd63d9d97b8aa4bd6c3b68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize the database

export { database };
