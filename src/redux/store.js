import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authorizationReducer from "../slices/authorizationSlice";

const rootReducer = combineReducers({
  authorization: authorizationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authorization"], // only persist this slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
