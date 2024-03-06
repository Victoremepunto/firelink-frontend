import React from 'react';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Linkify from "react-linkify"
import Loading from '../shared/Loading';
import { 
    Button, 
    Page, 
    Split,  
    PageSection, 
    CodeBlock,
    CodeBlockCode, 
    Card, 
    PageSectionVariants, 
    InputGroup, 
    TextInput, 
    Title, 
    TitleSizes, 
    CardBody, 
    InputGroupItem, 
    SplitItem,
    EmptyState,
    EmptyStateVariant,
    EmptyStateHeader,
    EmptyStateBody,
    EmptyStateIcon
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import FadeInFadeOut from '../shared/FadeInFadeOut';

function ReservationList() {
    //Get namespace name from router params
    var { namespaceParam } = useParams()

    //Set up state
    var [description, setDescription] = useState("");
    var [parsedDescription, setParsedDescription] = useState([]);
    var [loading, setLoading] = useState(false);
    var [namespace, setNamespace] = useState("");
    var [namespaceInput, setNamespaceInput] = useState("");
    var [showResponseCard, setShowResponseCard] = useState(false);

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
    //Parse the description into lines whenever it is updated
    useEffect(()=>{
        setParsedDescription(description.split("\n"))
    }, [description]);

    const NoNamespaceLoaded = () => {
        return <EmptyState variant={EmptyStateVariant.lg}>
            <EmptyStateHeader titleText="No Namespace Loaded" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
            <EmptyStateBody>
                No namespace selected. Enter a namespace name in the input box above to get started.
            </EmptyStateBody>
        </EmptyState>
    }

    const descriptionJSX = () => { 
        if ( !showResponseCard) {
            return <NoNamespaceLoaded/>
        }
        return <React.Fragment>
            <Card>
                <CardBody>
                    <CodeBlock>
                        <CodeBlockCode id="code-content">
                            {parsedDescription.map((line, i) => (
                                <p key={line + i.toString()}>
                                    <Linkify properties={{target: '_blank'}} >{line}</Linkify>
                                </p>
                            ))}
                        </CodeBlockCode>
                    </CodeBlock>
                </CardBody>
            </Card>
        </React.Fragment>;
    }

    const outputJSX = loading ? <Loading message="Fetching namespace description..."/> : descriptionJSX();
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
            <PageSection  isCenterAligned={true}>
                <FadeInFadeOut>
                    { outputJSX }
                </FadeInFadeOut>
            </PageSection>
        </Page>
    </React.Fragment>
};

export default ReservationList;