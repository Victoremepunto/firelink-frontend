import React, { useState, useEffect } from "react";
import {
  Switch,
  Title,
  TitleSizes,
  TextInput,
  Page,
  PageSection,
  PageSectionVariants,
  Gallery,
  Split,
  SplitItem,
  Button,
} from "@patternfly/react-core";
import Loading from "../shared/Loading";
import AppListItem from "./AppListItem";
import FadeInFadeOut from "../shared/FadeInFadeOut";
import ErrorCard from "../shared/ErrorCard";
import { useSelector, useDispatch } from "react-redux";
import { loadApps, getApps, getLoading, getError } from "../store/ListSlice";

function AppList() {
  const dispatch = useDispatch();
  const apps = useSelector(getApps);
  const loading = useSelector(getLoading);
  const error = useSelector(getError);

  const [filteredApps, setFilteredApps] = useState(apps);
  const [filter, setFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (apps.length === 0) {
      dispatch(loadApps());
    }
  }, [dispatch]);

  useEffect(() => {
    setFilteredApps(
      filter === "" ? apps : apps.filter((app) => app.name.includes(filter))
    );
  }, [apps, filter]);

  const handleRefresh = () => {
    dispatch(loadApps());
  };

  if (loading) {
    return (
      <Page>
        <PageSection>
          <Loading message="Fetching app list..." />
        </PageSection>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <PageSection>
          <ErrorCard error={error} onRetry={handleRefresh} />
        </PageSection>
      </Page>
    );
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Split hasGutter>
          <SplitItem>
            <Title headingLevel="h1" size={TitleSizes["3xl"]}>
              Apps
            </Title>
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Switch
              isReversed="true"
              id="app-list-favorites"
              label="Show Favorites"
              labelOff="Show Favorites"
              isChecked={showFavorites}
              onChange={() => setShowFavorites(!showFavorites)}
            />
          </SplitItem>
          <SplitItem>
            <TextInput
              value={filter}
              type="text"
              placeholder="Filter apps"
              onChange={(event) => setFilter(event.target.value)}
              aria-label="text input app list filter"
            />
          </SplitItem>
          <SplitItem>
            <Button variant="primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection hasOverflowScroll={true}>
        <FadeInFadeOut>
          <Gallery hasGutter>
            {filteredApps.map((app, index) => (
              <AppListItem
                app={app}
                key={`app-list-item-${app.name}-${index}`}
                showFavorites={showFavorites}
              />
            ))}
          </Gallery>
        </FadeInFadeOut>
      </PageSection>
    </Page>
  );
}

export default AppList;
