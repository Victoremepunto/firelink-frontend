import React from 'react';
import {useState, useEffect} from 'react';
import {SplitItem, Title, TitleSizes} from '@patternfly/react-core';
import Loading from '../shared/Loading';
import NamespaceListTable from './NamespaceListTable';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Split,
  Switch
} from '@patternfly/react-core';
import { useSelector, useDispatch } from 'react-redux';
import {
  getIsNamespacesEmpty,
  loadNamespaces,
  clearNamespaces,
  getMyReservations,
  getNamespaces
} from '../store/ListSlice';
import { getRequester } from '../store/AppSlice'
import FadeInFadeOut from '../shared/FadeInFadeOut';

function ReservationList() {

  const [showJustMyReservations, setShowJustMyReservations] = useState(false);

  const dispatch = useDispatch();
  const requester = useSelector(getRequester);
  const myNamespaces = useSelector(getMyReservations(requester));
  const isNamespacesEmpty = useSelector(getIsNamespacesEmpty);
  const namespaces = useSelector(getNamespaces);


  // Run on first load
  useEffect(() => {
    // Your function logic here
    if ( isNamespacesEmpty ) {
      dispatch(loadNamespaces());
    }
  }, []);

   let outputJSX = {}

   if ( isNamespacesEmpty ) {
    outputJSX = <Loading message="Fetching namespaces and reservations..."/>
    if (showJustMyReservations) {
      setShowJustMyReservations(false)
    }
   } else {
    outputJSX = <div>

      <NamespaceListTable namespaces={namespaces} showJustMyReservations={showJustMyReservations}/>
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
              dispatch(clearNamespaces())
              dispatch(loadNamespaces())
              }} >
              Refresh
            </Button>
          </SplitItem>
        </Split>

      </PageSection>
      <PageSection >
        <FadeInFadeOut>
          {outputJSX}
        </FadeInFadeOut>
      </PageSection>
    </Page>
  </React.Fragment>
};

export default ReservationList;