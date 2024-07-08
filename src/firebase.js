import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut,} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAWIuOJcUNQdm948c-oz6NBfPnTo2VWBF4",
    authDomain: "final-db648.firebaseapp.com",
    projectId: "final-db648",
    storageBucket: "final-db648.appspot.com",
    messagingSenderId: "682781839885",
    appId: "1:682781839885:web:61bf406fdd1d7ef3bfbb44",
    measurementId: "G-KDFF67CPN2"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  export { app, db, provider, auth };