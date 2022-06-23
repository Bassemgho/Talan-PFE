/* eslint-disable */
import {useState,useEffect,useCallback} from 'react'
import { Link as RouterLink,useParams } from 'react-router-dom';
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
  Container,
  Divider,
  Button,
  Tooltip,
  Alert,
  styled
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { useTranslation } from 'react-i18next';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';

import Text from 'src/components/Text';

import Label from 'src/components/Label';

import * as Yup from 'yup';
import { Formik } from 'formik';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import axios from 'axios'

import Logo from 'src/components/LogoSign';

import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';

const icons = {
  Auth0: '/static/images/logo/auth0.svg',
  FirebaseAuth: '/static/images/logo/firebase.svg',
  JWT: '/static/images/logo/jwt.svg',
  Amplify: '/static/images/logo/amplify.svg'
};

const CardImg = styled(Card)(
  ({ theme }) => `
    width: 90px;
    height: 80px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: ${theme.colors.alpha.white[100]};
    margin: 0 ${theme.spacing(1)};
    border: 1px solid ${theme.colors.alpha.black[10]};
    transition: ${theme.transitions.create(['all'])};

    &:hover {
      border-color: ${theme.colors.primary.main};
    }
`
);

const BottomWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(3)};
    display: flex;
    align-items: center;
    justify-content: center;
`
);

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

function ChangePass() {
  const { enqueueSnackbar } = useSnackbar();

  const { method } = useAuth();
  const { t } = useTranslation();
  const {token} = useParams()
  const [changeT,setChangeT] = useState('') ;
  const verifyToken = useCallback(async ()=>{
    try{
      const response = await axios.get(`http://localhost:5000/auth/activate/${token}`)
      if(response.data.success==true){
        setChangeT(response.data.token)
      }
    }catch(err){
      alert(err)
    }
  })
  useEffect(()=>{
    if(token){
      verifyToken();
    }
  },[])
  const handleChangePasswordSuccess = ()=>{

      enqueueSnackbar(t('The password was change successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      // setOpen(false);
    ;

  }

  return (
    <>
      <Helmet>
        <title>Changee Password</title>
      </Helmet>

      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Logo />
            <Card
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Change your password')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Fill in the fields below to Change your password.')}
                </Typography>
              </Box>
              <Box>
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
                    const config = {headers:{Authorization:`Bearer ${changeT}` }}

                    const response = await axios.post('http://localhost:5000/auth/activate/changepassword',_values,config)
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
                  </form>
                )}
              </Formik>

              </Box>


            </Card>
{/*            <BottomWrapper>
              <Tooltip arrow placement="top" title="Auth0">
                <CardImg>
                  <img height={50} alt="Auth0" src={icons.Auth0} />
                </CardImg>
              </Tooltip>
              <Tooltip arrow placement="top" title="Firebase">
                <CardImg>
                  <img height={50} alt="Firebase" src={icons.FirebaseAuth} />
                </CardImg>
              </Tooltip>
              <Tooltip arrow placement="top" title="JSON Web Token">
                <CardImg>
                  <img height={50} alt="JSON Web Token" src={icons.JWT} />
                </CardImg>
              </Tooltip>
              <Tooltip arrow placement="top" title="Amplify">
                <CardImg>
                  <img height={50} alt="Amplify" src={icons.Amplify} />
                </CardImg>
              </Tooltip>
            </BottomWrapper>
*/}

          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default ChangePass;
