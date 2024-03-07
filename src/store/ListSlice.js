import { createSelector, createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const listSlice = createSlice({
  name: 'listSlice',
  initialState: {
    namespaces: [],
    apps: [],
    namespace_resources: [],
    namespace_top_pods: {}
  },
  // Reducers - these are the actions that can be dispatched
  reducers: {
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
    setNamespaceResources: (state, action) => {
      state.namespace_resources = action.payload
    },
    setNamespaceTopPods: (state, action) => {
      state.namespace_top_pods = action.payload
    }
  },
})

// Selectors - these are used to get data from the store
export const getNamespaces = (state) => {
  return state.listSlice.namespaces;
}

export const getApps = (state) => {
  return state.listSlice.apps;
}

export const getNamespaceTopPods = (state) => {
  return state.listSlice.namespace_top_pods;
}

export const getIsNamespacesEmpty = createSelector(
  [getNamespaces],
  (namespaces) => namespaces.length === 0
);

export const getIsAppsEmpty = createSelector(
  [getApps],
  (apps) => apps.length === 0
);

export const getNamespaceResources = (state) => {
  return state.listSlice.namespace_resources;
}

export const getResourcesForNamespace = (namespace) => (state) => {
  return state.listSlice.namespace_resources[namespace]
}

export const getMyReservations = (requester) => (state) => {
  return state.listSlice.namespaces.filter(namespace => namespace.requester === requester);
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

export const loadNamespaceResources = (namespace) => {
    return async (dispatch) => {
      try {
        fetch(`/api/firelink/namespace/resource_metrics`)
        .then(response => response.json())
        .then(resources => {
            dispatch(setNamespaceResources(resources))
        });
      } catch (err) {
        console.log("Error loading resource metrics: ", err)
      }
    }
}

export const loadNamespaceTopPods = (namespace) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`/api/firelink/namespace/top_pods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ namespace: namespace }),
      });

      if (response.ok) {
        const top_pods = await response.json();
        dispatch(setNamespaceTopPods(top_pods));
      } else {
        console.error('Error loading top pods: HTTP status', response.status);
      }
    } catch (err) {
      console.error('Error loading top pods:', err);
    }
  }
}



export const { setNamespaceTopPods, setApps, setNamespaces, clearNamespaces, clearApps, setNamespaceResources } = listSlice.actions

export default listSlice.reducer