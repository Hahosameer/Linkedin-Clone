import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice";
import articleSlice from "./Slices/AriticleSlice"; // Typo here: change AriticleSlice to ArticleSlice
import profileSlice from "./Slices/profileSlice";

const store = configureStore(
  {
    reducer: {
      user: userSlice,
      article: articleSlice,
      profile: profileSlice, // Corrected the slice name here
    },
  },
  +window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;