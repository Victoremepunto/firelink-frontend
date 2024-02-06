import React from 'react';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Linkify from "react-linkify"
import Loading from '../shared/Loading';
import { Button, Page, PageSection, CodeBlock,Stack, StackItem , CodeBlockCode, Card, PageSectionVariants, InputGroup, TextInput, Title, TitleSizes, CardBody, InputGroupItem } from '@patternfly/react-core';

function ReservationList() {
    //Get namespace name from router params
    var { namespaceParam } = useParams()

    //Set up state
    var [description, setDescription] = useState("");
    var [parsedDescription, setParsedDescription] = useState([]);
    var [loading, setLoading] = useState(false);
    var [namespace, setNamespace] = useState("");
    var [namespaceInput, setNamespaceInput] = useState("");

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

    const descriptionJSX = <React.Fragment>
        <PageSection >
            <Card>
                <CardBody>
                    <Stack hasGutter>
                        <StackItem>
                            <InputGroup>
                                <InputGroupItem isFill ><TextInput id="text-input" value={namespaceInput} onChange={e => setNamespaceInput(e)} default="test"></TextInput></InputGroupItem>
                                <InputGroupItem><Button onClick={() => { buttonClickHandler() }}>
                                    Describe
                                </Button></InputGroupItem>
                            </InputGroup>
                        </StackItem>
                        <StackItem>
                            <CodeBlock>
                                <CodeBlockCode id="code-content">
                                    {parsedDescription.map((line, i) => (
                                        <p key={line + i.toString()}>
                                            <Linkify properties={{target: '_blank'}} >{line}</Linkify>
                                        </p>
                                    ))}
                                </CodeBlockCode>
                            </CodeBlock>
                        </StackItem>
                    </Stack>
                </CardBody>
            </Card>
        </PageSection>
    </React.Fragment>;

    const outputJSX = loading ? <Loading message="Fetching namespace description..."/> : descriptionJSX;
    //Render
    return <React.Fragment>
        <Page>
            <PageSection variant={PageSectionVariants.light}>
                <Title headingLevel="h1" size={TitleSizes['3xl']}>
                    Describe Namespace
                </Title>
            </PageSection>
            { outputJSX}
        </Page>
    </React.Fragment>
};

export default ReservationList;