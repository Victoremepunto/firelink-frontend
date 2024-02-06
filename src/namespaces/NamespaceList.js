import React from 'react';
import {useContext, useState, useEffect} from 'react';
import {SplitItem, Title, TitleSizes} from '@patternfly/react-core';
import Loading from '../shared/Loading';
import { AppContext } from "../shared/ContextProvider"
import NamespaceListTable from './NamespaceListTable';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Split,
  Switch
} from '@patternfly/react-core';

function ReservationList() {

  //Get the global state
  const [AppState] = useContext(AppContext);
  const [showJustMyReservations, setShowJustMyReservations] = useState(false);



  useEffect(() => {
    // Your function logic here
    if ( AppState.isNamespacesEmpty() ) {
      AppState.getNamespaces()
    }
  }, []);

   let outputJSX = {}

   if ( AppState.isNamespacesEmpty() ) {
    outputJSX = <Loading message="Fetching namespaces and reservations..."/>
    if (showJustMyReservations) {
      setShowJustMyReservations(false)
    }
   } else {
    outputJSX = <div>

      <NamespaceListTable namespaces={AppState.namespaces} showJustMyReservations={showJustMyReservations}/>
    </div>
   }
  
  return <React.Fragment>
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Split hasGutter>
          <SplitItem>
            <Title headingLevel="h1" size={TitleSizes['3xl']}>
              Namespaces
            </Title>
          </SplitItem >
          <SplitItem isFilled></SplitItem>        
          <SplitItem>
            <Switch id="namespace-list-my-reservations"
              label="My Reservations"
              labelOff="My Reservations"
              isChecked={showJustMyReservations}
              isReversed
              onChange={() => { setShowJustMyReservations(!showJustMyReservations) }}/>
          </SplitItem> 
          <SplitItem>
            <Button variant="primary" onClick={() => { 
              AppState.update({namespaces: []}); 
              AppState.getNamespaces() }} >
              Refresh
            </Button>
          </SplitItem>
        </Split>

      </PageSection>
      <PageSection >

        {outputJSX}
      </PageSection>
    </Page>
  </React.Fragment>
};

export default ReservationList;