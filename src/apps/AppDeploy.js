import React, {useState, useEffect} from 'react';
import Loading from '../shared/Loading';
import {
	Radio,
	Stack,
	Page,
	PageSectionVariants,
	PageSection,
	Split,
	SplitItem,
	Card,
	CardTitle,
	CardBody,
	Title,
	TitleSizes,
	Grid,
	GridItem,
	StackItem,
    Menu,
    MenuContent,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuFooter,
    Divider,
    MenuSearch,
    MenuSearchInput,
    SearchInput,
    Switch,
} from '@patternfly/react-core';
import {
	Select,
	SelectOption
} from '@patternfly/react-core/deprecated';
import { useParams } from "react-router-dom";
import AppDeployController from './AppDeployController';
import { useSelector, useDispatch } from 'react-redux';
import {
    getApps,
    getIsAppsEmpty,
    getMyReservations,
    loadApps
} from '../store/ListSlice';
import { getRequester, getFavoriteApps  } from '../store/AppSlice'
import FadeInFadeOut from '../shared/FadeInFadeOut';

export default function AppDeploy() {

    // URL Query Params
    var { appParam } = useParams()

    // Redux
    const dispatch = useDispatch();

    // Selectors
    const apps = useSelector(getApps);
    const requester = useSelector(getRequester);
    const myReservations = useSelector(getMyReservations(requester));
    const isAppsEmpty = useSelector(getIsAppsEmpty);
    const favoriteApps = useSelector(getFavoriteApps);

    // State
    const [filteredApps, setFilteredApps] = useState(apps);
    const [menuFilter, setMenuFilter] = useState("");
    const [selectedApps, setSelectedApps] = useState([]);
    const [myReservationListSelectIsOpen, setMyReservationListSelectIsOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState("");
    const [radioUseExistingNamespace, setRadioUseExistingNamespace] = useState( myReservations.length > 0 );
    const [showFavoriteApps, setShowFavoriteApps] = useState(false);
    const [showSelectedApps, setShowSelectedApps] = useState(false);

    // Effects
    // Load apps if empty
    // only run once
    useEffect(()=>{
        if (appParam) {
            const paramApp = apps.find(app => app.name === appParam)
            if (paramApp) {
                setSelectedApps([paramApp, ...selectedApps])
            }
        }
        if (isAppsEmpty) {
            dispatch(loadApps());
        }
        if (myReservations.length > 0) {
            setSelectedReservation(myReservations[0].namespace)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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


    // Functions
    const onSelect = (_event, selectedApp) => {
        if (selectedApps.includes(selectedApp)) {
            setSelectedApps(selectedApps.filter(app => app.name !== selectedApp.name))
        }
        else {
            setSelectedApps([...selectedApps, selectedApp])
        }
    };

    const handleMenuFilterChange = (value) => {
        setMenuFilter(value);
    }

    const toggleShowFavoriteApps = () => {
        setShowFavoriteApps(!showFavoriteApps)
    }
    const toggleShowSelectedApps = () => {
        setShowSelectedApps(!showSelectedApps)
    }

    // Components
    const AppComponentListLinksCard = () => {
        return <Menu isScrollable >
            <MenuContent menuHeight="18.75rem">
              {selectedApps.map((app, appIndex) => (
                <MenuGroup key={`menu-group-${app.name}-${appIndex}`} label={app.name}>
                  <MenuList>
                    {app.components.map((component, componentIndex) => {
                      const link = `https://${component.host}.com/${component.repo}/tree/${component.ref}${component.path}`;
                      return (
                        <MenuItem key={`link-id-${component}-${componentIndex}`}>
                          <a href={link} target="_blank" rel="noreferrer">
                            {component.name}
                          </a>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </MenuGroup>
              ))}
              <Divider />
            </MenuContent>
          </Menu>
      };


    const MyReservationOptions = () => {
        return myReservations.map((reservation, index) => {
            return <SelectOption key={`${reservation.namespace}-${index}`} value={reservation.namespace}>
                {reservation.namespace}
            </SelectOption>   
        })
    }

    const NamespaceSelection = () => {
        if ( myReservations.length === 0 ) {
            return <React.Fragment>
                <p>You have no namespaces reserved. A new namespace will be reserved for you.</p>
            </React.Fragment>
        } else {
            return <React.Fragment><Radio
                isChecked={radioUseExistingNamespace}
                name="radio-use-namespace"
                onChange={() => { setRadioUseExistingNamespace(!radioUseExistingNamespace) } }
                label="Use Existing Namespace"
                id="radio-use-namespace"
                isDisabled={myReservations.length === 0}
            ></Radio>
            <Radio
                isChecked={!radioUseExistingNamespace}
                name="radio-request-namespace"
                onChange={() => { setRadioUseExistingNamespace(!radioUseExistingNamespace) } }
                label="Request New Namespace"
                id="radio-request-namespace"
            ></Radio>  
            <Select
                isOpen={myReservationListSelectIsOpen}
                onToggle={() => { setMyReservationListSelectIsOpen(!myReservationListSelectIsOpen) } } 
                onSelect={(event, selection) => { setSelectedReservation(selection) ; setMyReservationListSelectIsOpen(false) } }
                selections={selectedReservation}
                isDisabled={!radioUseExistingNamespace}>
                    <MyReservationOptions />
            </Select></React.Fragment>
        }
    }

    const AppMenu = () => {
        return <Menu  onSelect={onSelect} isScrollable>
            <MenuSearch>
                <MenuSearchInput>
                <SearchInput value={menuFilter} aria-label="Filter menu items" onChange={(_event, value) => handleMenuFilterChange(value)} />
                </MenuSearchInput>
            </MenuSearch>
            <Divider />
            <MenuContent>
                <MenuList>
                    {filteredApps.map((app, index) => {
                        return <MenuItem hasCheckbox isSelected={selectedApps.includes(app)} isFavorited={favoriteApps.includes(app.name)} key={`${app.name}-${index}`} itemId={app}>
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
                    <SplitItem>
                        <Switch label="Selected" id="show-selected" isChecked={showSelectedApps} onChange={toggleShowSelectedApps} />
                    </SplitItem>
                </Split>
            </MenuFooter>
        </Menu>
    }

    const AppMenuCard = () => {
        return <Card className="pf-u-box-shadow-md" style={{minHeight: '100%'}}>
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
                    <StackItem>
                        <Title headingLevel="h3" size={TitleSizes['3x1']}>
                            Dependencies
                        </Title>
                    </StackItem>
                    <StackItem>
                        <AppComponentListLinksCard />
                    </StackItem>
                </Stack>
            </CardBody>
        </Card>
    }

    const NamespaceSelectionCard = () => {
        return  <Card style={{minHeight: '100%'}}>
            <CardTitle>
                <Title headingLevel="h3" size={TitleSizes['3x1']}>
                    Select Ephemeral Environment
                </Title>
            </CardTitle>
            <CardBody>
                <NamespaceSelection />
            </CardBody>
        </Card>
    }

    const DeployControllerCard = () => {
        return <Card style={{minHeight: '100%'}}>
            <CardTitle>
                <Title headingLevel="h3" size={TitleSizes['3x1']}>
                    Deploy
                </Title>
            </CardTitle>
            <CardBody>
                <AppDeployController selectedApps={selectedApps} reservation={selectedReservation} />
            </CardBody>
        </Card>
    }

    const AppDeployUI = () => {
        if ( isAppsEmpty ) {
            return <Loading message="Fetching app list..."/>
        } 
        return <React.Fragment>
            <Grid hasGutter >
                <GridItem span={4} >
                    <AppMenuCard />
                </GridItem>
                <GridItem span={4}>
                    <NamespaceSelectionCard />
                </GridItem>
                <GridItem span={4}>
                    <DeployControllerCard />
                </GridItem>
            </Grid>
            
        </React.Fragment>
    }

    return <Page>
        <PageSection variant={PageSectionVariants.light}>
            <Split>
                <SplitItem>
                    <Title headingLevel="h1" size={TitleSizes['3xl']}>
                        Deploy Apps
                    </Title>
                </SplitItem>
                <SplitItem isFilled/>
            </Split>

        </PageSection>
        <PageSection>
            <FadeInFadeOut>
                <AppDeployUI />
            </FadeInFadeOut>
        </PageSection>
    </Page> 
}