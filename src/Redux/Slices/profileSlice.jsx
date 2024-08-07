import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

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
  },
  viewedUserProfile: {
    firstname: "",
    lastname: "",
    city: "",
    country: "",
    headline: "",
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
      state.currentUserProfile = { ...state.currentUserProfile, ...action.payload }; // merging current and new data
    },
    setViewedUserProfile: (state, action) => {
      state.viewedUserProfile = { ...state.viewedUserProfile, ...action.payload }; // merging current and new data
    },
  },
});

// Export actions
export const { setProfilePicture, setCoverPicture, setProgress, setCurrentUserProfile, setViewedUserProfile } = profileSlice.actions;

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

      dispatch(setCurrentUserProfile(userProfile));
    }
  } catch (error) {
    console.error("Error updating profile data: ", error);
  }
};

export const fetchViewedUserProfile = (userId) => async (dispatch) => {
  try {
    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);

    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      dispatch(setViewedUserProfile(userData));
    }
  } catch (error) {
    console.error("Error fetching viewed user profile: ", error);
  }
};

export default profileSlice.reducer;
