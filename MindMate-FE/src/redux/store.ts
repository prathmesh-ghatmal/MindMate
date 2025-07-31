// src/redux/store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./slices/authSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine all your slice reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Apply redux-persist wrapper
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Redux Persistor
export const persistor = persistStore(store);

// App-wide types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
