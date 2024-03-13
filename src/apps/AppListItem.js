import React from "react";
import { useState } from "react";
import {
  Truncate,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Button,
  GalleryItem,
  Split,
  SplitItem,
  Accordion,
  TitleSizes,
  Title,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
} from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@patternfly/react-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getIsAppFavorite,
  setFavoriteApp,
  removeFavoriteApp,
} from "../store/AppSlice";

function AppComponentListLinks(components) {
  return components.map((component, index) => {
    const link = `https://${component.host}.com/${component.repo}/tree/${component.ref}${component.path}`;
    return (
      <li key={`link-id-${component}-${index}`}>
        <a href={link} target="_blank" rel="noreferrer">
          {component.name}
        </a>
      </li>
    );
  });
}

export default function AppListItem({ app, showFavorites }) {
  const [expanded, setExpanded] = useState(false);
  const compos = AppComponentListLinks(app.components);
  const key = `def-list-toggle-${app.name}`;
  const navigate = useNavigate();
  const [mouseHovering, setMouseHovering] = useState(false);

  const isFavorite = useSelector(getIsAppFavorite(app.name));

  const dispatch = useDispatch();

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteApp(app.name));
    } else {
      dispatch(setFavoriteApp(app.name));
    }
  };

  if (showFavorites) {
    if (!isFavorite) {
      return null;
    }
  }

  return (
    <GalleryItem
      onMouseOver={() => {
        setMouseHovering(true);
      }}
      onMouseLeave={() => {
        setMouseHovering(false);
      }}
      key={key}
    >
      <Card isLarge={true} isRounded={true} className="pf-u-box-shadow-lg">
        <CardTitle>
          <Split>
            <SplitItem isFilled></SplitItem>
            <SplitItem>
              <Title headingLevel="h3" size={TitleSizes["3x1"]}>
                <Truncate content={app.friendly_name}></Truncate>
              </Title>
            </SplitItem>
            <SplitItem isFilled></SplitItem>
            <SplitItem>
              <StarIcon
                onClick={toggleFavorite}
                style={{
                  cursor: "pointer",
                  color: isFavorite ? "gold" : "lightgray",
                }}
              ></StarIcon>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <Accordion>
            <AccordionItem>
              <AccordionToggle
                onClick={() => {
                  setExpanded(!expanded);
                }}
                isExpanded={expanded}
              >
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
              <Button
                variant="primary"
                onClick={() => navigate(`/apps/deploy/${app.name}`)}
                isDisabled={!mouseHovering}
              >
                Deploy
              </Button>
            </SplitItem>
          </Split>
        </CardFooter>
      </Card>
    </GalleryItem>
  );
}
