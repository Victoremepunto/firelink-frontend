import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appSliceReducer from './AppSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({ appSlice: appSliceReducer })

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const Store = configureStore({
  reducer: persistedReducer,
})

export const Persistor = persistStore(Store)