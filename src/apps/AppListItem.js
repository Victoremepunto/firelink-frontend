import React from "react";
import {useState} from "react";
import { Card, CardTitle, CardBody, CardFooter, Button, GalleryItem, Split, SplitItem, Accordion, TitleSizes, Title, AccordionItem, AccordionContent, AccordionToggle  } from '@patternfly/react-core';
import { useNavigate } from "react-router-dom";

function AppComponentListLinks(components) {
    return components.map((component, index) => {
        const link = `https://${component.host}.com/${component.repo}/tree/${component.ref}${component.path}`
        return <li key={`link-id-${component}-${index}`}>
            <a href={link} target="_blank" rel="noreferrer">{component.name}</a>
        </li>
    })

}

export default function AppListItem({app})  {
    const [expanded, setExpanded] = useState(false);
    const compos = AppComponentListLinks(app.components)
    const key = `def-list-toggle-${app.name}`;
    const navigate = useNavigate();
    const [mouseHovering, setMouseHovering] = useState(false);

    const AppCardFooter = ({mouseHovering}) => {
            return <Split>
                <SplitItem isFilled></SplitItem>
                <SplitItem>
                    <Button variant='primary' onClick={() => navigate(`/apps/deploy/${app.name}`)} isDisabled={!mouseHovering}>Deploy</Button>
                </SplitItem>
            </Split>
    }


    return <GalleryItem onMouseOver={() => {setMouseHovering(true)}} onMouseLeave={() => {setMouseHovering(false)}} key={key}><Card className="pf-u-box-shadow-lg">
    <CardTitle>
        <Split>
            <SplitItem isFilled></SplitItem>
            <SplitItem>
                <Title headingLevel="h3" size={TitleSizes['3x1']}>
                    {app.friendly_name}
                </Title>
            </SplitItem>
            <SplitItem isFilled></SplitItem>
        </Split>
    </CardTitle>
    <CardBody>
        <Accordion >
            <AccordionItem>
                <AccordionToggle
                    onClick={() => { setExpanded(!expanded); }}
                    isExpanded={expanded}>
                        Dependencies
                </AccordionToggle>
                <AccordionContent isHidden={!expanded}>
                    <ul>{compos}</ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </CardBody>
    <CardFooter>
        <Split>
            <SplitItem isFilled></SplitItem>
            <SplitItem>
                <Button variant='primary' onClick={() => navigate(`/apps/deploy/${app.name}`)} isDisabled={!mouseHovering}>Deploy</Button>
            </SplitItem>
        </Split>
    </CardFooter>
  </Card>
  </GalleryItem>
}