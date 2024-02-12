import { createSelector, createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const appDeploySlice = createSlice({
  name: 'appDeploySlice',
  initialState: {
    //We need to store the apps along with the app_names even though we only send the app_names to the backend
    //We do this because we need other properties of the app object in the UI such as components and template params
    apps: [],
    app_names: [],
    requester: "",
    duration: "1h",
    no_release_on_fail: true,
    frontends: false,
    pool: "default",
    namespace: "",
    //Options not exposed in the UI
    timeout: 600,
    source: 'appsre',
    get_dependencies: true,
    optional_deps_method: 'hybrid',
    set_image_tag: {},
    ref_env: null,
    target_env: 'insights-ephemeral',
    set_template_ref: {},
    set_parameter: {},
    clowd_env: null,
    local_config_path: null,
    remove_resources: [],
    no_remove_resources: [],
    remove_dependencies: [],
    no_remove_dependencies: [],
    single_replicas: true,
    name: null,
    component_filter: [],
    import_secrets: false,
    secrets_dir: '',
    local: true,
  },
  // Reducers - these are the actions that can be dispatched
  reducers: {
    addOrRemoveAppName: (state, action) => {
        const index = state.app_names.indexOf(action.payload);
        if (index === -1) {
            state.app_names.push(action.payload);
        } else {
            state.app_names.splice(index, 1);
        }
    },
    addOrRemoveApp: (state, action) => {
        //Se if we have an app object with a matching name property
        const index = state.apps.findIndex(app => app.name === action.payload.name);
        if (index === -1) {
            state.apps.push(action.payload);
        } else {
            state.apps.splice(index, 1);
        }
    },
    setRequester: (state, action) => {
        state.requester = action.payload;
    },
  },
})

// Selectors
export const getAppNames = (state) => {
  return state.appDeploySlice.app_names;
}

export const { addOrRemoveAppName, setRequester, addOrRemoveApp } = appDeploySlice.actions

export default appDeploySlice.reducer