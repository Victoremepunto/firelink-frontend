import { createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    requester: "firelink-user",
    darkMode: false,
    favoriteApps: []
  },
  // Reducers - these are the actions that can be dispatched
  reducers: {
    setRequester: (state, action) => {
      state.requester = action.payload
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
    },
    setFavoriteApp: (state, action) => {
      // Only push the favorite in if the favorite isn't already there
      if (!state.favoriteApps.includes(action.payload)) {
        state.favoriteApps.push(action.payload)
      }
    },
    removeFavoriteApp: (state, action) => {
      state.favoriteApps = state.favoriteApps.filter(app => app !== action.payload)
    }
  }
})

// Selectors - these are used to get data from the store
export const getIsAppFavorite = (app) => (state) => {
  return state.appSlice.favoriteApps.includes(app);
}

export const getDarkMode = (state) => {
  return state.appSlice.darkMode;
}

export const getFavoriteApps = (state) => {
  return state.appSlice.favoriteApps;
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



export const {  setRequester, setDarkMode, setFavoriteApp, removeFavoriteApp } = appSlice.actions

export default appSlice.reducer