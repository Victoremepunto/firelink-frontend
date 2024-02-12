import { createSelector, createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const appDeploySlice = createSlice({
  name: 'appDeploySlice',
  initialState: {
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
    }
  },
})

// Selectors
export const getAppNames = (state) => {
  return state.appDeploySlice.app_names;
}

export const { addOrRemoveAppName } = appDeploySlice.actions

export default appDeploySlice.reducer