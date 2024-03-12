import {
  createSelector,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

// Async Thunks
export const loadNamespaces = createAsyncThunk(
  "listSlice/loadNamespaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/firelink/namespace/list");
      if (!response.ok) {
        throw new Error("Failed to load namespaces");
      }
      const namespaces = await response.json();
      return namespaces;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const reserveNamespace = createAsyncThunk(
  "listSlice/reserveNamespace",
  async (
    { requester, duration, pool, force },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetch("/api/firelink/namespace/reserve", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requester, duration, pool, force }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.completed) {
        dispatch(loadNamespaces());
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadApps = createAsyncThunk(
  "listSlice/loadApps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/firelink/apps/list");
      if (!response.ok) {
        throw new Error("Failed to load apps");
      }
      const apps = await response.json();
      return apps;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadNamespaceResources = createAsyncThunk(
  "listSlice/loadNamespaceResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/firelink/namespace/resource_metrics`);
      if (!response.ok) {
        throw new Error("Failed to load namespace resources");
      }
      const resources = await response.json();
      return resources;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadNamespaceTopPods = createAsyncThunk(
  "listSlice/loadNamespaceTopPods",
  async (namespace, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/firelink/namespace/top_pods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ namespace }),
      });
      if (!response.ok) {
        throw new Error("Failed to load top pods");
      }
      const topPods = await response.json();
      return topPods;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
export const listSlice = createSlice({
  name: "listSlice",
  initialState: {
    namespaces: [],
    apps: [],
    namespaceResources: [],
    namespaceTopPods: [],
    loading: false,
    error: null,
    namespaceResourcesLoading: false,
  },
  reducers: {
    clearNamespaces: (state) => {
      state.namespaces = [];
    },
    clearApps: (state) => {
      state.apps = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNamespaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadNamespaces.fulfilled, (state, action) => {
        state.loading = false;
        state.namespaces = action.payload;
      })
      .addCase(loadNamespaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadApps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadApps.fulfilled, (state, action) => {
        state.loading = false;
        state.apps = action.payload;
      })
      .addCase(loadApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadNamespaceResources.pending, (state) => {
        state.loading = true;
        state.namespaceResourcesLoading = true; // Add this line
        state.error = null;
      })
      .addCase(loadNamespaceResources.fulfilled, (state, action) => {
        state.loading = false;
        state.namespaceResourcesLoading = false; // Add this line
        state.namespaceResources = action.payload;
      })
      .addCase(loadNamespaceResources.rejected, (state, action) => {
        state.loading = false;
        state.namespaceResourcesLoading = false; // Add this line
        state.error = action.payload;
      })
      .addCase(loadNamespaceTopPods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadNamespaceTopPods.fulfilled, (state, action) => {
        state.loading = false;
        state.namespaceTopPods = action.payload;
      })
      .addCase(loadNamespaceTopPods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const getNamespaces = (state) => state.listSlice.namespaces;
export const getApps = (state) => state.listSlice.apps;
export const getNamespaceResources = (state) =>
  state.listSlice.namespaceResources;
export const getNamespaceTopPods = (state) => state.listSlice.namespaceTopPods;
export const getLoading = (state) => state.listSlice.loading;
export const getError = (state) => state.listSlice.error;

export const getIsNamespacesEmpty = createSelector(
  [getNamespaces],
  (namespaces) => namespaces.length === 0
);

export const getIsAppsEmpty = createSelector(
  [getApps],
  (apps) => apps.length === 0
);

export const getResourcesForNamespace = (namespace) => (state) => {
  return state.listSlice.namespaceResources[namespace];
};

export const getNamespaceResourcesLoading = (state) =>
  state.listSlice.namespaceResourcesLoading; // Add this line

export const getMyReservations = (requester) => (state) => {
  return state.listSlice.namespaces.filter(
    (namespace) => namespace.requester === requester
  );
};

// Destructure and export actions
export const { clearNamespaces, clearApps } = listSlice.actions;

// Export reducer
export default listSlice.reducer;
