import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const initialState = {
  profilePicture: null,
  coverPicture: null,
  progress: 0,
  userProfile: {
    firstname: "",
    lastname: "",
    city: "",
    country: "",
    headline: "",
  },
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
    setUserProfile: (state, action) => {
      state.userProfile = { ...state.userProfile, ...action.payload }; // merging current and new data
    },
  },
});

export const { setProfilePicture, setCoverPicture, setProgress, setUserProfile } = profileSlice.actions;

export const updateProfilePicture = (profilePictureURL) => async (dispatch) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);

      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          photoURL: profilePictureURL,
        });
      } else {
        await updateDoc(userDocRef, {
          photoURL: profilePictureURL,
        });
      }

      dispatch(setProfilePicture(profilePictureURL));
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

      dispatch(setUserProfile(userProfile));
    }
  } catch (error) {
    console.error("Error updating profile data: ", error);
  }
};

export default profileSlice.reducer;