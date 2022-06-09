/* eslint-disable */
import { useState, useEffect, useCallback ,useRef} from 'react';

import axios from 'axios';

import useRefMounted from 'src/hooks/useRefMounted';

import PropTypes from 'prop-types';
import { setHours, setMinutes, subDays } from 'date-fns';
import _ from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { styled } from '@mui/material/styles';
import  Select from 'react-select'

import {
  Box,
  Card,
  TextField,
  Button,
  IconButton,
  Divider,
  FormControlLabel,
  Grid,
  Alert,
  Checkbox,
  CircularProgress,
  Tooltip,
  Typography,
  lighten,
  Zoom
} from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import { useDispatch } from 'src/store';
import { createEvent, updateEvent, deleteEvent } from 'src/slices/calendar';
import { useTranslation } from 'react-i18next';

const CustomSelect = styled(Select)(
  ({ theme })=>`
    margin-top:10px;
    margin-bottom:10px;

    `)
const IconButtonError = styled(IconButton)(
  ({ theme }) => `
     background: ${theme.colors.error.lighter};
     color: ${theme.colors.error.main};

     &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
     }
`
);

const CardActionsWrapper = styled(Card)(
  ({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     box-shadow: none;
     margin: 0 ${theme.spacing(3)};
`
);

const getInitialValues = (event, range) => {
  if (event) {
    return _.merge(
      {},
      {
        allDay: false,
        color: '',
        description: '',
        end: setHours(setMinutes(subDays(new Date(), 3), 30), 10),
        start: setHours(setMinutes(subDays(new Date(), 3), 60), 8),
        title: '',
        submit: null,
        participants: [],
        mods: [],
      },
      event
    );
  }

  if (range) {
    return _.merge(
      {},
      {
        allDay: false,
        color: '',
        description: '',
        end: new Date(range.end),
        start: new Date(range.start),
        title: '',
        submit: null,
        participants: [],
        mods: [],

      },
      event
    );
  }

  return {
    allDay: false,
    color: '',
    description: '',
    end: setHours(setMinutes(subDays(new Date(), 1), 35), 20),
    start: setHours(setMinutes(subDays(new Date(), 1), 25), 17),
    title: '',
    submit: null
  };
};

const EventDrawer = ({
  event,
  onAddComplete,
  onCancel,
  onDeleteComplete,
  onEditComplete,
  range
}) => {
  const participantsRef = useRef();
  const modsRef = useRef();

  const isMountedRef = useRefMounted();

  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const arr =[];
      const data = []
      let ob

      const response = await axios.get('http://localhost:5000/allusers');
      response.data.users.forEach((user,id)=>{

        user.id = id
        user.name = `${user.firstname} ${user.lastname}`
        user.jobtitle = 'not specified'
        user.username = 'not specified'
        user.location = 'tunis'
        user.description = 'description not specified'
        user.role = user.role||'user'
        user.value = user.email
        user.label = user.name

        arr.push(user)

      })
      if (isMountedRef.current) {
        setUsers(response.data.users);
        console.log(arr);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);
const getOptions = ()=>{
  const options = users.map((user,index)=>{
    return {label:user.email,value:user.email}

  })
  console.log('options',options)
  return options
}
  useEffect(() => {

    getUsers();

  }, [getUsers]);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const isCreating = !event;

  const handleDelete = async () => {
    try {
      dispatch(deleteEvent(event._id));
      onDeleteComplete();

      enqueueSnackbar(t('The event has been deleted'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
        },
        TransitionComponent: Zoom
      });
    } catch (err) {
      console.error(err);
    }
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  const handleJoin = ()=>{
    openInNewTab(`http://localhost:3000/rooms/${event._id}`)

  }

  const { t } = useTranslation();
  // const getUsers = async () => {
  //   try {
  //     axios.get('http://localhost:5000/')
  //   } catch (e) {
  //     throw new Error(e)
  //   }
  // }

  return (
    <Formik
      initialValues={getInitialValues(event, range)}
      validationSchema={Yup.object().shape({
        allDay: Yup.bool(),
        description: Yup.string().max(5000),
        end: Yup.date().when(
          'start',
          (start, schema) =>
            start &&
            schema.min(start, t('The end date should be after start date'))
        ),
        start: Yup.date(),
        title: Yup.string().max(255).required(t('The title field is required'))
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          const data = {
            allDay: values.allDay,
            description: values.description,
            end: values.end,
            start: values.start,
            title: values.title,
            participants:values.participants,
            mods:values.mods
          };

          if (event) {
            dispatch(updateEvent(event._id, data));
          } else {
            dispatch(createEvent(data));
          }

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar(t('The calendar has been successfully updated!'), {
            variant: 'success',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center'
            },
            TransitionComponent: Zoom
          });

          if (isCreating) {
            onAddComplete();
          } else {
            onEditComplete();
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
        <Button onClick={()=>{console.log('values',values.participants)}}>log all</Button>
          <Box p={3}>
            <Typography variant="h4">
              {isCreating
                ? t('Create new calendar event')
                : t('Edit calendar event')}
            </Typography>
          </Box>
          <Divider />
          <Box px={3} py={2}>
            <TextField
              error={Boolean(touched.title && errors.title)}
              fullWidth
              helperText={touched.title && errors.title}
              label={t('Event title')}
              name="title"
              margin="normal"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
              options={users}
              variant="outlined"
            />
            <CustomSelect
              className = 'select'
              ref={participantsRef}
              isMulti
              options={getOptions()}
              error={Boolean(touched.participant && errors.participants)}
              fullWidth
              helperText={touched.participant && errors.participants}
              placeholder={t('Event Participants')}
              name="participants"
              margin="normal"
              onBlur={handleBlur}
              onChange={(e) => {
                console.log(e)
                setFieldValue('participants',e);
              }}
              value={values.participants}
              variant="outlined"
            />
            <CustomSelect
              className = 'select'
              ref={modsRef}
              isMulti
              options={getOptions()}
              error={Boolean(touched.mods && errors.mods)}
              fullWidth
              helperText={touched.mods && errors.mods}
              placeholder={t('Event Moderators')}
              name="mods"
              margin="normal"
              onBlur={handleBlur}
              onChange={(e) => {setFieldValue('mods',e);}}
              value={values.mods}
              variant="outlined"
            />


            <TextField
              error={Boolean(touched.description && errors.description)}
              fullWidth
              multiline
              minRows={3}
              helperText={touched.description && errors.description}
              label={t('Event description')}
              name="description"
              margin="normal"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              variant="outlined"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={values.allDay}
                  onChange={handleChange}
                  name="allDay"
                  color="primary"
                />
              }
              label={t('This event lasts all day')}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  value={values.start}
                  onChange={(date) => setFieldValue('start', date)}
                  label={t('Event start date')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      name="start"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  value={values.end}
                  onChange={(date) => setFieldValue('end', date)}
                  label={t('Event end date')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      name="end"
                    />
                  )}
                />
              </Grid>
            </Grid>
            {Boolean(touched.end && errors.end) && (
              <Alert
                sx={{
                  mt: 2,
                  mb: 1
                }}
                severity="error"
              >
                {errors.end}
              </Alert>
            )}
          </Box>
          <CardActionsWrapper
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2
            }}
          >
            <Box>
              {!isCreating && (
                <Tooltip arrow title={t('Delete this event')}>
                  <IconButtonError onClick={() => handleDelete()}>
                    <DeleteTwoToneIcon />
                  </IconButtonError>
                </Tooltip>
              )}
            </Box>
            <Box>
            <Button
              variant="outlined"
              sx={{
                mr: 1
              }}
              color="secondary"
              onClick={handleJoin}
            >
              {t('Join')}
            </Button>
              <Button
                variant="outlined"
                sx={{
                  mr: 1
                }}
                color="secondary"
                onClick={onCancel}
              >
                {t('Cancel')}
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                color="primary"
              >
                {isCreating ? t('Add meeting') : t('Save modifications')}
              </Button>
            </Box>
          </CardActionsWrapper>
        </form>
      )}
    </Formik>
  );
};

EventDrawer.propTypes = {
  event: PropTypes.object,

  range: PropTypes.object,
  onAddComplete: PropTypes.func,
  onCancel: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func
};

EventDrawer.defaultProps = {
  onAddComplete: () => {},
  onCancel: () => {},
  onDeleteComplete: () => {},
  onEditComplete: () => {}
};

export default EventDrawer;
