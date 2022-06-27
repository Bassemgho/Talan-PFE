/* eslint-disable */
// import {useState,useEffect,useRef} from 'react'
import React, { useEffect , useState , useRef,useContext} from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Scrollbar from 'src/components/Scrollbar';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  Zoom,
  Typography,
  Divider,
  TextField,
  CircularProgress,
  Switch,
  Avatar,
  Autocomplete,
  IconButton,
  Button,
  styled as materialStyled
} from '@mui/material';
import {PollDialogueContext} from 'src/contexts/PollDialogueContext.js'
import {SocketContext} from 'src/contexts/SocketContext.js'

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';

import io from 'socket.io-client';
import Peer from 'simple-peer'
import {useParams} from 'react-router-dom'
import useAuth from 'src/hooks/useAuth';

// import { Box, Flex, Stack ,useDisclosure,Button} from '@chakra-ui/react'
import styled from 'styled-components';
import Video from '../VideoCard/VideoCard'
import BottomBar from '../BottomBar/BottomBar';
// import Chat from '../Chat/Chat';
import Chat from 'src/content/blocks/ComposedCards/Block5.js'
import './Room.css'

// import socket from 'src/socket.js'
import VoteDialogue from 'src/components/Room/VoteDialogue.jsx'
import UsersDisplay from 'src/components/Room/UsersDisplay.jsx'
import AllVotesDialogue from 'src/components/Room/AllVotesDialogue.jsx'


 const Room = ()=>{
   const { user } = useAuth();

   const {isOpen,onOpen,onClose,voteisOpen,openVote,closeVote,setpoll,allisOpen,openAll,closeAll} = useContext(PollDialogueContext)
   const {getSocket} = useContext(SocketContext)
   const  [socket,setSocket] = useState(getSocket());
   const currentUser = user.firstname + ' ' + user.lastname
   const [peers,setPeers] = useState([])
   const [userVideoAudio, setUserVideoAudio] = useState({
     localUser: { video: true, audio: true },
   });
   const [displayChat, setDisplayChat] = useState(false);
   const [videoDevices, setVideoDevices] = useState([]);
   const [screenShare, setScreenShare] = useState(false);
   const [showVideoDevices, setShowVideoDevices] = useState(false);

  const socketRef = useRef()
  const userVideoRef = useRef()
  const userStream = useRef()
  const peersRef= useRef([])
  const screenTrackRef = useRef()
  const {eventid} = useParams()
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  socketRef.current = socket
  // const token = localStorage.getItem('accessToken');
  // console.log(token);
  // const socket = io.connect('http://localhost:5000/', {
  //   query: {token}
  // });

  useEffect(()=>{
    setVideoDevices([])
    // const sockets = io('http://localhost:5000', { autoConnect: true, forceNew: true });
    // navigator.mediaDevices.enumerateDevices().then((devices) => {
    //   const filtered = devices.filter((device) => device.kind === 'videoinput');
    //   setVideoDevices(filtered);
    // });
    console.log(navigator);
    navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
      userVideoRef.current.srcObject = stream
      userStream.current = stream
    socket.emit('BE-join-room',{eventid})
    socket.on('FE-user-join', (users) =>{
      const peers = []
      users.forEach(({userId,info}) => {
        let {userName,video,audio} = info;
        if (userName !==currentUser) {
          const peer = createPeer(userId,socket.id,stream)
          peer.userName=userName
          peer.userId=userId
          peersRef.current.push({peerID:userId,peer,userName})
          peers.push(peer)
          setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
        }
        setPeers(peers);

      });
      console.log(users);
    })
    socket.on('FE-receive-call',({signal,from,info})=>{
      let {userName,video,audio} =  info
      const peerIdx = findPeer(from);
      if (!peerIdx) {
          const peer = addPeer(signal, from, stream);
     peer.userName = userName;
     peersRef.current.push({
              peerID: from,
              peer,
              userName,
      });
      setPeers((users) => {
              return [...users, peer];
      });
      setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
  }
  })
  socket.on('FE-call-accepted', ({ signal, answerId }) => {
    enqueueSnackbar(t(`a user has joined successfully answerId:${answerId}`), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });
  socket.on('FE-user-leave', ({ userId }) => {
       const peerIdx = findPeer(userId);
       peerIdx.peer.destroy();
       setPeers((users) => {
         users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
         return [...users];
       });
       peersRef.current = peersRef.current.filter(({ peerID }) => peerID !== userId );
     });


    socket.on('FE-toggle-camera', ({ userId, switchTarget }) => {
      const peerIdx = findPeer(userId);

      setUserVideoAudio((preList) => {
        let video = preList[peerIdx.userName].video;
        let audio = preList[peerIdx.userName].audio;

        if (switchTarget === 'video') video = !video;
        else audio = !audio;

        return {
          ...preList,
          [peerIdx.userName]: { video, audio },
        };
      });
    });
    socket.on('poll-creation',({success,poll}) => {

      if (success) {
        setpoll(poll)
        // resetForm();
        // setStatus({ success: true });
        // setSubmitting(false);
        handleCreatePoll();
      }else {
        throw new Error('something gone wrong')
      }})
    return () => {
     socket.disconnect();
   };

})
    // const sockets = io('/');
    // export default sockets;
console.log(peers,peersRef);
  },[])
  function createUserVideo(peer, index, arr) {
  return (
    <Grid item xs={12} md={6} lg={6}>

    <VideoBox
      className={`width-peer${peers.length > 8 ? '' : peers.length}`}
      onClick={expandScreen}
      key={index}
    >
      {writeUserName(peer.userName)}
      <FaIcon className='fas fa-expand' />
      <Video key={index} peer={peer} number={arr.length} />
    </VideoBox>
    </Grid >


  );
}
function writeUserName(userName) {
  if (userVideoAudio.hasOwnProperty(userName)) {
    if (!userVideoAudio[userName].video) {
      return <UserName key={userName}>{userName}</UserName>;
    }
  }
  return null
}
const clickChat = (e) => {
   e.stopPropagation();
   setDisplayChat(!displayChat);
 };
 const goToBack = (e) => {
   e.preventDefault();
   socket.emit('BE-leave-room', { eventid, leaver: currentUser });
   sessionStorage.removeItem('user');
   window.location.href = '/';
 };
 const toggleCameraAudio = (e) => {
  const target = e.target.getAttribute('data-switch');

  setUserVideoAudio((preList) => {
    let videoSwitch = preList.localUser.video;
    let audioSwitch = preList.localUser.audio;

    if (target === 'video') {
      const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
      videoSwitch = !videoSwitch;
      userVideoTrack.enabled = videoSwitch;
    } else {
      const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
      audioSwitch = !audioSwitch;

      if (userAudioTrack) {
        userAudioTrack.enabled = audioSwitch;
      } else {
        userStream.current.getAudioTracks()[0].enabled = audioSwitch;
      }
    }

    return {
      ...preList,
      localUser: { video: videoSwitch, audio: audioSwitch },
    };
  });

  socket.emit('BE-toggle-camera-audio', { eventid, switchTarget: target });
};
const clickScreenSharing = ()=>{
  if (!screenShare) {
    navigator.mediaDevices.getDisplayMedia({cursor:true}).then((stream)=>{
      const screenTrack = stream.getTracks()[0]
      console.log('peers',peersRef);
      peersRef.current.forEach(({peer}) => {
        peer.replaceTrack(peer.streams[0].getTracks().find((track) => track.kind === 'video'),screenTrack,userStream.current)
      });
      screenTrack.onended = () => {
            peersRef.current.forEach(({ peer }) => {
              peer.replaceTrack(
                screenTrack,
                peer.streams[0]
                  .getTracks()
                  .find((track) => track.kind === 'video'),
                userStream.current
              );
            });
            userVideoRef.current.srcObject = userStream.current;
            setScreenShare(false);
          };
          userVideoRef.current.srcObject = stream;
              screenTrackRef.current = screenTrack;
              setScreenShare(true);
    })
  }else {
      screenTrackRef.current.onended();
    }

}
const expandScreen = (e) => {
  const elem = e.target;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
};
const clickBackground = () => {
   if (!showVideoDevices) return;

   setShowVideoDevices(false);
 };
 const clickCameraDevice = (event) => {
  if (event && event.target && event.target.dataset && event.target.dataset.value) {
    const deviceId = event.target.dataset.value;
    const enabledAudio = userVideoRef.current.srcObject.getAudioTracks()[0].enabled;

    navigator.mediaDevices
      .getUserMedia({ video: { deviceId }, audio: enabledAudio })
      .then((stream) => {
        const newStreamTrack = stream.getTracks().find((track) => track.kind === 'video');
        const oldStreamTrack = userStream.current
          .getTracks()
          .find((track) => track.kind === 'video');

        userStream.current.removeTrack(oldStreamTrack);
        userStream.current.addTrack(newStreamTrack);

        peersRef.current.forEach(({ peer }) => {
          // replaceTrack (oldTrack, newTrack, oldStream);
          peer.replaceTrack(
            oldStreamTrack,
            newStreamTrack,
            userStream.current
          );
        });
      });
  }
};
  function addPeer(incommingSignal,callerId,stream) {
    const peer = new Peer({
      initiator:false,
      trickle:false,
      stream
    })
    peer.on('signal',(signal)=>{
      socket.emit('BE-accept-call',{signal,to:callerId})
    })
    peer.on('disconnect', () => {
      peer.destroy();
    });
    peer.signal(incommingSignal);
    return peer;
  }
  function findPeer(id) {
   return peersRef.current.find((p) => p.peerID === id);
 }
  function createPeer(userId,caller,stream) {
    const peer = new Peer({
      initiator:true,
      trickle:false,
      stream
    })
    peer.on('signal',(signal)=>{
      socket.emit('BE-call-user',{
        userToCall:userId,
        from:caller,
        signal
      })
    })
   peer.on('disconnect',()=>{
     peer.destroy()
   })
   return peer;
  }
  console.log('room');
  // console.log(socket);
  const handleCreatePoll = () => {
    enqueueSnackbar(t('The poll was created successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    if (isOpen) {

      onClose()
    }
    openVote()
  }
  return (
    <RoomContainer className='Room' onClick={clickBackground}>

      <VideoAndBarContainer>
        <VideoContainer>
          {/* Current User Video */}
          <Scrollbar>
          <Grid container wrap="wrap" spacing={2}>
            <Grid item xs={12} md={6} lg={6}>
          <VideoBox
            className={`width-peer${peers.length > 8 ? '' : peers.length}`}
          >
            {userVideoAudio['localUser'].video ? null : (
              <UserName>{currentUser}</UserName>
            )}
            <FaIcon className='fas fa-expand' />
            <MyVideo
              onClick={expandScreen}
              ref={userVideoRef}
              muted
              autoPlay
              playInline
            />
          </VideoBox>
            </Grid>
          {/* les autre utilisateurs */}
          {peers &&
            peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
            </Grid >

            </Scrollbar>
          </VideoContainer>

        <BottomBarStyled
          clickScreenSharing={clickScreenSharing}
          clickChat={clickChat}
          clickCameraDevice={clickCameraDevice}
          goToBack={goToBack}
          toggleCameraAudio={toggleCameraAudio}
          userVideoAudio={userVideoAudio.localUser}
          screenShare={screenShare}
          videoDevices={videoDevices}
          showVideoDevices={showVideoDevices}
          setShowVideoDevices={setShowVideoDevices}
        />
      </VideoAndBarContainer>
      <Chat peersRef={peers} display={displayChat} eventid={eventid} socket={socketRef} />
      <Dialog
        fullWidth
        maxWidth="md"
        open={isOpen}
        onClose={onClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Create a Poll/Question')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Fill in the fields below to create and add a new Poll to the meet'
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            answer2: 'hiii',
            question: 'helloo',
            answer1: 'byyy',
            // last_name: '',
            answer3: 'ssss',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            question: Yup.string()
              .max(255)
              .required(t('The question field is required')),
            answer1: Yup.string()
              .max(255)
              .required(t('The answer1 field is required')),
            // last_name: Yup.string()
            //   .max(255)
            //   .required(t('The last name field is required')),
            answer2: Yup.string()
              // .email(t('The answer2 provided should be a valid answer2 address'))
              .max(255)
              .required(t('The answer2 field is required')),
            answer3: Yup.string()
              .max(255)
              .required(t('The answer3 field is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              // await wait(1000);
              console.log(_values);
              setSubmitting(true)
              socket.emit('start-a-new-poll',{eventid,question:_values.question,options:[_values.answer1,_values.answer2,_values.answer3]})
              let success = false
              socket.on('poll-creation',({success,poll}) => {

                if (success) {
                  setpoll(poll)
                  resetForm();
                  setStatus({ success: true });
                  setSubmitting(false);
                  handleCreatePoll();
                }else {
                  throw new Error('something gone wrong')
                }
              })
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
            console.log('submitting');
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={7}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.question && errors.question)}
                          fullWidth
                          helperText={touched.question && errors.question}
                          label={t('Question')}
                          name="question"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.question}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} >
                        <TextField
                          error={Boolean(
                            touched.answer1 && errors.answer1
                          )}
                          fullWidth
                          helperText={touched.answer1 && errors.answer1}
                          label={t('Answer 1')}
                          name="answer1"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.answer1}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.answer2 && errors.answer2)}
                          fullWidth
                          helperText={touched.answer2 && errors.answer2}
                          label={t('Answer 2')}
                          name="answer2"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.answer2}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.answer3 && errors.answer3)}
                          fullWidth
                          margin="normal"
                          helperText={touched.answer3 && errors.answer3}
                          label={t('Answer 3')}
                          name="answer3"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.answer3}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={5} justifyContent="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                      mt={3}
                    >
                      <Divider
                        flexItem
                        sx={{
                          m: 4
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3
                }}
              >
                <Button color="secondary" onClick={onClose}>
                  {t('Cancel')}
                </Button>
                <Button
                  type="submit"
                  // onClick={handleSubmit}
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {t('Add new Vote')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
      <VoteDialogue open={voteisOpen} onClose={closeVote} />
      <AllVotesDialogue open={allisOpen} onClose={closeAll} />
    </RoomContainer>
  );
}
const BottomBarStyled = materialStyled(BottomBar)(
  ({theme}) => {
`    position: fixed;
bottom: 0;
width: 100%;
transition: width 0.3s, height 0.3s, transform 0.3s;
`  }
)
const RoomContainer = styled.div`
background-color: #454552;
min-height: 100vh;
/* align-items: center; */
justify-content: center;
  display: flex;
  width: 100%;
  max-height: 100vh;
  flex-direction: row;
`;

const VideoContainer = styled.div`
  max-width: 100%;
  height: 92%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  gap: 10px;
`;

const VideoAndBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const MyVideo = styled.video``;

const VideoBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  > video {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  :hover {
    > i {
      display: block;
    }
  }
`;

const UserName = styled.div`
  position: absolute;
  font-size: calc(20px + 5vmin);
  z-index: 1;
`;

const FaIcon = styled.i`
  display: none;
  position: absolute;
  right: 15px;
  top: 15px;
`;
export default Room
