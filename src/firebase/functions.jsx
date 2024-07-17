import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDownloadURL, ref, getStorage, uploadBytesResumable } from 'firebase/storage';
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  orderBy,
} from 'firebase/firestore';
import db, { firebaseConfig } from '../firebase/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setProgress } from "../Redux/Slices/AriticleSlice.jsx"; // Import setProgress
// console.log(setProgress, "setProgresssetProgress");
// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage();

// Sign in with Google
export function signInAPI() {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = await GoogleAuthProvider.credentialFromResult(result);
      const token = await credential.accessToken;
      const user = await result.user;
      console.log(user);
      resolve(user);
    } catch (error) {
      const errorMessage = error.message;
      reject(errorMessage);
    }
  });
}

// Get user authentication state
export function getUserAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        console.log("User is signed out");
        resolve(null);
      }
    });
  });
}

// Sign out
export function signOutAPI() {
  signOut(auth)
    .then(() => {
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      console.error("Sign-out error:", error);
    });
}


//  upload image
export function uploadImage(img, fileName, dispatch) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `posts/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        dispatch(setProgress(progress));
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}
// Add a document to Firestore
export async function addInDB(post) {
  try {
    const saveData = doc(collection(db, "posts"));
    await setDoc(saveData, post);
    console.log("Document added successfully");
  } catch (error) {
    console.error("Error adding document:", error);
  }
}

// Get all documents ordered by timestamp from Firestore
export async function getAllDataOrderedByTimestamp(collectionName) {
  try {
    const q = query(collection(db, collectionName), orderBy("timestamp"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs.map((doc) => doc?.data());
      return {
        status: true,
        data: data,
      };
    } else {
      return {
        status: false,
        message: "No documents found!",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
}

// Get a specific document from Firestore
export async function getADocument(id) {
  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}
