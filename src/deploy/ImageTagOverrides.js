import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getAppDeployApps,
    getAppDeploySetImageTag,
    setSetImageTag,
} from "../store/AppDeploySlice";

export function ImageTagOverrides() {

    const dispatch = useDispatch();

    const apps = useSelector(getAppDeployApps);
    const imageTagOverrides = useSelector(getAppDeploySetImageTag);

    const setStoreSetImageTag = (param) => dispatch(setSetImageTag(param));

    // Get an array of component objects from the apps
    const components = () => {
        return apps.map((app) => {
            return app.components
         }).flat();
    }

    return <div>
            <h1>ImageTagOverrides</h1>
            <p>ImageTagOverrides.js</p>
        </div>
}