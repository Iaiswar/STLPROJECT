// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import loginDataReducer from '../components/Login/Slice/LoginSlice';
import storeTokenReducer from '../components/Login/AuthSlice/StoreToken';
import authReducer from '../components/user/Slice/UserSlice';
import operatorLoginReducer from '../components/OperatorLogin/Slice/OperatorLoginSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['LoginData', 'StoreTokenData', 'operatorLoginData'], // persist these
};

const rootReducer = combineReducers({
  LoginData: loginDataReducer,
  StoreTokenData: storeTokenReducer,
  auth: authReducer,
  operatorLoginData: operatorLoginReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
