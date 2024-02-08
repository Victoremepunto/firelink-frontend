import { createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    requester: "firelink-user",
    darkMode: false,
  },
  // Reducers - these are the actions that can be dispatched
  reducers: {
    setRequester: (state, action) => {
      state.requester = action.payload
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
    }
  },
})

// Selectors - these are used to get data from the store
export const getDarkMode = (state) => {
  return state.appSlice.darkMode;
}

export const getRequesterIsSet = (state) => {
  return state.appSlice.requester !== "";
}

export const getRequester = (state) => {
  return state.appSlice.requester;
}

export const loadRequester = () => {
    return async (dispatch) => {
      try {
        const response = await fetch('/index.html');
        if (response.ok) {
          // Access the header value using get() method
          const username = response.headers.get('gap-auth').split('@')[0];
          dispatch(setRequester(username))
        } else {
          console.error('Getting Username: Failed to fetch data:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Getting Username: Error during fetch:', error);
      }
    }
}



export const {  setRequester, setDarkMode } = appSlice.actions

export default appSlice.reducer