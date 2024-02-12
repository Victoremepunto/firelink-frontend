import React, {useState, useEffect, useRef} from 'react';
import {
	Stack,
	Split,
	SplitItem,
	Card,
	CardTitle,
	CardBody,
	Title,
	TitleSizes,
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
} from '@patternfly/react-core';
import { useSelector } from 'react-redux';
import {
    getApps,
} from '../store/ListSlice';
import { getFavoriteApps  } from '../store/AppSlice'


export default function AppMenuCard() {


    const apps = useSelector(getApps);

    const menuRef = useRef();
    const menuFilterInputRef = useRef();

    const [filteredApps, setFilteredApps] = useState(apps);
    const favoriteApps = useSelector(getFavoriteApps);
    const [selectedApps, setSelectedApps] = useState([]);
    const [menuFilter, setMenuFilter] = useState("");
    const [showFavoriteApps, setShowFavoriteApps] = useState(false);
    const [savedScrollPosition, setSavedScrollPosition] = useState(0);

    // Filter apps
    // run when menuFilter changes
    useEffect(() => {
        setFilteredApps(apps.filter(app => app.friendly_name.toLowerCase().includes(menuFilter.toLowerCase())))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuFilter])
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
        // Restore scroll position
        if (menuRef.current) {
          menuRef.current.scrollTop = savedScrollPosition;
        }
    }, [filteredApps, savedScrollPosition]);


    const handleMenuFilterChange = (value) => {
        setMenuFilter(value);
    }

    const toggleShowFavoriteApps = () => {
        setShowFavoriteApps(!showFavoriteApps)
    }

    const onAppSelect = (_event, selectedApp) => {
        setSelectedApps((prevSelectedApps) => {
          if (prevSelectedApps.includes(selectedApp)) {
            return prevSelectedApps.filter((app) => app.name !== selectedApp.name);
          } else {
            return [...prevSelectedApps, selectedApp];
          }
        });
      };

    const isAppFavorite = (app) => {
        return favoriteApps.includes(app.name)
    }

    const isAppSelected = (app) => {
        return selectedApps.includes(app)
    }

    const AppMenuItem = (app, index) => {
        return <MenuItem hasCheckbox isSelected={isAppSelected(app)} isFavorited={isAppFavorite(app)} key={`${app.name}-${index}`} itemId={app}>
            {app.friendly_name}
        </MenuItem>
    }

    const handleMenuScroll = () => {
        // Save the scroll position when the menu is scrolled
        if (menuRef.current) {
          setSavedScrollPosition(menuRef.current.scrollTop);
        }
    };
  
    const AppMenu = () => {
        return <Menu  onSelect={onAppSelect} isScrollable onScroll={handleMenuScroll} ref={menuRef}>
            <MenuSearch>
                <MenuSearchInput>
                    <SearchInput ref={menuFilterInputRef} value={menuFilter} aria-label="Filter menu items" onChange={(_event, value) => handleMenuFilterChange(value)} />
                </MenuSearchInput>
            </MenuSearch>
            <Divider />
            <MenuContent menuHeight="100%">
                <MenuList>
                    {filteredApps.map((app, index) => {
                        return AppMenuItem(app, index)  
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
    }

    return <Card className="pf-u-box-shadow-md" isFullHeight>
        <CardTitle>
            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                Select Apps to Deploy
            </Title>
        </CardTitle>
        <CardBody >
            <Stack hasGutter>
                <StackItem>
                    <AppMenu />
                </StackItem>
            </Stack>
        </CardBody>
    </Card>
}