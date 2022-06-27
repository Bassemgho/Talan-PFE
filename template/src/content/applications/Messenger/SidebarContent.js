/*eslint-disable*/
import { useState,useEffect,useRef } from 'react';
import {
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Zoom,
  CircularProgress,
  Typography,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  List,
  Button,
  Tooltip,
  Divider,
  AvatarGroup,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  lighten,
  styled
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';

import {
  getUsers,createChat
} from 'src/slices/messenger';

import useAuth from 'src/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { formatDistance, subMinutes, subHours } from 'date-fns';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Label from 'src/components/Label';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import AlarmTwoToneIcon from '@mui/icons-material/AlarmTwoTone';
// import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';

import { Link as RouterLink } from 'react-router-dom';
import  Select from 'react-select'

const CustomSelect = styled(Select)(
  ({ theme })=>`
    margin-top:10px;
    margin-bottom:10px;

    `)


const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
          background-color: ${theme.colors.success.lighter};
          color: ${theme.colors.success.main};
          width: ${theme.spacing(8)};
          height: ${theme.spacing(8)};
          margin-left: auto;
          margin-right: auto;
    `
);

const MeetingBox = styled(Box)(
  ({ theme }) => `
          background-color: ${lighten(theme.colors.alpha.black[10], 0.5)};
          margin: ${theme.spacing(2)} 0;
          border-radius: ${theme.general.borderRadius};
          padding: ${theme.spacing(2)};
    `
);

const RootWrapper = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(2.5)};
  `
);

const ListItemWrapper = styled(ListItemButton)(
  ({ theme }) => `
        &.MuiButtonBase-root {
            margin: ${theme.spacing(1)} 0;
        }
  `
);

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTabs-indicator {
            min-height: 4px;
            height: 4px;
            box-shadow: none;
            border: 0;
        }

        .MuiTab-root {
            &.MuiButtonBase-root {
                padding: 0;
                margin-right: ${theme.spacing(3)};
                font-size: ${theme.typography.pxToRem(16)};
                color: ${theme.colors.alpha.black[50]};

                .MuiTouchRipple-root {
                    display: none;
                }
            }

            &.Mui-selected:hover,
            &.Mui-selected {
                color: ${theme.colors.alpha.black[100]};
            }
        }
  `
);
const Item = (participants)=>{
  return (
    <ListItemWrapper selected>
      <ListItemAvatar>
        <Avatar src="/static/images/avatars/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        sx={{
          mr: 1
        }}
        primaryTypographyProps={{
          color: 'textPrimary',
          variant: 'h5',
          noWrap: true
        }}
        secondaryTypographyProps={{
          color: 'textSecondary',
          noWrap: true
        }}
        primary={participants.firstname+' '+participants.lastname}
      />
      <Label color="primary">
        <b>2</b>
      </Label>
    </ListItemWrapper>

  );
}

function SidebarContent() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const selectRef = useRef()
  const {users,chats} = useSelector(
    (state) => state.messenger
  );
  console.log(users);
  useEffect(() => {
    try {

      dispatch(getUsers());
    } catch (e) {
      console.log(e.message);
    }
  }, [dispatch]);


  const [state, setState] = useState({
    invisible: true
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });
  };

  const [currentTab, setCurrentTab] = useState('all');
  const [participants,setParticipants] = useState([])
  const [isOpen,setOpen] = useState(false)
  const onOpen = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  const tabs = [
    { value: 'all', label: t('All') },
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };
  const getOptions = (users=[])=>{
    const options = users.map((user,index)=>{
      return {label:`${user.firstname} ${user.lastname}`,value:user._id}

    })
    console.log(options);
    return options

}
const handleSubmit = () => {
  console.log('select',participants);
  dispatch(createChat(participants))
}
  return (
    <RootWrapper>
      <Box display="flex" alignItems="flex-start">
        <Avatar alt={user.firstname} src={user.avatar} />
        <Box
          sx={{
            ml: 1.5,
            flex: 1
          }}
        >
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" noWrap>
                {user.firstname}
              </Typography>
              <Typography variant="subtitle1" noWrap>
              Software engineer
              </Typography>
            </Box>
            <IconButton
              sx={{
                p: 1
              }}
              size="small"
              color="primary"
            >
              <SettingsTwoToneIcon fontSize="small" />
            </IconButton>
          </Box>


        </Box>
      </Box>

      <TextField
        sx={{
          mt: 2,
          mb: 1
        }}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchTwoToneIcon />
            </InputAdornment>
          )
        }}
        placeholder={t('Search...')}
      />
<Box display='flex'>
      <Typography
        sx={{
          mb: 1,
          mt: 2
        }}
        variant="h3"
      >
        {t('Chats')}
      </Typography>
      <IconButton onClick={onOpen} color="primary">
        <AddCircleTwoToneIcon />
      </IconButton>
      </Box>


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

      <Box mt={2}>
        {currentTab === 'all' && (
          <List disablePadding component="div">
          {chats && chats.map((chat) => {
            <Item participants={chat.participants[0]} />
          })}
          </List>
        )}
        <Dialog
        fullWidth
        maxWidth="md"
        open={isOpen}
        onClose={onClose}
        >
        <DialogContent>
          <Box sx={{height:180}}>
          <CustomSelect
            ref = {selectRef}
            className = 'select'
            isMulti
            options={getOptions(users)}
            fullWidth
            placeholder={t('Event Participants')}
            name="participants"
            margin="normal"
            onChange={(e) => {
              setParticipants(e)
            }}
            variant="outlined"
          />

          </Box>
        </DialogContent>
        <DialogActions
        sx={{
          p: 3
        }}>
        <Button color="secondary" onClick={onClose}>
          {t('Cancel')}
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
        >
          {t('create chat')}
        </Button>

        </DialogActions>
        </Dialog>
      </Box>
      <Box display="flex" pb={1} mt={4} alignItems="center">
        <Typography
          sx={{
            mr: 1
          }}
          variant="h3"
        >
          {t('Meetings')}
        </Typography>
        <Label color="success">
          <b>2</b>
        </Label>
      </Box>
      <MeetingBox>
        <Typography variant="h4">{t('Daily Design Meeting')}</Typography>

        <Box py={3} display="flex" alignItems="flex-start">
          <AlarmTwoToneIcon />
          <Box pl={1}>
            <Typography
              variant="subtitle2"
              sx={{
                lineHeight: 1
              }}
              color="text.primary"
            >
              10:00 - 11:30
            </Typography>
            <Typography variant="subtitle1">
              {formatDistance(subMinutes(new Date(), 12), new Date(), {
                addSuffix: true
              })}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <AvatarGroup>
            <Tooltip arrow title={`${t('View profile for')} Remy Sharp`}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28
                }}
                component={RouterLink}
                to="#"
                alt="Remy Sharp"
                src="/static/images/avatars/1.jpg"
              />
            </Tooltip>
            <Tooltip arrow title={`${t('View profile for')} Travis Howard`}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28
                }}
                component={RouterLink}
                to="#"
                alt="Travis Howard"
                src="/static/images/avatars/2.jpg"
              />
            </Tooltip>
            <Tooltip arrow title={`${t('View profile for')} Craig Vaccaro`}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28
                }}
                component={RouterLink}
                to="#"
                alt="Craig Vaccaro"
                src="/static/images/avatars/3.jpg"
              />
            </Tooltip>
          </AvatarGroup>

          <Button variant="contained" size="small">
            {t('Attend')}
          </Button>
        </Box>
      </MeetingBox>

      <MeetingBox>
        <Typography variant="h4">{t('Investors Council Meeting')}</Typography>

        <Box py={3} display="flex" alignItems="flex-start">
          <AlarmTwoToneIcon />
          <Box pl={1}>
            <Typography
              variant="subtitle2"
              sx={{
                lineHeight: 1
              }}
              color="text.primary"
            >
              14:30 - 16:15
            </Typography>
            <Typography variant="subtitle1">
              {formatDistance(subHours(new Date(), 4), new Date(), {
                addSuffix: true
              })}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <AvatarGroup>
            <Tooltip arrow title={`${t('View profile for')} Travis Howard`}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28
                }}
                component={RouterLink}
                to="#"
                alt="Travis Howard"
                src="/static/images/avatars/4.jpg"
              />
            </Tooltip>
            <Tooltip arrow title={`${t('View profile for')} Craig Vaccaro`}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28
                }}
                component={RouterLink}
                to="#"
                alt="Craig Vaccaro"
                src="/static/images/avatars/5.jpg"
              />
            </Tooltip>
          </AvatarGroup>

          <Button variant="contained" size="small">
            {t('Attend')}
          </Button>
        </Box>
      </MeetingBox>
    </RootWrapper>
  );
}

export default SidebarContent;
