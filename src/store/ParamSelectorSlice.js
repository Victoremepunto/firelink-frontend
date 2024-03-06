import { createSlice } from '@reduxjs/toolkit'

// Slice - this is the state and the actions that can be dispatched
export const paramSelectorSlice = createSlice({
  name: 'paramSelectorSlice',
  initialState: {
    options: [
        {
            name: "SOME_TEMPLATE_PARAM",
            value: "some value"
        }
    ],
    selectedParameters: [],
  },
  // Reducers - these are the actions that can be dispatched
  reducers: {
    setStoreOptions: (state, action) => {
      state.options = action.payload
    },
    createStoreOptionsFromApps: (state, action) => {
        state.options = action.payload.map((app) => {
            return {
                name: app.friendly_name,
                id: app.name,
                children: app.components.map((component) => {
                    return {
                        name: component.name,
                        id: component.name,
                        children: Object.entries(component.parameters).map(([paramName, paramValue]) => {
                            return {
                                name: paramName,
                                component: component.name,
                                id: component.name + paramName,
                                value: paramValue
                            }
                        })
                    }
                })
            }
        })
    },
    setStoreSelectedParameters: (state, action) => {
      state.selectedParameters = action.payload
    },
    addOrRemoveStoreSelectedParameter: (state, action) => {
        const index = state.selectedParameters.findIndex((param) => param.id === action.payload.id)
        if (index !== -1) {
            state.selectedParameters = state.selectedParameters.filter((param) => param.id !== action.payload.id)
        } else {
            state.selectedParameters = [...state.selectedParameters, action.payload]
        }
    },
    clearAll: (state) => {
        state.selectedParameters = [];
        state.options = [
            {
                name: "SOME_TEMPLATE_PARAM",
                value: "some value"
            }
        ];
    }
  }
})

// Selectors - these are used to get data from the store
export const getStoreOptions = (state) => {
  return state.paramSelectorSlice.options;
}

export const getStoreSelectedParameters = (state) => {
    return state.paramSelectorSlice.selectedParameters;
}



export const { 
    setStoreOptions,
    setStoreSelectedParameters,
    addOrRemoveStoreSelectedParameter,
    createStoreOptionsFromApps,
    clearAll
 } = paramSelectorSlice.actions

export default paramSelectorSlice.reducer