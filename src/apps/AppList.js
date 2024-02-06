import React from 'react';
import {useContext, useState, useEffect} from 'react';
import {Title, TitleSizes} from '@patternfly/react-core';
import Loading from '../shared/Loading';
import { AppContext } from "../shared/ContextProvider"
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { TextInput, Page, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { Gallery } from '@patternfly/react-core';
import { Split, SplitItem } from '@patternfly/react-core';
import AppListItem from './AppListItem';

function AppListJSX({AppState, AppList}) {
    if ( AppState.isAppsEmpty() ) {
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
    const [AppState] = useContext(AppContext);
    const [filteredApps, setFilteredApps] = useState(AppState.apps);

    //App list filter text
    const [filter, setFilter] = useState('')

    //Filter app list when filter is updated
    useEffect(() => {
        const apps = [...AppState.apps]
        if (filter === '') {
            setFilteredApps(apps)
            
        } else {
            setFilteredApps(apps.filter(app => app.name.includes(filter)))
        }
    }, [filter])

    useEffect(() => {
        setFilteredApps(AppState.apps)
    } ,[AppState.apps])

    useEffect(() => {
        if (AppState.isAppsEmpty()) {
            AppState.getApps()
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
                        AppState.update({apps: []}); 
                        AppState.getApps() 
                    }} >
                            Refresh
                    </Button>
                </SplitItem>
            </Split>
        </PageSection>
        <PageSection>
            <AppListJSX AppState={AppState} AppList={filteredApps} />
        </PageSection>
    </Page> 

};

export default AppList;