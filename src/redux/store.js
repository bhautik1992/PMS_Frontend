// ** Redux Imports
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { encryptTransform } from 'redux-persist-transform-encrypt';
import createCompressor from 'redux-persist-transform-compress';

import thunk from "redux-thunk";

const encryptor = encryptTransform({
    secretKey: import.meta.env.VITE_ENCRYPT_KEY,
    onError: (error) => {
        console.error('Encryption error:', error);
    },
});

const compressor = createCompressor();

const persistConfig = {
  key: 'root',
  storage,
//   transforms: [encryptor],
  transforms: [encryptor, compressor],
  // blacklist: ["PopupReducer"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

//configureStore automatically includes thunk, you don't necessarily need to add it manually
// However, if you want to explicitly include it you can use concat
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore redux-persist actions
        },
      }).concat(thunk),
  });

export { store };


