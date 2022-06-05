/* eslint-disable */
import React, { useEffect , useState , useRef,useContext} from 'react';

import { useSnackbar } from 'notistack';

import { useTranslation } from 'react-i18next';

import { Formik } from 'formik';

import * as Yup from 'yup';

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
  Button
} from '@mui/material';
import {PollDialogueContext} from 'src/contexts/PollDialogueContext.js'

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import Scrollbar from 'src/components/Scrollbar';



import axios from 'axios'
import io from 'socket.io-client';

import {useParams} from 'react-router-dom'

import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';

import socket from 'src/socket.js'
import Vote from 'src/content/blocks/ProgressHorizontal/Block5.js'

function AllVotesDialogue({open,onClose}) {

  const {allpolls,setAllpolls} = useContext(PollDialogueContext)

  const {eventid} = useParams()
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const isMountedRef = useRefMounted(true);
  // isMountedRef.current=true

  useEffect( async () => {

    const getAllpolls = async() => {
      try {
        if (isMountedRef.current) {

        const res = await axios.get('http://localhost:5000/getAllpolls',{id:eventid})
          if (res.data.success==true) {
            return res.data.all
          }
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    const all = await  getAllpolls()
    console.log('ALL',all);
    setAllpolls(all)
  },[isMountedRef.current])

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      fullScreen={true}
    >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('All the votes in this event')}
        </Typography>
        <Typography variant="subtitle2">
          {t(
            'you can check all the polls in this pop up'
          )}

        </Typography>
      </DialogTitle>
      <Button lg={4} onClick={() => {
        console.log(allpolls);
      }} >log all</Button>
      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
      <Scrollbar>

       <Grid container spacing={3} >
          {allpolls && allpolls.map((poll,index) =>{
            return(
               <Grid item key={index} xs={6} lg={4}  >
              <Vote poll={poll} disabled={true} />
            </Grid>
          )
          }


          )}
        </Grid>
      </Scrollbar>
      </DialogContent>




    </Dialog>


  );
}
export default AllVotesDialogue;
