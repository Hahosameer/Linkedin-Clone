import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage for web
import userSlice from "./Slices/userSlice";
import articleSlice from "./Slices/AriticleSlice"; // Corrected the typo here
import profileSlice from "./Slices/profileSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedProfileReducer = persistReducer(persistConfig, profileSlice);

const store = configureStore({
  reducer: {
    user: userSlice,
    article: articleSlice,
    profile: persistedProfileReducer, // Using persisted reducer for profile
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);

export { store, persistor };
