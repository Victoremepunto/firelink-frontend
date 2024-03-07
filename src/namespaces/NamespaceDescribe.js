import React from 'react';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Button, 
    Page, 
    Split,  
    PageSection, 
    PageSectionVariants, 
    InputGroup, 
    TextInput, 
    Title, 
    TitleSizes, 
    InputGroupItem, 
    SplitItem,
    EmptyState,
    EmptyStateVariant,
    EmptyStateHeader,
    EmptyStateBody,
    EmptyStateIcon,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import FadeInFadeOut from '../shared/FadeInFadeOut';
import { 
    loadNamespaceTopPods,
    getNamespaceTopPods,
    getResourcesForNamespace

} from '../store/ListSlice';
import { useDispatch, useSelector } from 'react-redux';
import NamespaceDescriptionCard from './NamespaceDescribeCard';
import PodsTableCard from './TopPodsCard';
import NamespaceResourcesCard from './NamespaceResourcesCard';

function ReservationList() {
    const dispatch = useDispatch();

    //Get namespace name from router params
    var { namespaceParam } = useParams()

    const topPods = useSelector(getNamespaceTopPods);

    

    //Set up state
    const [description, setDescription] = useState({});
    const [loading, setLoading] = useState(false);
    const [namespace, setNamespace] = useState("");
    const [namespaceInput, setNamespaceInput] = useState("");
    const [showResponseCard, setShowResponseCard] = useState(false);
    const [resources, setResources] = useState([]);
    const resourcesFromStore = useSelector(getResourcesForNamespace(namespace));
    
    useEffect(() => {
        if (namespaceParam === undefined || namespaceParam === "") {
            return
        }
        setNamespace(namespaceParam);
        setNamespaceInput(namespaceParam);
    }, [namespaceParam]);

    useEffect(() => {
        if ( namespace === "" ) {
            return
        }
        getNamespaceDescription(namespace);
        dispatch(loadNamespaceTopPods(namespace));
        setResources(resourcesFromStore);
    }, [namespace]);


    //Method to get namespace description from server
    function getNamespaceDescription(ns) {
        setLoading(true);
        const url = ['/api/firelink/namespace/describe/',ns].join('');
        fetch(url)
            .then(response => response.json())
            .then(jsonResp => {
                setShowResponseCard(true);
                setDescription(jsonResp.message)
                setLoading(false);
            });
    }

    const navigate = useNavigate()
    function buttonClickHandler() {
        navigate("/namespace/describe/" + namespaceInput)
    }

    const NoNamespaceLoaded = () => {
        return <EmptyState variant={EmptyStateVariant.lg}>
            <EmptyStateHeader titleText="No Namespace Specified" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
            <EmptyStateBody>
                Enter a namespace name in the input box above to get started.
            </EmptyStateBody>
        </EmptyState>
    }


    //const outputJSX = loading ? <Loading message="Fetching namespace description..."/> : descriptionJSX();
    //Render
    return <React.Fragment>
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <Split>
                    <SplitItem>
                        <Title headingLevel="h1" size={TitleSizes['3xl']}>
                            Describe Namespace
                        </Title>
                    </SplitItem>
                    <SplitItem isFilled/>
                    <SplitItem>
                        <InputGroup>
                            <InputGroupItem isFill ><TextInput id="text-input" value={namespaceInput} onChange={e => setNamespaceInput(e)} default="test"></TextInput></InputGroupItem>
                            <InputGroupItem><Button onClick={() => { buttonClickHandler() }}>
                                Describe
                            </Button></InputGroupItem>
                        </InputGroup>
                    </SplitItem>
                </Split>
            </PageSection>

            { namespace === "" ? <PageSection  isCenterAligned={true}><NoNamespaceLoaded /> </PageSection>: <PageSection  isCenterAligned={true}>
                <Stack hasGutter>
                    <StackItem>
                            <NamespaceResourcesCard namespace={namespace} />
                    </StackItem>
                    <StackItem>
                        <Split hasGutter>
                            <SplitItem>
                                <NamespaceDescriptionCard description={description} />
                            </SplitItem>
                            <SplitItem>
                                <PodsTableCard podsData={topPods} />
                            </SplitItem>
                        </Split>
                    </StackItem>
                    </Stack>
            </PageSection>
            }
        </Page>
    </React.Fragment>
};

export default ReservationList;