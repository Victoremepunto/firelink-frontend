import React, { useEffect, useContext } from 'react';
import {Page, Nav, ToolbarGroup,  NavItem, NavList, Masthead, MastheadMain, MastheadBrand, MastheadContent, PageSidebar, PageSection, PageSectionVariants, Toolbar, ToolbarContent, ToolbarItem, NavExpandable} from '@patternfly/react-core';
//import ReservationList from './ReservationList';
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { AppContext } from "./shared/ContextProvider";



function App() {
  
  const navigate = useNavigate();

  const [AppState] = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/index.html');
        if (response.ok) {
          // Access the header value using get() method
          const username = response.headers.get('gap-auth').split('@')[0];
          AppState.update({requester: username})
        } else {
          console.error('Getting Username: Failed to fetch data:', response.status, response.statusText);
        }

      } catch (error) {
        console.error('Getting Username: Error during fetch:', error);
      }

    };

    fetchData();
  }, []); // Run once when the component mounts


  const headerToolbar = <Toolbar id="vertical-toolbar">
      <ToolbarContent>
        <ToolbarGroup alignment={{default: 'alignRight'}}>
       </ToolbarGroup>
      </ToolbarContent>
</Toolbar>;

  const header = <Masthead>
    <MastheadMain>
      <MastheadBrand onClick={() => { navigate("/") }}>
        <img src="/logo-rh.png" alt="Firelink Logo" />
      </MastheadBrand>
    </MastheadMain>
    <MastheadContent>{headerToolbar}</MastheadContent>
  </Masthead>;

  const navBar = <Nav aria-label="Default global nav"  >
    <NavList>
      <NavExpandable title="Namespaces" id="namespaces-nav-list" isExpanded={true}>
        <NavItem id="namespace-list" onClick={() => navigate("/namespace/list")} itemId={0} isActive={useMatch("/namespace/list")}>
          List
        </NavItem>
        <NavItem id="namespace-describe" onClick={() => navigate("/namespace/describe")} itemId={1} isActive={useMatch("/namespace/describe/:namespace")}>
          Describe
        </NavItem>
        <NavItem id="namespace-reserve" onClick={() => navigate("/namespace/reserve")} itemId={2} isActive={useMatch("/namespace/reserve")}>
          Reserve
        </NavItem>     
      </NavExpandable>
      <NavExpandable title="Apps" id="apps-nav-list" isExpanded={true}>
        <NavItem id="apps-list" onClick={() => navigate("/apps/list")} itemId={0} isActive={useMatch("/apps/list")}>
          List
        </NavItem>
        <NavItem id="apps-deploy" onClick={() => navigate("/apps/deploy")} itemId={0} isActive={useMatch("/apps/deploy/:app")}>
          Deploy
        </NavItem>
      </NavExpandable>
    </NavList>
  </Nav>; 

const sidebar = <PageSidebar nav={navBar} isNavOpen={true} id="vertical-sidebar">
</PageSidebar>;

  return <Page header={header} sidebar={sidebar}>
        <Outlet/>
    </Page>;
};

export default App;