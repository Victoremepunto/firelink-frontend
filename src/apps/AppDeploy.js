import React, {useContext, useState, useEffect} from 'react';
import { AppContext } from "../shared/ContextProvider"
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
	StackItem
} from '@patternfly/react-core';
import {
	Select,
	SelectOption
} from '@patternfly/react-core/deprecated';
import { useParams } from "react-router-dom";
import AppDeployController from './AppDeployController';




export default function AppDeploy() {
    const [AppState] = useContext(AppContext);
    var { appParam } = useParams()
    const [appListSelectIsOpen, setAppListSelectIsOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(appParam);
    const [selectedAppObj, setSelectedAppObj] = useState({name:"", friendly_name: "", components: []});

    const [myReservationListSelectIsOpen, setMyReservationListSelectIsOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState("");

    const [radioUseExistingNamespace, setRadioUseExistingNamespace] = useState( AppState.myReservations().length > 0 );

    const FindSelectApp = () => {
        AppState.apps.forEach(element => {
            if ( element.name === selectedApp ) {
                setSelectedAppObj(element)
            } 
        });
    }

    useEffect(()=>{
        FindSelectApp()
    },[selectedApp, appParam])

    const AppComponentListLinksCard =  () => {
        return selectedAppObj.components.map((component, index) => {
            const link = `https://${component.host}.com/${component.repo}/tree/${component.ref}${component.path}`
            return <p key={`link-id-${component}-${index}`}>
                <a href={link} target="_blank" rel="noreferrer" style={{marginLeft: '1em'}}>{component.name}</a>
            </p>
        })
    
    }

    const NamespaceSelection = () => {
        const myReservationOptions = AppState.myReservations().map((reservation, index) => {
            
            return <SelectOption key={`${reservation.namespace}-${index}`} value={reservation.namespace}>
                {reservation.namespace}
            </SelectOption>   
        })

        if ( AppState.myReservations().length === 0 ) {
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
                isDisabled={AppState.myReservations().length === 0}
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
                    {myReservationOptions}
            </Select></React.Fragment>
        }
    }

    const AppDeployUI = () => {

        const appListOptions = AppState.apps.map((app, index) => {
            return <SelectOption key={`${app.name}-${index}`} value={app.name}>
                {app.friendly_name}
            </SelectOption>   
        })

   
        return <React.Fragment>
            <Grid hasGutter >
                <GridItem span={4} >
                    <Card className="pf-u-box-shadow-md" style={{minHeight: '100%'}}>
                        <CardTitle>
                            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                                Select App
                            </Title>
                        </CardTitle>
                        <CardBody >
                            <Stack hasGutter>
                                <StackItem>
                                    <Select
                                        isOpen={appListSelectIsOpen}
                                        onToggle={() => { setAppListSelectIsOpen(!appListSelectIsOpen) } } 
                                        onSelect={(event, selection) => { setSelectedApp(selection) ; setAppListSelectIsOpen(false) } }
                                        selections={selectedApp}>
                                            {appListOptions}
                                    </Select>
                                </StackItem>
                                <StackItem>
                                    <Title headingLevel="h4" size={TitleSizes['3x1']}>
                                        Dependencies
                                    </Title>
                                    { AppComponentListLinksCard() }
                                </StackItem>
                            </Stack>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem span={4}>
                    <Card style={{minHeight: '100%'}}>
                        <CardTitle>
                            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                                Select Ephemeral Environment
                            </Title>
                        </CardTitle>
                        <CardBody>
                            {NamespaceSelection()}  
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem span={4}>
                    <Card style={{minHeight: '100%'}}>
                        <CardTitle>
                            <Title headingLevel="h3" size={TitleSizes['3x1']}>
                                Deploy
                            </Title>
                        </CardTitle>
                        <CardBody>
                            <AppDeployController appname={selectedApp} reservation={selectedReservation} />
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>
            
        </React.Fragment>
    }

    let ui = {}

    if ( AppState.isAppsEmpty() ) {
        AppState.getApps()
        ui = <Loading message="Fetching app list..."/>
    } else {
        ui = <Page>
        <PageSection variant={PageSectionVariants.light}>
            <Split>
                <SplitItem>
                    <Title headingLevel="h1" size={TitleSizes['3xl']}>
                        Deploy App
                    </Title>
                </SplitItem>
                <SplitItem isFilled/>
            </Split>

        </PageSection>
        <PageSection>
        { AppDeployUI(AppState)}

        </PageSection>
            </Page> 

    }

    return ui
}