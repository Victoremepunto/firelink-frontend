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
  TitleSizes,
  Title,
  StackItem,
  Stack,
  Tooltip,
} from "@patternfly/react-core";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@patternfly/react-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getIsAppFavorite,
  setFavoriteApp,
  removeFavoriteApp,
} from "../store/AppSlice";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

function AppComponentListLinks(components) {
  return components.map((component, index) => {
    const link = `https://${component.host}.com/${component.repo}/tree/${component.ref}${component.path}`;
    return (
      <li key={`link-id-${component}-${index}`}>
        <a href={link} target="_blank" rel="noreferrer">
        <ExternalLinkAltIcon /> {component.name}
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

    const developerPortalLink = () => {
        window.open(`https://inscope.corp.redhat.com/catalog/default/component/${app.name}-app/`, "_blank");
    }

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

  function stringToGradient(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = hash % 360;
    const hue2 = (hash * 2) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 100%, 85%), hsl(${hue2}, 100%, 85%))`;
  }
  

  const background =    stringToGradient(app.friendly_name);


  const appIconName = () => {
    // If the name has multiple words return the first letter of every word, max of 3 letters returned
    if (app.friendly_name.split(" ").length > 1) {
      return app.friendly_name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 3);
    }

    // If the name has only one word return the first 3 letters of the name
    return app.friendly_name.substring(0, 3);
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
      <Card isLarge={true} isRounded={true} className="pf-u-box-shadow-lg" >
        <CardTitle>
          <Split>
              <SplitItem isFilled></SplitItem>
              <SplitItem>
                  <div style={{background: background, width: "2.5em", height: "2.5em", borderRadius: "10%", marginRight: "1em", color: "black", padding: "0.1em"}}>
                      <Title headingLevel="h3" size={TitleSizes["3x1"]} >
                          {appIconName() }
                      </Title>
                  </div>
              </SplitItem>
              <SplitItem isFilled>  </SplitItem>
            </Split>
        </CardTitle>
        <CardTitle>
          <Split>
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
          <Stack>
            <StackItem>
              <Button variant="link" onClick={developerPortalLink}>
                <ExternalLinkAltIcon /> Developer Portal
              </Button>
            </StackItem>
            <StackItem>
              <Tooltip content={<ul>{compos}</ul>} position="right">
                <Button variant="link" >Resource Templates</Button>
              </Tooltip>
            </StackItem>
          </Stack>
        </CardBody>
        <CardFooter>
          <Split>
            <SplitItem isFilled></SplitItem>
            <SplitItem>
              <Button
                variant="secondary"
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
