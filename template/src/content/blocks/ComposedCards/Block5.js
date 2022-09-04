/* eslint-disable */
import {useState,useRef,useEffect,useContext,useCallback} from 'react'
import {SocketContext} from 'src/contexts/SocketContext.js'
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';


import {
  Box,
  Card,
  Typography,
  alpha,
  Grid,
  IconButton,
  Tooltip,
  TextField,
  Avatar,
  Badge,
  Divider,
  Button,
  Slide,
  CircularProgress,
  CardActionArea,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  useTheme,
  styled
} from '@mui/material';
import axios from 'axios'
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { formatDistance, subHours, subMinutes,subDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Scrollbar from 'src/components/Scrollbar';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import Online from './Block10'
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
        display:flex;
        flex-direction: column;
  `
);

const CardWrapper = styled(Card)(
  ({ theme }) => `
      background: ${alpha(theme.colors.alpha.black[10], 0.05)};
      box-shadow: none;
      border-radius: 0;

  `
);
const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;

      .MuiTabs-indicator {
        box-shadow: none;
      }
    }
`
);
const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
        background-color: ${theme.colors.alpha.black[5]};

        .MuiTabs-flexContainer {
            justify-content: center;
        }
  `
);


const CardActionAreaWrapper = styled(CardActionArea)(
  ({ theme }) => `
      height: ${theme.spacing(18)};
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      overflow: hidden;

      .MuiSvgIcon-root {
        opacity: .5;
      }

      .MuiTouchRipple-root {
        opacity: .3;
      }

      img {
        height: auto;
        width: 100%;
      }

      .MuiCardActionArea-focusHighlight {
        background: ${theme.colors.warning.main};
      }

      &:hover {
        .MuiCardActionArea-focusHighlight {
          opacity: .05;
        }
      }
`
);

function FileCard({attachement}){
  const theme = useTheme();
  const { t } = useTranslation();
  const [filename,setFilename] = useState('')
  const [created,setCreated] = useState(new Date())
  const [uploader,setUploader] = useState('')

  const getFileInfo = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/events/fileinfo/${attachement}`)
      if (response.data.success==true) {
        setFilename(response.data.name)
        setCreated(response.data.updatedAt)
        setUploader(response.data.uploader)
      }
    }catch (err){
      alert(err)
    }
  })
  useEffect(()=>{
    getFileInfo()
  },[getFileInfo])
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const handleClick = async () => {
    try {
      const response = await axios({
        url:`http://localhost:5000/files/download/${attachement}`,
        method:'GET',
        responseType:'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        openInNewTab(url);
      })
        console.log(response);
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardActionAreaWrapper onClick={()=>{handleClick()}}>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${theme.typography.pxToRem(55)}`
            }}
            color="text.secondary"
          >
            <TextSnippetTwoToneIcon fontSize="inherit" />
          </Typography>
        </CardActionAreaWrapper>
        <Divider />
        <CardActions
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2
          }}
        >
          <Box>
            <Box display="flex" alignItems="center" pb={0.5}>
              <TextSnippetTwoToneIcon />
              <Typography
                sx={{
                  pl: 1
                }}
                fontWeight="bold"
                variant="h6"
              >
                {filename}
              </Typography>
            </Box>
            <Typography component="span" variant="subtitle1">
              {t('Edited')}{' '}
              {formatDistance((new Date(created)||subDays(new Date(), 3)), new Date(), {
                addSuffix: true
              })}{' '}
              {t('by')}{uploader}
            </Typography>
          </Box>
          <IconButton size="small" color="primary">
            <MoreHorizTwoToneIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>

  )
}
function Message({text,time,message}) {
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
        {message.attachement && <FileCard attachement={message.attachement} /> }
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
function MyMessage({text,time,message}) {
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
        {message.attachement && <FileCard attachement={message.attachement} />}
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
  const [currentTab, setCurrentTab] = useState('messanger');
  const [msgs, setMsg] = useState([]);
  const [finished,setfinished] = useState(false)
  const messagesEndRef = useRef();
  const ref = useRef()
  const inputRef = useRef();
  const isMountedRef = useRefMounted();
  isMountedRef.current=true
  const tabs = [
    { value: 'all users', label: t('all users') },
    { value: 'messanger', label: t('messanger') },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth'});
  }
  useEffect(() => {
    socket.emit('client-fetsh-messages-id',{id:eventid})
    socket.on('server-response-fetsh-messages',({messages}) => {
      if (isMountedRef) {
        setMsg(messages)
        setfinished(true)
        // setSelectedFile(null)

      }


    })
  },[])
  useEffect(() => {

    socket.on('FE-receive-message', ({ msg }) => {
      if (isMountedRef) {
        console.log('receive',{ msg });

        setMsg(msgs.concat([{ msg:msg.text, sender:msg.sender,updatedAt:msg.updatedAt,attachement:msg.attachement}]));
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
      let file;
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
          file = res.data.file
          if(res.data.success){
            alert('file uploaded')
          }else{
            alert('file not uploaded')
          }
        }
      if (msg) {
        // console.log('clicking2');
        if(file){

          socket.emit('BE-send-message', { eventid, msg, sender: user._id,file:file._id});
        }else{
          socket.emit('BE-send-message', { eventid, msg, sender: user._id});

        }
        // setSelectedFile(null)

        inputRef.current.value = '';

      }

      setSelectedFile(null)
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
const handleTabsChange = (_event, value) => {
  setCurrentTab(value);
};

console.log(msgs);
  return (
  <Slide direction= 'left' in={display } mountOnEnter unmountOnExit  >

          <Card  >
            <Box
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
              <TabsContainerWrapper>
                <Tabs
                  onChange={handleTabsChange}
                  value={currentTab}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
              </TabsContainerWrapper>
                <Typography
                  sx={{
                    pb: 1
                  }}
                  variant="caption"message
                  fontWeight="bold"
                >
                  {t(currentTab)}
                </Typography>
                {/* <Typography variant="h4">{t('Talking to Kate')}</Typography> */}
              </Box>
              <IconButton color="primary">
                <AddCircleTwoToneIcon />
              </IconButton>
            </Box>
            <Divider />
{ currentTab=='messanger' &&
           <>
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
                      <MyMessage time={mg.updatedAt} ref={index==msgs.length-1?messagesEndRef:ref} key={index} text={mg.msg||mg.text} message={mg} / >
                    );
                  }else {
                    return (


                      <Message time={mg.updatedAt} ref={index==msgs.length-1?messagesEndRef:ref} key={index} text={mg.msg||mg.text} message={mg} /> )
                  }
                })}
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
                {selectedFile &&
                  <Typography component="span" color="text.primary">
                  <b>{selectedFile.name}</b>}
                </Typography>}
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
            </>
          }
          {currentTab=='all users' &&
          <>
            <Box
            sx={{
              height: 487
            }}
            >
            <Button onClick={()=>{console.log(peersRef);}}>log</Button>
            <Scrollbar>
            <Online peers={peersRef} />
            </Scrollbar>

            </Box>
          </>

          }

          </Card>
          </Slide>
        )
}

export default Block5;
