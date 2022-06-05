import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';

import {Box} from '@mui/material';

const VideoCard = (props) => {
  const ref = useRef();
  const peer = props.peer;

  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });

  }, [peer]);

  return (
    <Box borderRadius={2}>
    <Video
     borderRadius='1%'
      playsInline
      autoPlay
      ref={ref}
    />

    </Box>
  );
};

const Video = styled.video`
`;

export default VideoCard;
