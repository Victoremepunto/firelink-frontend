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
import Store from './store/Store'
import { Provider } from 'react-redux'


const root = document.getElementById('root');
ReactDOM.render(
  <Provider store={Store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" key="root-page" element={<Root />}/>

          <Route key="namespace-list" path="/namespace/list" element={<NamespaceList />} />
          <Route key="namespace-describe" path="/namespace/describe/:namespaceParam" element={<NamespaceDescribe />} />
          <Route key="namespace-describe" path="/namespace/describe" element={<NamespaceDescribe />} />
          <Route key="namespace-reserve" path="/namespace/reserve" element={<NamespaceReserve />} />
          <Route key="settings" path="/settings" element={<Settings />} />

          <Route key="app-list" path="/apps/list" element={<AppList />} />
          <Route key="app-deploy" path="/apps/deploy/:appParam" element={<AppDeploy />} />
          <Route key="app-deploy" path="/apps/deploy" element={<AppDeploy />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
  ,root
);

