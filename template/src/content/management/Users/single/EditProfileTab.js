/* eslint-disable */
import {useState} from 'react'
import axios from 'axios'
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Zoom,
  CircularProgress,
  Switch,
  Avatar,
  IconButton,
  Typography,
  CardContent,
  Card,TextField,
  Box,
  Divider,
  Button
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { useTranslation } from 'react-i18next';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import Text from 'src/components/Text';
import Label from 'src/components/Label';
import useAuth from 'src/hooks/useAuth';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';



function EditProfileTab() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [ isOpen,setOpen] = useState(false)
  const onClose = ()=>{
    setOpen(false)
  }
  const onOpen = ()=>{
    setOpen(true)
  }
  const handleOpenDialog = ()=>{
    onOpen()
  }
  const handleChangePasswordSuccess = ()=>{

      enqueueSnackbar(t('The password was change successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      setOpen(false);
    ;

  }

  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('Personal Details')}
              </Typography>
              <Typography variant="subtitle2">
                {t('Manage informations related to your personal details')}
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />}>
              {t('Edit')}
            </Button>
          </Box>
          <Divider />
          <CardContent
            sx={{
              p: 4
            }}
          >
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    {t('Name')}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>`${user.firstname} ${user.lastname}`</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sfirstnamem={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    {t('Date of birth')}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>not specified</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    {t('Address')}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box
                    sx={{
                      maxWidth: { xs: 'auto', sm: 300 }
                    }}
                  >
                    <Text color="black">
                      {user.adress||"not specified"}
                    </Text>
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('Account Settings')}
              </Typography>
              <Typography variant="subtitle2">
                {t('Manage details related to your account')}
              </Typography>
            </Box>
            <Button variant="text" startIcon={<EditTwoToneIcon />}>
              {t('Edit')}
            </Button>
          </Box>
          <Divider />
          <CardContent
            sx={{
              p: 4
            }}
          >
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    {t('Language')}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>English (US)</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    {t('Timezone')}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>GMT +2</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    {t('Account status')}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Label color="success">
                    <DoneTwoToneIcon fontSize="small" />
                    <b>{t('Active')}</b>
                  </Label>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('Password')}
              </Typography>
              <Typography variant="subtitle2">
                {t('Manage details related to your associated email addresses')}
              </Typography>
            </Box>
            <Button variant="text" onClick={onOpen} startIcon={<EditTwoToneIcon />}>
              {t('Edit')}
            </Button>
          </Box>
          <Divider />
          <CardContent
            sx={{
              p: 4
            }}
          >
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    {t('Email ID')}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>{user.email}</b>
                  </Text>
                  <Box pl={1} component="span">
                    <Label color="success">{t('Primary')}</Label>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    {t('Email ID')}:
                  </Box>
                </Grid>

              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
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
            {t('Change your password')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Fill in the fields below to change your password'
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            newpassword_re: '',
            oldpassword: '',
            newpassword: '',
            // last_name: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            oldpassword: Yup.string()
              .max(255)
              .required(t('The old password field is required')),
            newpassword: Yup.string()
              .max(255)
              .required(t('The new password field is required')),
            // last_name: Yup.string()
            //   .max(255)
            //   .required(t('The last name field is required')),
            newpassword_re: Yup.string()
              // .email(t('The newpassword_re provided should be a valid newpassword_re address'))
              .max(255)
              .required(t('The repeat password field is required')),
            answer3: Yup.string()
              .max(255)
              .required(t('The answer3 field is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            console.log('clic')
            try {
              // await wait(1000);
              console.log(_values);
              setSubmitting(true)
              let success = false
              const response = await axios.post('http://localhost:5000/auth/changepassword',_values)
              if(response.data.success==true){
                handleChangePasswordSuccess()
              }
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
                          error={Boolean(touched.oldpassword && errors.oldpassword)}
                          fullWidth
                          helperText={touched.oldpassword && errors.oldpassword}
                          label={t('Old password')}
                          name="oldpassword"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.oldpassword}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} >
                        <TextField
                          error={Boolean(
                            touched.newpassword && errors.newpassword
                          )}
                          fullWidth
                          helperText={touched.newpassword && errors.newpassword}
                          label={t('New password')}
                          name="newpassword"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.newpassword}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.newpassword_re && errors.newpassword_re)}
                          fullWidth
                          helperText={touched.newpassword_re && errors.newpassword_re}
                          label={t('repeat new password')}
                          name="newpassword_re"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.newpassword_re}
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
                  onClick={()=>handleSubmit()}
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {t('Change password')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

    </Grid>

  );
}

export default EditProfileTab;
