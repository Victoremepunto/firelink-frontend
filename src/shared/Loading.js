import React from 'react';
import { Spinner,Bullseye, Card, CardBody, TextContent, CardTitle, CardFooter } from '@patternfly/react-core';
import SlideInSlideOut from './SlideInSlideOut';

function Loading(message="") {
    return <Bullseye style={{height: "12em"}}>
        <SlideInSlideOut>
            <Card>
                <CardTitle>                        
                        Loading...            
                </CardTitle>
                <CardBody>
                    <Bullseye>
                        <Spinner  aria-label="Loading" />
                        <TextContent>

                        </TextContent>    
                    </Bullseye>          
                </CardBody>
                <CardFooter>
                    {message.message}
                </CardFooter>
            </Card>
        </SlideInSlideOut>
    </Bullseye>
}

export default Loading;