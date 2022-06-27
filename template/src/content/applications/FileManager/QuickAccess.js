/* eslint-disable */
import { useState ,useEffect , useCallback} from 'react';
import axios from 'axios'
import {
  Card,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  CardActions,
  CardActionArea,
  Divider,
  IconButton,
  Link,
  Table,
  Avatar,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Drawer,
  styled,
  useTheme,
  TableContainer
} from '@mui/material';
import Carousel from 'react-material-ui-carousel'
import Scrollbar from 'src/components/Scrollbar';

import { useTranslation } from 'react-i18next';
import { formatDistance, subDays } from 'date-fns';

import ViewWeekTwoToneIcon from '@mui/icons-material/ViewWeekTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfTwoTone';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import SidebarDrawer from './SidebarDrawer';

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
function FileCard({attachement,action}){
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


  return (
    // <Grid item xs={12} sm={6}>
      <Card>
        <CardActionAreaWrapper onClick={action}>
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
    // {/*</Grid>*/}

  )
}


function QuickAccess() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [rooms,setRooms] = useState([])
  const [selectedFile,setSelectedFile] = useState('')
  const [stop,setStop] = useState(false)

  const [tabs, setTab] = useState('grid_view');

  const handleViewOrientation = (_event, newValue) => {
    setTab(newValue);
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = (file) => {
    console.log('file',file);
    setSelectedFile(file)
    setMobileOpen(!mobileOpen);
  };
  const getMyFiles = useCallback(async()=>{
    try{
      console.log('before id');

      if(rooms.length==0 && !stop){
        // console.log('after id');
        setStop(true)
        const response = await axios.get('http://localhost:5000/files/getuserfiles');
        if(response.data.success==true){
          setRooms(response.data.rooms)
        }
      }

    }catch(err){
      alert(err)
    }
  })
  useEffect(()=>{getMyFiles()},[getMyFiles])
  const showFiles = (rooms)=>{
      rooms.map(room => {
return(
        <Card>
        <Typography
        sx={{
          pl: 1
        }}
        fontWeight="bold"
        variant="h6"
        color='black'
        >
hello
        </Typography>
        {room.files.map((file)=>{

          <FileCard attachement={file} />
        })
}
</Card>
)      })

  }


  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      >
        <Typography variant="h3">{t('Quick Access')}</Typography>
        <ToggleButtonGroup
          value={tabs}
          exclusive
          onChange={handleViewOrientation}
        >
          <ToggleButton disableRipple value="grid_view">
            <ViewWeekTwoToneIcon />
          </ToggleButton>
          <ToggleButton disableRipple value="table_view">
            <TableRowsTwoToneIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>

        {tabs === 'grid_view' && (
          rooms.length>0 ?rooms.map((room)=>{
            return (
              <Grid item xs={12} sm={12}>
              <Box>
{room.files.length>0 ?
      <Typography
              sx={{
                pl: 1
              }}
              fontWeight="bold"
              variant="h6"
              >
              {room.event.titre}

              </Typography>:null}
              <Carousel>
{              room.files.map((file)=>
    <FileCard  action={()=>handleDrawerToggle(file)} attachement={file} />

              )}
              </Carousel>
            </Box>
            </Grid>
          )
        }):
        <Grid  item xs={12} sm={12} >
        <Box>
        <Typography
        sx={{
          pl: 1
        }}
        fontWeight="bold"
        variant="h6"
        >
        you dont have files shared with you for the moment

        </Typography>
        </Box>
        </Grid>
        )}


        {tabs === 'table_view' && (
          <Grid item xs={12}>
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('Filename')}</TableCell>
                      <TableCell>{t('Owner')}</TableCell>
                      <TableCell>{t('Date Created')}</TableCell>
                      <TableCell align="right">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PictureAsPdfTwoToneIcon />
                          <Typography
                            sx={{
                              pl: 1
                            }}
                            variant="h6"
                          >
                            PresentationDeck.pdf
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Link href="#" variant="h6">
                            You
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" noWrap>
                          {formatDistance(subDays(new Date(), 54), new Date(), {
                            addSuffix: true
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('View')} arrow>
                          <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <LaunchTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Delete')} arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.error.lighter
                              },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <TextSnippetTwoToneIcon />
                          <Typography
                            sx={{
                              pl: 1
                            }}
                            variant="h6"
                          >
                            2021Screenshot.jpg
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              mr: 1
                            }}
                            src="/static/images/avatars/3.jpg"
                          />
                          <Typography variant="h6" noWrap>
                            Kitty Herbert
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" noWrap>
                          {formatDistance(subDays(new Date(), 15), new Date(), {
                            addSuffix: true
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('View')} arrow>
                          <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <LaunchTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Delete')} arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.error.lighter
                              },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <TextSnippetTwoToneIcon />
                          <Typography
                            sx={{
                              pl: 1
                            }}
                            variant="h6"
                          >
                            FileTransfer.txt
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              mr: 1
                            }}
                            src="/static/images/avatars/4.jpg"
                          />
                          <Typography variant="h6" noWrap>
                            Ash Carleton
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" noWrap>
                          {formatDistance(subDays(new Date(), 32), new Date(), {
                            addSuffix: true
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('View')} arrow>
                          <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <LaunchTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Delete')} arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.error.lighter
                              },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <ArchiveTwoToneIcon />
                          <Typography
                            sx={{
                              pl: 1
                            }}
                            variant="h6"
                          >
                            HolidayPictures.zip
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Link href="#" variant="h6">
                            You
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" noWrap>
                          {formatDistance(subDays(new Date(), 19), new Date(), {
                            addSuffix: true
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('View')} arrow>
                          <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <LaunchTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Delete')} arrow>
                          <IconButton
                            sx={{
                              '&:hover': {
                                background: theme.colors.error.lighter
                              },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        )}

        {!tabs && (
          <Grid item xs={12}>
            <Card
              sx={{
                textAlign: 'center',
                p: 3
              }}
            >
              <Typography
                align="center"
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
                sx={{
                  my: 5
                }}
                gutterBottom
              >
                {t(
                  'This is a default view used when none of the options are selected'
                )}
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>
      <Drawer
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'left' : 'right'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        elevation={9}
      >
        {mobileOpen && <SidebarDrawer file={selectedFile} />}
      </Drawer>
    </>
  );
}

export default QuickAccess;
