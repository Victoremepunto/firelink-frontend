import React, {useState, useEffect, useRef} from 'react';
import {
	Stack,
	Split,
	SplitItem,
	StackItem,
    Menu,
    MenuContent,
    MenuList,
    MenuItem,
    MenuFooter,
    Divider,
    MenuSearch,
    MenuSearchInput,
    SearchInput,
    Switch,
    TextContent,
    Text,
} from '@patternfly/react-core';
import { useSelector, useDispatch } from 'react-redux';
import {
    getApps,
} from '../store/ListSlice';
import {
    getAppNames,
    addOrRemoveAppName,
    addOrRemoveApp,
    clearResourcesAndDependencies,
} from '../store/AppDeploySlice'
import { getFavoriteApps  } from '../store/AppSlice'
import SelectedAppsChips  from './SelectedAppsChips';

export default function AppMenuCard({onAppSelectionChange}) {

    const dispatch = useDispatch();

    const apps = useSelector(getApps);
    const selectedApps = useSelector(getAppNames);

    const menuFilterInputRef = useRef();

    const [filteredApps, setFilteredApps] = useState(apps);
    const favoriteApps = useSelector(getFavoriteApps);
    const [menuFilter, setMenuFilter] = useState("");
    const [showFavoriteApps, setShowFavoriteApps] = useState(false);

    // Filter apps
    // run when menuFilter changes
    useEffect(() => {
        let _filteredApps = apps.filter(app => app.friendly_name.toLowerCase().includes(menuFilter.toLowerCase()))
        if (showFavoriteApps) {
            _filteredApps = _filteredApps.filter(app => favoriteApps.includes(app.name))
        }
        setFilteredApps(_filteredApps)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuFilter, showFavoriteApps])
    // Update filtered apps when apps change
    useEffect(() => {
        setFilteredApps(apps)
    }, [apps])
    useEffect(() => {
        // Restore focus on the text input
        if (menuFilterInputRef.current) {
            menuFilterInputRef.current.focus();
        }
    }, [filteredApps])
    useEffect(() => {
        const appsAreSelected = selectedApps.length > 0
        onAppSelectionChange(appsAreSelected)
    }, [selectedApps])

    const toggleShowFavoriteApps = () => {
        setShowFavoriteApps(!showFavoriteApps)
    }

    const onAppSelect = (_event, selectedApp) => {
        dispatch(addOrRemoveAppName(selectedApp.name))
        dispatch(addOrRemoveApp(selectedApp))
        // This wipes out all four resource and dependency lists
        // We need to do this because the user may have selected a different app
        // and that means that the resources and dependencies for the new app are different
        // so any the user previously selected may not be valid
        // This is a bit nuclear, I know
        // But the logic required to reconcile the old resources and dependencies with the new app
        // is a bit much for me right now
        dispatch(clearResourcesAndDependencies())
      };

    const isAppFavorite = (app) => {
        return favoriteApps.includes(app.name)
    }

    const isAppSelected = (app) => {
        return selectedApps.includes(app.name)
    }

    const AppMenuItem = (app, index) => {
        return <MenuItem hasCheckbox isSelected={isAppSelected(app)} isFavorited={isAppFavorite(app)} key={`${app.name}-${index}`} itemId={app}>
            {app.friendly_name}
        </MenuItem>
    }

    const AppMenuItems = () => {
        return filteredApps.map((app, index) => {
            return AppMenuItem(app, index)
        })
    }

    return <Stack hasGutter>
        <StackItem>
            <TextContent>
                <Text>
                    Select the apps you want to deploy. You can filter the list by typing in the search box. You can also filter the list to show only your favorite apps.
                </Text>
            </TextContent>
        </StackItem>
        <StackItem>
            <SelectedAppsChips />
        </StackItem>
        <StackItem>
            <Menu onSelect={onAppSelect} isScrollable>
                <MenuSearch>
                    <MenuSearchInput>
                        <SearchInput ref={menuFilterInputRef} value={menuFilter} aria-label="Filter menu items" onChange={(_event, value) => setMenuFilter(value)} />
                    </MenuSearchInput>
                </MenuSearch>
                <Divider />
                <Divider />
                <MenuContent>
                    <MenuList >
                        {filteredApps.map((app, index) => {
                            return <MenuItem hasCheckbox isSelected={isAppSelected(app)} isFavorited={isAppFavorite(app)} key={`${app.name}-${index}`} itemId={app}>
                                {app.friendly_name}
                            </MenuItem>
                        })}
                    </MenuList>
                </MenuContent>
                <MenuFooter>
                    <Split hasGutter>
                        <SplitItem isFilled/>
                        <SplitItem>
                            <Switch label="Favorites" id="show-favorites" isChecked={showFavoriteApps} onChange={toggleShowFavoriteApps} />
                        </SplitItem>
                    </Split>
                </MenuFooter>
            </Menu>        
        </StackItem>
    </Stack>

}