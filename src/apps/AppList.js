import React from 'react';
import {useState, useEffect} from 'react';
import {Title, TitleSizes} from '@patternfly/react-core';
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

function AppListJSX({AppList}) {
    const isAppsEmpty = useSelector(getIsAppsEmpty);
    if ( isAppsEmpty ) {
        return <Loading message="Fetching app list..." />
    } else {
        return <Gallery hasGutter>
            {AppList.map((app, index) => {
                const key = `app-list-item-${app.name}-${index}`;
                return <AppListItem app={app} key={key}/>
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

    //Filter app list when filter is updated
    useEffect(() => {
        if (filter === '') {
            setFilteredApps(apps)
            
        } else {
            setFilteredApps(apps.filter(app => app.name.includes(filter)))
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
                    <TextInput
                        value={filter}
                        type="text"
                        
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
            <AppListJSX AppList={filteredApps} />
        </PageSection>
    </Page> 

};

export default AppList;