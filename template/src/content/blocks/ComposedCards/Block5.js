/* eslint-disable */
import {useState,useRef,useEffect,useContext} from 'react'
import {SocketContext} from 'src/contexts/SocketContext.js'
import {
  Box,
  Card,
  Typography,
  alpha,
  IconButton,
  Tooltip,
  TextField,
  Avatar,
  Badge,
  Divider,
  Button,
  Slide,
  CircularProgress,
  styled
} from '@mui/material';
import axios from 'axios'
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { formatDistance, subHours, subMinutes } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Scrollbar from 'src/components/Scrollbar';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
// import socket from 'src/socket'


const DividerWrapper = styled(Divider)(
  ({ theme }) => `
          height: 40px !important;
          margin: 0 ${theme.spacing(2)};
          align-self: center;
  `
);

const CardWrapperPrimary = styled(Card)(
  ({ theme }) => `
        background: ${theme.colors.primary.main};
        color: ${theme.palette.primary.contrastText};
        padding: ${theme.spacing(2)};
        border-radius: ${theme.general.borderRadiusXl};
        border-top-right-radius: ${theme.general.borderRadius};
        max-width: 380px;
        display: inline-flex;
  `
);

const CardWrapperSecondary = styled(Card)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[10]};
        color: ${theme.colors.alpha.black[100]};
        padding: ${theme.spacing(2)};
        border-radius: ${theme.general.borderRadiusXl};
        border-top-left-radius: ${theme.general.borderRadius};
        max-width: 380px;
        display: inline-flex;
  `
);

const CardWrapper = styled(Card)(
  ({ theme }) => `
      background: ${alpha(theme.colors.alpha.black[10], 0.05)};
      box-shadow: none;
      border-radius: 0;
  `
);
function Message({text,time}) {
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      py={3}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 50,
          height: 50
        }}
        alt={user.firstname}
        src="/static/images/avatars/1.jpg"
      />
      <Box
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        justifyContent="flex-start"
        ml={2}
      >
        <CardWrapperSecondary>
          {text}
        </CardWrapperSecondary>
        <Typography
          variant="subtitle1"
          sx={{
            pt: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ScheduleTwoToneIcon
            sx={{
              mr: 0.5
            }}
            fontSize="small"
          />
          {formatDistance(new Date(time)||(subHours(new Date(), 125)), new Date(), {
            addSuffix: true
          })}
        </Typography>
      </Box>
    </Box>
  );
}
function MyMessage({text,time}) {
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-end"
      py={3}
    >
      <Box
        display="flex"
        alignItems="flex-end"
        flexDirection="column"
        justifyContent="flex-end"
        mr={2}
      >
        <CardWrapperPrimary>
          {text}
        </CardWrapperPrimary>
        <Typography
          variant="subtitle1"
          sx={{
            pt: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ScheduleTwoToneIcon
            sx={{
              mr: 0.5
            }}
            fontSize="small"
          />
          {formatDistance(new Date(time)||(subHours(new Date(), 125)), new Date(), {
            addSuffix: true
          })}
        </Typography>
      </Box>
      <Avatar
        variant="rounded"
        sx={{
          width: 50,
          height: 50
        }}
        alt={user.name}
        src={user.avatar}
      />
    </Box>
  );
}
function Block5({display,eventid,peersRef}) {
  const [selectedFile,setSelectedFile] = useState();
  const { t } = useTranslation();
  const { user } = useAuth();
  const {getSocket} = useContext(SocketContext);
  const socket = getSocket();
  const w = display ? '':'0px'
  const [msgs, setMsg] = useState([]);
  const [finished,setfinished] = useState(false)
  const messagesEndRef = useRef();
  const ref = useRef()
  const inputRef = useRef();
  const isMountedRef = useRefMounted();
  isMountedRef.current=true

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth'});
  }
  useEffect(() => {
    socket.emit('client-fetsh-messages-id',{id:eventid})
    socket.on('server-response-fetsh-messages',({messages}) => {
      if (isMountedRef) {
        setMsg(messages)
        setfinished(true)

      }


    })
  },[])
  useEffect(() => {

    socket.on('FE-receive-message', ({ msg }) => {
      if (isMountedRef) {
        console.log('receive',{ msg });

        setMsg(msgs.concat([{ msg:msg.text, sender:msg.sender,updatedAt:msg.updatedAt }]));
      }
      // console.log('now',msgs);
    });

},[msgs]);
  // useEffect(() => {msgs.length==0 ? null :scrollToBottom()}, [msgs])
  const handleFileChange = (e)=>{
    console.log('finished uploading',e.target.files[0] )
    setSelectedFile(e.target.files[0] )

  }
  const sendMessage = async (e) => {
    if (e.key === 'Enter') {
      // console.log('clicking');
      const msg = e.target.value;

      if (msg) {
        // console.log('clicking2');

        socket.emit('BE-send-message', { eventid, msg, sender: user._id });
        inputRef.current.value = '';

      }

      if(selectedFile ){
        console.log('sending file')
        const formData = new FormData();
        formData.append('attachement',selectedFile);
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        };
        const res = await axios.post(`http://localhost:5000/uploadfile/${eventid}`,formData)
          if(res.success){
            alert('file uploaded')
          }else{
            alert('file not uploaded')
          }
        }
      };
    }
const renderMessages = (message,key)=>{
  // console.log(messages);
  // messages.map((ms,index)=>{
    if (message.sender===user._id) {
      return (
        <MyMessage key={key} text={message.msg}  / >
      );
    }else {
      return (


        <Message key={key} text={ms.msg}  /> )
    }
  // })
}
console.log(msgs);
  return (
    <Slide direction= 'left' in={display } mountOnEnter unmountOnExit  >

    <Card style = {{"width":w,'transition': 'width 0.3s, height 0.3s'}} >
    <Button onClick={() => {console.log(msgs);}}> log messages </Button>
      <Box
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography
            sx={{
              pb: 1
            }}
            variant="caption"
            fontWeight="bold"
          >
            {t('Messenger')}
          </Typography>
          {/* <Typography variant="h4">{t('Talking to Kate')}</Typography> */}
        </Box>
        <IconButton color="primary">
          <AddCircleTwoToneIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          height: 487
        }}
      >
        <Scrollbar>

          <Box px={2}>
          {!finished?<CircularProgress size={24} disableShrink thickness={2} />:null}
          {msgs&& msgs.map((mg,index)=>{
            if (mg.sender===user._id) {
              return (
                <MyMessage time={mg.updatedAt} ref={index==msgs.length-1?messagesEndRef:ref} key={index} text={mg.msg||mg.text}  / >
              );
            }else {
              return (


                <Message time={mg.updatedAt} ref={index==msgs.length-1?messagesEndRef:ref} key={index} text={mg.msg||mg.text}  /> )
            }
          })}
{/*            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              py={3}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50
                }}
                alt="Zain Baptista"
                src="/static/images/avatars/1.jpg"
              />
              <Box
                display="flex"
                alignItems="flex-start"
                flexDirection="column"
                justifyContent="flex-start"
                ml={2}
              >
                <CardWrapperSecondary>
                  Hi. Can you send me the missing invoices asap?
                </CardWrapperSecondary>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5
                    }}
                    fontSize="small"
                  />
                  {formatDistance(subHours(new Date(), 115), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-end"
              py={3}
            >
              <Box
                display="flex"
                alignItems="flex-end"
                flexDirection="column"
                justifyContent="flex-end"
                mr={2}
              >
                <CardWrapperPrimary>
                  Yes, I'll email them right now. I'll let you know once the
                  remaining invoices are done.
                </CardWrapperPrimary>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5
                    }}
                    fontSize="small"
                  />
                  {formatDistance(subHours(new Date(), 125), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Avatar
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50
                }}
                alt={user.name}
                src={user.avatar}
              />
            </Box>

            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-end"
              py={3}
            >
              <Box
                display="flex"
                alignItems="flex-end"
                flexDirection="column"
                justifyContent="flex-end"
                mr={2}
              >
                <CardWrapperPrimary>Hey! Are you there?</CardWrapperPrimary>
                <CardWrapperPrimary
                  sx={{
                    mt: 2
                  }}
                >
                  Heeeelloooo????
                </CardWrapperPrimary>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5
                    }}
                    fontSize="small"
                  />
                  {formatDistance(subHours(new Date(), 60), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Avatar
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50
                }}
                alt={user.name}
                src={user.avatar}
              />
            </Box>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              py={3}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50
                }}
                alt="Zain Baptista"
                src="/static/images/avatars/1.jpg"
              />
              <Box
                display="flex"
                alignItems="flex-start"
                flexDirection="column"
                justifyContent="flex-start"
                ml={2}
              >
                <CardWrapperSecondary>Hey there!</CardWrapperSecondary>
                <CardWrapperSecondary
                  sx={{
                    mt: 1
                  }}
                >
                  How are you? Is it ok if I call you?
                </CardWrapperSecondary>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5
                    }}
                    fontSize="small"
                  />
                  {formatDistance(subMinutes(new Date(), 6), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-end"
              py={3}
            >
              <Box
                display="flex"
                alignItems="flex-end"
                flexDirection="column"
                justifyContent="flex-end"
                mr={2}
              >
                <CardWrapperPrimary>
                  Hello, I just got my Amazon order shipped and I’m very happy
                  about that.
                </CardWrapperPrimary>
                <CardWrapperPrimary
                  sx={{
                    mt: 1
                  }}
                >
                  Can you confirm?
                </CardWrapperPrimary>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5
                    }}
                    fontSize="small"
                  />
                  {formatDistance(subMinutes(new Date(), 8), new Date(), {
                    addSuffix: true
                  })}
                </Typography>
              </Box>
              <Avatar
                variant="rounded"
                sx={{
                  width: 50,
                  height: 50
                }}
                alt={user.name}
                src={user.avatar}
              />
            </Box>*/}
          </Box>
        </Scrollbar>
      </Box>
      <Divider />
      <CardWrapper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              mr: 1
            }}
            size="small"
          >
            {t('Create Post')}
          </Button>
          <Button variant="outlined" color="secondary" size="small">
            {t('Event')}
          </Button>
        </Box>
        <Typography variant="subtitle2">
          {t('Posting as')}{' '}
          <Typography component="span" color="text.primary">
            <b>Emma Taylor</b>
          </Typography>
        </Typography>
      </CardWrapper>
      <Divider />
      <Box p={2} display="flex" alignItems="center">
        <Avatar alt={user.firstname} src={user.avatar} />
        <DividerWrapper orientation="vertical" flexItem />
        <Box
          sx={{
            flex: 1,
            mr: 2
          }}
        >
          <TextField
            ref={inputRef}
            onKeyUp={sendMessage}
            hiddenLabel
            fullWidth
            placeholder={t('Write here your message...')}
          />
        </Box>
        <input id="messenger-upload-file" type="file" onChange={handleFileChange} name='attachement' hidden />
        <Tooltip arrow placement="top" title={t('Attach a file')}>
          <label htmlFor="messenger-upload-file">
            <IconButton color="primary" component="span">
              <AttachFileTwoToneIcon />

            </IconButton>
          </label>
        </Tooltip>
        <DividerWrapper orientation="vertical" flexItem />
        <Badge
          color="warning"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          variant="dot"
        >
          <Button variant="contained" startIcon={<SendTwoToneIcon />}>
            {t('Send')}
          </Button>
        </Badge>
      </Box>
    </Card>
    </Slide>
  );
}

export default Block5;
