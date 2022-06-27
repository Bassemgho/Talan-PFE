/*eslint-disable*/
import ReactDOM from 'react-dom';
import Modal from '@sendbird/uikit-react/ui/Modal'
import { useState,useEffect,useCallback } from 'react'
import { Helmet } from 'react-helmet-async';
import { Box, styled, Divider } from '@mui/material';
import Scrollbar from 'src/components/Scrollbar';
import SendbirdApp from 'src/components/SendBird'

import TopBarContent from './TopBarContent';
import BottomBarContent from './BottomBarContent';
import SidebarContent from './SidebarContent';
import ChatContent from './ChatContent';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'src/store';

import {
  getChats
} from 'src/slices/messenger';

import "sendbird-uikit/dist/index.css";

const SBstyled = styled(SendbirdApp)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display:flex;
`


)
const RootWrapper = styled(Box)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display:flex;
`
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 300px;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`
);

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
);

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(2)};
`
);
const APP_ID = 'EFA04A76-651F-42F6-BDD9-E873BF60E605'

function ApplicationsMessenger() {

  const dispatch = useDispatch();
  const { chats } = useSelector(
    (state) => state.messenger
  );
  const {user} = useAuth();
  console.log(dispatch);
  useEffect(() => {
    try {

      dispatch(getChats());
    } catch (e) {
      console.log(e.message);
    }
  }, [dispatch]);
  const elements = document.getElementsByClassName("sendbird-modal")
  console.log('modal',Modal);
  // const list = ReactDOM.findDOMNode(Modal)
console.log(elements);

  return (
    <>
      <Helmet>
        <title>Messenger - Applications</title>
      </Helmet>
      <RootWrapper className="Mui-FixedWrapper">
{/*       <Sidebar>
          <Scrollbar>
            <SidebarContent />
          </Scrollbar>
        </Sidebar>*/}

        <SendbirdApp  />



{/*      <ChatWindow>
          <ChatTopBar>
            <TopBarContent />
          </ChatTopBar>
          <Box flex={1}>
            <Scrollbar>
              <ChatContent />
            </Scrollbar>
          </Box>
          <Divider />
          <BottomBarContent />
        </ChatWindow>*/}

      </RootWrapper>
    </>
  );
}

export default ApplicationsMessenger;
