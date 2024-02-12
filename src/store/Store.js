import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appSliceReducer from './AppSlice'
import listSliceReducer from './ListSlice'
import appDeploySliceReducer from './AppDeploySlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['listSlice', 'appDeploySlice']
}

const rootReducer = combineReducers({ appSlice: appSliceReducer, listSlice: listSliceReducer, appDeploySlice: appDeploySliceReducer})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const Store = configureStore({
  reducer: persistedReducer,
})

export const Persistor = persistStore(Store)