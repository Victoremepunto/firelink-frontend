import { configureStore, combineReducers } from '@reduxjs/toolkit'
import appSliceReducer from './AppSlice'
import listSliceReducer from './ListSlice'
import appDeploySliceReducer from './AppDeploySlice'
import paramSelectorSlice from './ParamSelectorSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['listSlice', 'appDeploySlice', 'paramSelectorSlice'],
  version : 1,
  stateReconciler: autoMergeLevel2
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