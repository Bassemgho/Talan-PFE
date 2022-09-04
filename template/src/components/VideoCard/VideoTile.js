/*eslint-disable*/
import React, { useEffect, useRef } from 'react';

// import styled from 'styled-components';
import { VideoTile } from '@azure/communication-react';
import {Box} from '@mui/material';

const VideoT = (props) => {
  const ref = useRef();
  // const peer = props.peer;
  //
  // useEffect(() => {
  //   peer.on('stream', (stream) => {
  //     ref.current.srcObject = stream;
  //   });
  //
  // }, [peer]);


  return (
    <Box borderRadius={2}>
    <VideoTile
     borderRadius='1%'
      playsInline
      autoPlay
      ref={ref}
    />

    </Box>
  );
};



export default VideoT;
