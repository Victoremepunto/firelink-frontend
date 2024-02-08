import { createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    requester: "firelink-user",
    namespaces: [],
    apps: [],
    darkMode: false,
  },
  // Reducers - these are the actions that can be dispatched
  reducers: {
    setRequester: (state, action) => {
      state.requester = action.payload
    },
    setNamespaces: (state, action) => {
      state.namespaces = action.payload
    },
    setApps: (state, action) => {
      state.apps = action.payload
    },
    clearNamespaces: (state) => {
      state.namespaces = []
    },
    clearApps: (state) => {
      state.apps = []
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

export const getIsNamespacesEmpty = (state) => {
  return state.appSlice.namespaces.length === 0;
}

export const getIsAppsEmpty = (state) => {
  return state.appSlice.apps.length === 0;
}

export const getMyReservations = (state) => {
  return state.appSlice.namespaces.filter(namespace => namespace.requester === state.appSlice.requester);
}

export const getRequesterIsSet = (state) => {
  return state.appSlice.requester !== "";
}

export const getNamespaces = (state) => {
  return state.appSlice.namespaces;
}

export const getApps = (state) => {
  return state.appSlice.apps;
}

export const getRequester = (state) => {
  return state.appSlice.requester;
}

// Thunks - these are async actions that can be dispatched
export const loadNamespaces = () => {
    return async (dispatch) => {
      try {
        fetch('/api/firelink/namespace/list')
        .then(response => response.json())
        .then(namespaces => {
            dispatch(setNamespaces(namespaces))
        });
      } catch (err) {
        console.log("Error loading namespaces: ", err)
      }
    }
}

export const loadApps = () => {
    return async (dispatch) => {
      try {
        fetch('/api/firelink/apps/list')
        .then(response => response.json())
        .then(apps => {
            dispatch(setApps(apps))
        });
      } catch (err) {
        console.log("Error loading namespaces: ", err)
      }
    }
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



export const { setApps, setNamespaces, setRequester, clearNamespaces, clearApps, setDarkMode } = appSlice.actions

export default appSlice.reducer