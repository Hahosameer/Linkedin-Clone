import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
const initialState = {
  profilePicture: null,
  coverPicture: null,
  progress: 0,
  currentUserProfile: {
    firstname: "",
    lastname: "",
    city: "",
    country: "",
    headline: "",
    photoURL: "", // Ensure default is an empty string
    coverPhotoURL: "",
  },
  viewedUserProfile: {
    firstname: "",
    lastname: "",
    city: "",
    country: "",
    headline: "",
    photoURL: "", // Ensure default is an empty string
    coverPhotoURL: "",
  }
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    setCoverPicture: (state, action) => {
      state.coverPicture = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setCurrentUserProfile: (state, action) => {
      state.currentUserProfile = { ...state.currentUserProfile, ...action.payload };
    },
    setViewedUserProfile: (state, action) => {
      state.viewedUserProfile = { ...state.viewedUserProfile, ...action.payload };
    },
  },
});

export const { setProfilePicture, setCoverPicture, setProgress, setCurrentUserProfile, setViewedUserProfile } = profileSlice.actions;

export const updateProfilePicture = (profilePictureURL) => async (dispatch) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);

      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        await updateDoc(userDocRef, { photoURL: profilePictureURL });
        dispatch(setProfilePicture(profilePictureURL));
      } else {
        await setDoc(userDocRef, { photoURL: profilePictureURL });
        dispatch(setProfilePicture(profilePictureURL));
      }
    }
  } catch (error) {
    console.error("Error updating profile picture: ", error);
  }
};

export const updateCoverPicture = (coverPictureURL) => async (dispatch) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);

      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          coverPhotoURL: coverPictureURL,
        });
      } else {
        await updateDoc(userDocRef, {
          coverPhotoURL: coverPictureURL,
        });
      }

      dispatch(setCoverPicture(coverPictureURL));
    }
  } catch (error) {
    console.error("Error updating cover picture: ", error);
  }
};

export const updateProfileData = (userProfile) => async (dispatch) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, userProfile);

      dispatch(setCurrentUserProfile(userProfile));
    }
  } catch (error) {
    console.error("Error updating profile data: ", error);
  }
};

export const fetchViewedUserProfile = (userId) => async (dispatch) => {
  console.log(userId, "idddddddddd");

  try {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();

      dispatch(setViewedUserProfile({
        firstname: userData.firstname || ".", // First name from Firestore or Google, or empty string
        lastname: userData.lastname || "",  // Last name from Firestore or Google, or empty string
        city: userData.city || "", // Default to empty string if not provided
        country: userData.country || "", // Default to empty string if not provided
        headline: userData.headline || "", // Default to empty string if not provided
        photoURL: userData.photoURL || currentUser.photoURL || "/images/user.webp", // User's uploaded photo, or Google photo, or default
        coverPhotoURL: userData.coverPhotoURL || "/images/card-bg.svg", // User's uploaded cover, or default
      }));
    } else {
      console.error("No such document exists!");
    }
  } catch (error) {
    console.error("Error fetching viewed user profile: ", error);
  }
};

export default profileSlice.reducer;
