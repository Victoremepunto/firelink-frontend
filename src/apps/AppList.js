import React from 'react';
import {useState, useEffect} from 'react';
import {Switch, Title, TitleSizes} from '@patternfly/react-core';
import Loading from '../shared/Loading';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { TextInput, Page, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { Gallery } from '@patternfly/react-core';
import { Split, SplitItem } from '@patternfly/react-core';
import AppListItem from './AppListItem';

import { useSelector, useDispatch } from 'react-redux';
import {
    getIsAppsEmpty,
    loadApps,
    clearApps,
    getApps
} from '../store/ListSlice';
import {
    getIsAppFavorite
}   from '../store/AppSlice';

function AppListJSX({AppList, ShowFavorites}) {
    const isAppsEmpty = useSelector(getIsAppsEmpty);
    if ( isAppsEmpty ) {
        return <Loading message="Fetching app list..." />
    } else {
        return <Gallery hasGutter>
            {AppList.map((app, index) => {
                const key = `app-list-item-${app.name}-${index}`;
                return <AppListItem app={app} key={key} showFavorites={ShowFavorites}/>
            })}
        </Gallery>
    }
}

function AppList() {

    //Get the global state
    const dispatch = useDispatch();
    const apps = useSelector(getApps);
    const isAppsEmpty = useSelector(getIsAppsEmpty);
    const [filteredApps, setFilteredApps] = useState(apps);

    //App list filter text
    const [filter, setFilter] = useState('')
    const [showFavorites, setShowFavorites] = useState(false)

    //Filter app list when filter is updated
    useEffect(() => {
        let tmpFilteredApps = apps

        if (filter === '') {
            setFilteredApps(tmpFilteredApps)
            
        } else {
            setFilteredApps(tmpFilteredApps.filter(app => app.name.includes(filter)))
        }
    }, [filter])

    useEffect(() => {
        setFilteredApps(apps)
    } ,[apps])

    useEffect(() => {
        if (isAppsEmpty) {
            dispatch(loadApps());
        }
    }, []);
  
    return <Page>
        <PageSection variant={PageSectionVariants.light}>
            <Split hasGutter>
                <SplitItem>
                    <Title headingLevel="h1" size={TitleSizes['3xl']}>
                        Apps
                    </Title>
                </SplitItem>
                <SplitItem isFilled/>
                <SplitItem>
                    <Switch  isReversed="true" id="app-list-favorites" label="Show Favorites" labelOff="Show All" isChecked={showFavorites} onChange={() => setShowFavorites(!showFavorites)}/>
                </SplitItem>
                <SplitItem>
                    <TextInput
                        value={filter}
                        type="text"
                        placeholder="Filter apps"
                        onChange={(_event, value) => setFilter(value)}
                        aria-label="text input app list filter"/>
                </SplitItem>
                <SplitItem>
                    <Button variant="primary" onClick={() => { 
                        dispatch(clearApps());
                        dispatch(loadApps());
                    }} >
                            Refresh
                    </Button>
                </SplitItem>
            </Split>
        </PageSection>
        <PageSection>
            <AppListJSX AppList={filteredApps} ShowFavorites={showFavorites}/>
        </PageSection>
    </Page> 

};

export default AppList;