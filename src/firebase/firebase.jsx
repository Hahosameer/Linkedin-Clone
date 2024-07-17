
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhFNswC_nd_egPDEMyBptj8CIT6BCJz2Q",
  authDomain: "linkedin-clone-b64c8.firebaseapp.com",
  projectId: "linkedin-clone-b64c8",
  storageBucket: "linkedin-clone-b64c8.appspot.com",
  messagingSenderId: "236573968362",
  appId: "1:236573968362:web:b898f895f0fe325ba49493",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { app, auth, provider, storage,  firebaseConfig };
export default db;