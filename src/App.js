import React, { useEffect } from 'react';
import {Page, Nav, ToolbarGroup,  NavItem, NavList, Masthead, MastheadMain, MastheadBrand, MastheadContent, PageSidebar, Toolbar, ToolbarContent, NavExpandable, PageSidebarBody} from '@patternfly/react-core';
//import ReservationList from './ReservationList';
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { 
  loadRequester,
} from './store/AppSlice';


function App() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadRequester());
  }, []); // Run once when the component mounts


  const headerToolbar = <Toolbar id="vertical-toolbar">
      <ToolbarContent>
        <ToolbarGroup align={{default: 'alignRight'}}>
       </ToolbarGroup>
      </ToolbarContent>
</Toolbar>;

  const header = <Masthead>
    <MastheadMain>
      <MastheadBrand component="a" onClick={() => { navigate("/") }}>
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

const sidebar = <PageSidebar isSidebarOpen={true} id="vertical-sidebar" >
<PageSidebarBody>
{navBar}
</PageSidebarBody>
</PageSidebar>

  return <Page header={header} sidebar={sidebar}>
        <Outlet/>
    </Page>;
};

export default App;