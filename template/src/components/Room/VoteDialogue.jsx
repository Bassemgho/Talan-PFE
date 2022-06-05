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



import io from 'socket.io-client';

import {useParams} from 'react-router-dom'

import useAuth from 'src/hooks/useAuth';

import socket from 'src/socket.js'
import Vote from 'src/content/blocks/ProgressHorizontal/Block5.js'

function VoteDialogue({open,onClose}) {
  const {openVote,closeVote,setpoll,poll} = useContext(PollDialogueContext)

  const {eventid} = useParams()
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
return (


<Dialog
  fullWidth
  maxWidth="md"
  open={open}
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
  <Vote poll={poll} disabled={false}/>

</Dialog>
);
}
export default VoteDialogue
