import React, { useEffect } from "react";
import {
  Page,
  Nav,
  ToolbarGroup,
  NavItem,
  NavList,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  PageSidebar,
  Toolbar,
  ToolbarContent,
  NavExpandable,
  PageSidebarBody,
  ToolbarItem,
  Dropdown,
  MenuToggle,
  DropdownList,
  DropdownItem,
  Divider,
  Switch,
  Avatar,
  Button,
  MastheadToggle
} from "@patternfly/react-core";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getRequester,
  loadRequester,
  getDarkMode,
  setDarkMode,
} from "./store/AppSlice";
import { setAppDeployRequester } from "./store/AppDeploySlice";
import { ReactSVG } from "react-svg";
import { loadNamespaceResources, loadNamespaces } from "./store/ListSlice";
import { BarsIcon } from "@patternfly/react-icons";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const requester = useSelector(getRequester);

  const darkMode = useSelector(getDarkMode);

  const [isOpen, setIsOpen] = React.useState(false);

  const [sidebarOpen, setSidebarOpen] = React.useState(true);


  const onSelect = () => {
    setIsOpen(!isOpen);
  };
  const onToggleClick = (isOpen) => {
    setIsOpen(isOpen);
  };

  useEffect(() => {
    dispatch(loadRequester());
    dispatch(loadNamespaceResources());
    dispatch(loadNamespaces());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once when the component mounts

  useEffect(() => {
    dispatch(setAppDeployRequester(requester));
  }, [requester]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("pf-v5-theme-dark");
    } else {
      document.documentElement.classList.remove("pf-v5-theme-dark");
    }
  }, [darkMode]);



  const deleteCookie = () => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    window.location.reload("/");
  };

  const setDarkModeToggle = () => {
    dispatch(setDarkMode(!darkMode));
  };

  const goToRecipes = () => {
    navigate("/recipes");
  };

  const headerDropDown = (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          onClick={onToggleClick}
          isFullHeight="true"
          isFullWidth="true"
          isExpanded={isOpen}
        >
          <Avatar src="/user.svg" />
        </MenuToggle>
      )}
      ouiaId="BasicDropdown"
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        <DropdownItem value={0} key="action" isDisabled={true}>
          {requester}
        </DropdownItem>
        <Divider component="li" key="separator-a" />
        <DropdownItem value={1} key="separated action a">
          <Switch
            id="simple-switch"
            label="Dark"
            labelOff="Light"
            isChecked={darkMode}
            onChange={setDarkModeToggle}
            ouiaId="BasicSwitch"
          />
        </DropdownItem>
        <Divider component="li" key="separator-b" />
        <DropdownItem value={5} key="separated action b" onClick={goToRecipes}>
          Recipies
        </DropdownItem>
        <Divider component="li" key="separator-b" />
        <DropdownItem value={5} key="separated action b" onClick={deleteCookie}>
          Log out
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );

  const handleReportIssueButton = () => {
    window.open("https://issues.redhat.com/secure/CreateIssueDetails!init.jspa?pid=12325059&issuetype=17&labels=platform-devprod&customfield_12311140=RHCLOUD-31468", "_blank");
  };

  const handleDocsButton = () => {
    window.open("https://inscope.corp.redhat.com/docs/default/component/firelink-app", "_blank");
  }

  const headerToolbar = (
    <Toolbar id="vertical-toolbar" isFullHeight="true">
      <ToolbarContent>
        <ToolbarGroup align={{ default: "alignRight" }}>
        <ToolbarItem>
            <Button variant="plain" onClick={handleDocsButton}>
              Documentation
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="plain" onClick={handleReportIssueButton}>
              Feedback
            </Button>
          </ToolbarItem>
          <ToolbarItem>{headerDropDown}</ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const header = (
    <Masthead>
      <MastheadToggle>
        <Button variant="plain" onClick={() => {setSidebarOpen(!sidebarOpen)}} aria-label="Global navigation">
          <BarsIcon />
        </Button>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand
          component="a"
          onClick={() => {
            navigate("/");
          }}
        >
          <ReactSVG src="/firelink-logo.svg" style={{ width: "8rem" }} />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>{headerToolbar}</MastheadContent>
    </Masthead>
  );

  const navBar = (
    <Nav aria-label="Default global nav">
      <NavList> 
        <NavExpandable
          title="Namespaces"
          id="namespaces-nav-list"
          isExpanded={true}
        >
          <NavItem
            id="namespace-list"
            onClick={() => navigate("/namespace/list")}
            itemId={0}
            isActive={useMatch("/namespace/list")}
          >
            List
          </NavItem>
          <NavItem
            id="namespace-describe"
            onClick={() => navigate("/namespace/describe")}
            itemId={1}
            isActive={useMatch("/namespace/describe/:namespace")}
          >
            Describe
          </NavItem>
          <NavItem
            id="namespace-reserve"
            onClick={() => navigate("/namespace/reserve")}
            itemId={2}
            isActive={useMatch("/namespace/reserve")}
          >
            Reserve
          </NavItem>
        </NavExpandable>
        <NavExpandable title="Apps" id="apps-nav-list" isExpanded={true}>
          <NavItem
            id="apps-list"
            onClick={() => navigate("/apps/list")}
            itemId={0}
            isActive={useMatch("/apps/list")}
          >
            List
          </NavItem>
          <NavItem
            id="apps-deploy"
            onClick={() => navigate("/apps/deploy")}
            itemId={0}
            isActive={useMatch("/apps/deploy/:app")}
          >
            Deploy
          </NavItem>
        </NavExpandable>
        <NavItem
          id="cluster-info"
          onClick={() => navigate("/cluster")}
          itemId={0}
          isActive={useMatch("/cluster")}
        >
          Cluster
        </NavItem>
      </NavList>
    </Nav>
  );

  const sidebar = (
    <PageSidebar isSidebarOpen={sidebarOpen} id="vertical-sidebar">
      <PageSidebarBody>{navBar}</PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page header={header} sidebar={sidebar}>
      <Outlet />
    </Page>
  );
}

export default App;
