import React from 'react';
import {Page, Nav, ToolbarGroup,  NavItem, NavList, Masthead, MastheadMain, MastheadBrand, MastheadContent, PageSidebar, PageSection, PageSectionVariants, Toolbar, ToolbarContent, ToolbarItem, NavExpandable} from '@patternfly/react-core';
//import ReservationList from './ReservationList';
import { Outlet, useMatch, useNavigate } from "react-router-dom";

function App() {
  
  const navigate = useNavigate();

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
      <NavItem id="settings" onClick={() => navigate("/settings")} itemId={0} isActive={useMatch("/settings")}>
        Settings
      </NavItem>
    </NavList>
  </Nav>; 

const sidebar = <PageSidebar nav={navBar} isNavOpen={true} id="vertical-sidebar">
</PageSidebar>;

  return <Page header={header} sidebar={sidebar}>
        <Outlet/>
    </Page>;
};

export default App;