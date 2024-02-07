import { configureStore } from '@reduxjs/toolkit'
import appSliceReducer from './AppSlice'

export default configureStore({
  reducer: {
    appSlice: appSliceReducer,
  },
})