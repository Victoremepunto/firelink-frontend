import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appSliceReducer from './AppSlice'
import listSliceReducer from './ListSlice'
import appDeploySliceReducer from './AppDeploySlice'
import paramSelectorSlice from './ParamSelectorSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['listSlice', 'appDeploySlice', 'paramSelectorSlice']
}

const rootReducer = combineReducers({ 
  appSlice: appSliceReducer, 
  listSlice: listSliceReducer, 
  appDeploySlice: appDeploySliceReducer,
  paramSelectorSlice: paramSelectorSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const Store = configureStore({
  reducer: persistedReducer,
})

export const Persistor = persistStore(Store)