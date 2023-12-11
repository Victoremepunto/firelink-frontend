import React from 'react';
import ReactDOM from 'react-dom';
import '@patternfly/react-core/dist/styles/base.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NamespaceList from './namespaces/NamespaceList';
import NamespaceDescribe from './namespaces/NamespaceDescribe';
import NamespaceReserve from './namespaces/NamespaceReserve';
import AppList from './apps/AppList'; 
import ContextProvider from './shared/ContextProvider';
import Settings from './Settings';
import AppDeploy from './apps/AppDeploy';
import Root from './Root';

const root = document.getElementById('root');
ReactDOM.render(
  <ContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" key="root-page" element={<Root />}/>

          <Route key="namespace-list" path="/api/firelink/namespace/list" element={<NamespaceList />} />
          <Route key="namespace-describe" path="/api/firelink/namespace/describe/:namespaceParam" element={<NamespaceDescribe />} />
          <Route key="namespace-describe" path="/api/firelink/namespace/describe" element={<NamespaceDescribe />} />
          <Route key="namespace-reserve" path="/api/firelink/namespace/reserve" element={<NamespaceReserve />} />
          <Route key="settings" path="/settings" element={<Settings />} />

          <Route key="app-list" path="/api/firelink/apps/list" element={<AppList />} />
          <Route key="app-deploy" path="/api/firelink/apps/deploy/:appParam" element={<AppDeploy />} />
          <Route key="app-deploy" path="/api/firelink/apps/deploy" element={<AppDeploy />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </ContextProvider>
  ,root
);

