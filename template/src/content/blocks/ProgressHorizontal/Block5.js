/* eslint-disable */
import { Fragment ,useState,useEffect,useContext} from 'react';
import {SocketContext} from 'src/contexts/SocketContext.js'
import {useParams} from 'react-router-dom'

import {
  Box,
  Divider,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  Card,
  Typography,
  IconButton,
  alpha,
  styled,
  useTheme,
  linearProgressClasses
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import PageviewTwoToneIcon from '@mui/icons-material/PageviewTwoTone';
import Scrollbar from 'src/components/Scrollbar';
// import socket from 'src/socket.js'


const LinearProgressPrimary = styled(LinearProgress)(
  ({ theme }) => `
        height: 14px;
        border-radius: ${theme.general.borderRadiusSm};

        &.${linearProgressClasses.colorPrimary} {
            background-color: ${alpha(theme.colors.primary.main, 0.1)};
            box-shadow: inset 0 1px 2px ${alpha(
              theme.colors.primary.dark,
              0.2
            )};
        }

        & .${linearProgressClasses.bar} {
            border-radius: ${theme.general.borderRadiusSm};
            background-color: ${theme.colors.primary.main};
        }
    `
);

const CardWrapper = styled(Card)(
  ({ theme }) => `
      background: ${alpha(theme.colors.alpha.black[10], 0.02)};
      border-radius: 0;
  `
);

const ListWrapper = styled(List)(
  () => `
      .MuiListItem-root:last-of-type + .MuiDivider-root {
          display: none;
      }
  `
);

function Block5({poll,disabled}) {
  const {getSocket} = useContext(SocketContext)
  const  [socket,setSocket] = useState(getSocket());
  const {eventid} = useParams()

  const [state,setstate] = useState(poll)
  const [dis,setdis] = useState(disabled)

  const { t } = useTranslation();
  const theme = useTheme();
  useEffect(() => {
    socket.on('user-vote-success',({poll}) => {
      setstate(poll)
    })
  },[])
  // useEffect(() => {
  //    socket.emit('get-poll',{poll})
  // },[])

  // const items = [
  //   {
  //     id: 1,
  //     title: 'Orders',
  //     value: '345',
  //     progress: 34
  //   },
  //   {
  //     id: 2,
  //     title: 'Sales',
  //     value: '84',
  //     progress: 15
  //   },
  //   {
  //     id: 3,
  //     title: 'Users',
  //     value: '4,564',
  //     progress: 53
  //   },
  //   {
  //     id: 4,
  //     title: 'Visits',
  //     value: '1,54k',
  //     progress: 71
  //   },
  //   {
  //     id: 5,
  //     title: 'Revenue',
  //     value: '$34,325',
  //     progress: 47
  //   }
  // ];
  const getProgress = (id,poll=state) => {
    const sum = poll.options.reduce((sum,opt)=> {

      return sum+opt.votes
    }, 0);
    if (sum==0) {
      return 0
    }
    const num = poll.options[id].votes
    const prog = (num*100.0)/(sum*1.0)
    console.log('poll',sum);
    console.log(prog);
    return prog
  }
  const handleVote = (id) => {
    // console.log('handlevote ',id);
    socket.emit('user-vote',{eventid,pollid:poll._id,optionid:id})
    setdis(true)

  }

  return (
    <Card variant="outlined">
      <Box
        p={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography gutterBottom variant="h4">
            {t('Question')}
          </Typography>
          <Typography variant="subtitle2">
            {t(`question:${poll.question}`)}
          </Typography>
        </Box>
        <IconButton size="small" color="secondary">
          <MoreVertTwoToneIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          height: 301
        }}
      >
        <Scrollbar>
          <ListWrapper disablePadding>
            {state.options.map((opt,id) => (
              <Fragment key={id}>
                <ListItemButton
                  onClick={() => {dis?null:handleVote(opt._id)}}
                  sx={{
                    display: 'block',
                    py: 1.5,
                    px: 3
                  }}
                >
                  <Box
                    display="flex"
                    mb={0.6}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h4">{t(opt.text)}</Typography>
                    <Typography
                      sx={{
                        color: `${theme.colors.primary.main}`
                      }}
                      variant="h3"
                    >
                      {opt.votes}
                    </Typography>
                  </Box>
                  <LinearProgressPrimary
                    variant="determinate"
                    value={getProgress(id)}
                  />
                  <Box
                    display="flex"
                    sx={{
                      pt: 0.4
                    }}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="subtitle1">0</Typography>
                    <Typography variant="subtitle1">100%</Typography>
                  </Box>
                </ListItemButton>
                <Divider />
              </Fragment>
            ))}
          </ListWrapper>
        </Scrollbar>
      </Box>
      <Divider />
      <CardWrapper
        elevation={0}
        sx={{
          textAlign: 'center',
          p: 2
        }}
      >
        <Button startIcon={<PageviewTwoToneIcon />} variant="outlined">
          {t('View details')}
        </Button>
      </CardWrapper>
    </Card>
  );
}

export default Block5;
