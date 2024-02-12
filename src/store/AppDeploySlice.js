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
    no_release_on_fail: false,
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
    //Reducers for the other options
    setDuration: (state, action) => {
        state.duration = action.payload;
    },
    setNoReleaseOnFail: (state, action) => {
        state.no_release_on_fail = action.payload;
    },
    setFrontends: (state, action) => {
        state.frontends = action.payload;
    },
    setPool: (state, action) => {
        state.pool = action.payload;
    },
    setNamespace: (state, action) => {
        state.namespace = action.payload;
    },
    setTimeout: (state, action) => {
        state.timeout = action.payload;
    },
    setSource: (state, action) => {
        state.source = action.payload;
    },
    setGetDependencies: (state, action) => {
        state.get_dependencies = action.payload;
    },
    setOptionalDepsMethod: (state, action) => {
        state.optional_deps_method = action.payload;
    },
    setSetImageTag: (state, action) => {
        state.set_image_tag = action.payload;
    },
    setRefEnv: (state, action) => {
        state.ref_env = action.payload;
    },
    setTargetEnv: (state, action) => {
        state.target_env = action.payload;
    },
    setTemplateRef: (state, action) => {
        state.set_template_ref = action.payload;
    },
    setSetParameter: (state, action) => {
        state.set_parameter = action.payload;
    },
    setClowdEnv: (state, action) => {
        state.clowd_env = action.payload;
    },
    setLocalConfigPath: (state, action) => {
        state.local_config_path = action.payload;
    },
    setRemoveResources: (state, action) => {
        state.remove_resources = action.payload;
    },
    setNoRemoveResources: (state, action) => {
        state.no_remove_resources = action.payload;
    },
    setRemoveDependencies: (state, action) => {
        state.remove_dependencies = action.payload;
    },
    setNoRemoveDependencies: (state, action) => {
        state.no_remove_dependencies = action.payload;
    },
    setSingleReplicas: (state, action) => {
        state.single_replicas = action.payload;
    },
    setName: (state, action) => {
        state.name = action.payload;
    },
    setComponentFilter: (state, action) => {
        state.component_filter = action.payload;
    },
    setImportSecrets: (state, action) => {
        state.import_secrets = action.payload;
    },
    setSecretsDir: (state, action) => {
        state.secrets_dir = action.payload;
    },
    setLocal: (state, action) => {
        state.local = action.payload;
    },
  },
})

// Selectors
export const getAppDeploySlice = (state) => state.appDeploySlice
export const getAppNames = createSelector(
    [getAppDeploySlice],
    (opts) => opts.app_names
)
export const getAppDeployApps = createSelector(
    [getAppDeploySlice],
    (opts) => opts.apps
)
export const getAppDeployRequester = createSelector(
    [getAppDeploySlice],
    (opts) => opts.requester
)
export const getAppDeployDuration = createSelector(
    [getAppDeploySlice],
    (opts) => opts.duration
)
export const getAppDeployNoReleaseOnFail = createSelector(
    [getAppDeploySlice],
    (opts) => opts.no_release_on_fail
)
export const getAppDeployFrontends = createSelector(
    [getAppDeploySlice],
    (opts) => opts.frontends
)
export const getAppDeployPool = createSelector(
    [getAppDeploySlice],
    (opts) => opts.pool
)
export const getAppDeployNamespace = createSelector(
    [getAppDeploySlice],
    (opts) => opts.namespace
)
export const getAppDeployTimeout = createSelector(
    [getAppDeploySlice],
    (opts) => opts.timeout
)
export const getAppDeploySource = createSelector(
    [getAppDeploySlice],
    (opts) => opts.source
)
export const getAppDeployGetDependencies = createSelector(
    [getAppDeploySlice],
    (opts) => opts.get_dependencies
)
export const getAppDeployOptionalDepsMethod = createSelector(
    [getAppDeploySlice],
    (opts) => opts.optional_deps_method
)
export const getAppDeploySetImageTag = createSelector(
    [getAppDeploySlice],
    (opts) => opts.set_image_tag
)
export const getAppDeployRefEnv = createSelector(
    [getAppDeploySlice],
    (opts) => opts.ref_env
)
export const getAppDeployTargetEnv = createSelector(
    [getAppDeploySlice],
    (opts) => opts.target_env
)
export const getAppDeployTemplateRef = createSelector(
    [getAppDeploySlice],
    (opts) => opts.set_template_ref
)
export const getAppDeploySetParameter = createSelector(
    [getAppDeploySlice],
    (opts) => opts.set_parameter
)
export const getAppDeployClowdEnv = createSelector(
    [getAppDeploySlice],
    (opts) => opts.clowd_env
)
export const getAppDeployLocalConfigPath = createSelector(
    [getAppDeploySlice],
    (opts) => opts.local_config_path
)
export const getAppDeployRemoveResources = createSelector(
    [getAppDeploySlice],
    (opts) => opts.remove_resources
)
export const getAppDeployNoRemoveResources = createSelector(
    [getAppDeploySlice],
    (opts) => opts.no_remove_resources
)
export const getAppDeployRemoveDependencies = createSelector(
    [getAppDeploySlice],
    (opts) => opts.remove_dependencies
)
export const getAppDeployNoRemoveDependencies = createSelector(
    [getAppDeploySlice],
    (opts) => opts.no_remove_dependencies
)
export const getAppDeploySingleReplicas = createSelector(
    [getAppDeploySlice],
    (opts) => opts.single_replicas
)
export const getAppDeployName = createSelector(
    [getAppDeploySlice],
    (opts) => opts.name
)
export const getAppDeployComponentFilter = createSelector(
    [getAppDeploySlice],
    (opts) => opts.component_filter
)
export const getAppDeployImportSecrets = createSelector(
    [getAppDeploySlice],
    (opts) => opts.import_secrets
)
export const getAppDeploySecretsDir = createSelector(
    [getAppDeploySlice],
    (opts) => opts.secrets_dir
)
export const getAppDeployLocal = createSelector(
    [getAppDeploySlice],
    (opts) => opts.local
)



export const getDeploymentOptions = createSelector(
    [getAppDeploySlice],
    (opts) => { return {
        app_names: opts.app_names,
        requester: opts.requester,
        duration: opts.duration,
        no_release_on_fail: opts.no_release_on_fail,
        frontends: opts.frontends,
        pool: opts.pool,
        namespace: opts.namespace,
        timeout: opts.timeout,
        source: opts.source,
        get_dependencies: opts.get_dependencies,
        optional_deps_method: opts.optional_deps_method,
        set_image_tag: opts.set_image_tag,
        ref_env: opts.ref_env,
        target_env: opts.target_env,
        set_template_ref: opts.set_template_ref,
        set_parameter: opts.set_parameter,
        clowd_env: opts.clowd_env,
        local_config_path: opts.local_config_path,
        remove_resources: opts.remove_resources,
        no_remove_resources: opts.no_remove_resources,
        remove_dependencies: opts.remove_dependencies,
        no_remove_dependencies: opts.no_remove_dependencies,
        single_replicas: opts.single_replicas,
        name: opts.name,
        component_filter: opts.component_filter,
        import_secrets: opts.import_secrets,
        secrets_dir: opts.secrets_dir,
        local: opts.local
    }}
)

export const { 
    addOrRemoveAppName, 
    setRequester, 
    addOrRemoveApp, 
    setDuration,
    setNoReleaseOnFail,
    setFrontends,
    setPool,
    setNamespace,
    setTimeout,
    setSource,
    setGetDependencies,
    setOptionalDepsMethod,
    setSetImageTag,
    setRefEnv,
    setTargetEnv,
    setTemplateRef,
    setSetParameter,
    setClowdEnv,
    setLocalConfigPath,
    setRemoveResources,
    setNoRemoveResources,
    setRemoveDependencies,
    setNoRemoveDependencies,
    setSingleReplicas,
    setName,
    setComponentFilter,
    setImportSecrets,
    setSecretsDir,
    setLocal
} = appDeploySlice.actions

export default appDeploySlice.reducer