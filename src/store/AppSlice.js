import { createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    requester: "firelink-user",
    darkMode: true,
    favoriteApps: [],
    deployRecipes: [],
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
    addDeployRecipe: (state, action) => {
      state.deployRecipes.push(action.payload)
    },
    removeDeployRecipe: (state, action) => {
      state.deployRecipes = state.deployRecipes.filter(recipe => recipe !== action.payload)
    },
    removeFavoriteApp: (state, action) => {
      state.favoriteApps = state.favoriteApps.filter(app => app !== action.payload)
    }
  }
})

export const getRecipeById = (id) => (state) => {
  return state.appSlice.deployRecipes.find(recipe => recipe.id === id);
}

// Selectors - these are used to get data from the store
export const getIsAppFavorite = (app) => (state) => {
  return state.appSlice.favoriteApps.includes(app);
}

export const getDeployRecipes = (state) => {
  return state.appSlice.deployRecipes;
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



export const {  setRequester, setDarkMode, setFavoriteApp, removeFavoriteApp, addDeployRecipe, removeDeployRecipe } = appSlice.actions

export default appSlice.reducer