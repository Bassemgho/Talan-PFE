/*eslint-disable*/
import React, { useState, useCallback } from "react";
import {
  Box,
  styled,
  useTheme
} from '@mui/material';

import  {Channel as SBConversation,ChannelList as SBChannelList , ChannelSettings as SBChannelSettings } from '@sendbird/uikit-react';
// import SBChannelList from '@sendbird/uikit-react';
// import SBChannelSettings from '@sendbird/uikit-react/ChannelSettings'
import withSendBird from '@sendbird/uikit-react/withSendBird';


function CustomizedApp(props) {
  // default props
  const {
    stores: { sdkStore, userStore },
    config: {
      isOnline,
      userId,
      appId,
      accessToken,
      theme,
      userListQuery,
      logger,
      pubSub
    }
  } = props;
  const logDefaultProps = useCallback(() => {
    console.log(
      "SDK store list log",
      sdkStore.initialized,
      sdkStore.sdk,
      sdkStore.loading,
      sdkStore.error
    );
    console.log(
      "User store list log",
      userStore.initialized,
      userStore.user,
      userStore.loading
    );
    console.log(
      "Config list log",
      isOnline,
      userId,
      appId,
      accessToken,
      theme,
      userListQuery,
      logger,
      pubSub
    );
  }, [
    sdkStore.initialized,
    sdkStore.sdk,
    sdkStore.loading,
    sdkStore.error,
    userStore.initialized,
    userStore.user,
    userStore.loading,
    isOnline,
    userId,
    appId,
    accessToken,
    theme,
    userListQuery,
    logger,
    pubSub
  ]);
  logDefaultProps();

  // useState
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannelUrl, setCurrentChannelUrl] = useState("");

  return (

    <Box className="customized-app">
      <Box className="sendbird-app__wrap">
        <Box className="sendbird-app__channellist-wrap">
          <SBChannelList
            onClick={()=>{console.log(this.children);}}
            onChannelSelect={(channel) => {
              if (channel && channel.url) {
                setCurrentChannelUrl(channel.url);
              }
            }}
          />
        </Box>
        <Box className="sendbird-app__conversation-wrap">
          <SBConversation
            channelUrl={currentChannelUrl}
            onChatHeaderActionClick={() => {
              setShowSettings(true);
            }}
          />
        </Box>
      </Box>
      {showSettings && (
        <Box className="sendbird-app__settingspanel-wrap">
          <SBChannelSettings
            channelUrl={currentChannelUrl}
            onCloseClick={() => {
              setShowSettings(false);
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default withSendBird(CustomizedApp);
