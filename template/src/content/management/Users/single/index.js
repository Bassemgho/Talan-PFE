import { useState, useCallback, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { Box, Tabs, Tab, Grid, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import ProfileCover from './ProfileCover';
// import RecentActivity from './RecentActivity';
// import Feed from './Feed';
// import PopularTags from './PopularTags';
// import MyCards from './MyCards';
// import Addresses from './Addresses';
// import ActivityTab from './ActivityTab';
import EditProfileTab from './EditProfileTab';
// import NotificationsTab from './NotificationsTab';
// import SecurityTab from './SecurityTab';

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

function ManagementUsersView() {
  const isMountedRef = useRefMounted();
  const [user, setUser] = useState(null);

  const { userId } = useParams();
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState('edit_profile');

  const tabs = [
    // { value: 'activity', label: t('Activity') },
    { value: 'edit_profile', label: t('Edit Profile') },
    // { value: 'notifications', label: t('Notifications') },
    // { value: 'security', label: t('Passwords/Security') }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/getuser/${userId}`);
      if (isMountedRef.current) {
        response.data.user.name = `${response.data.user.firstname} ${response.data.user.lastname}`
        response.data.user.jobtitle=response.data.user.jobtitle||'not specified'
        response.data.user.followers=0
        setUser(response.data.user);
      }
    } catch (err) {
      console.error(err);
    }
  }, [userId, isMountedRef]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{user.firstname} - Profile Details</title>
      </Helmet>
      <Box
        sx={{
          mt: 3
        }}
      >
        <Grid
          sx={{
            px: 4
          }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >

  <Grid item xs={12} md={8}>
            <ProfileCover user={user} />
          </Grid>
{
          // <Grid item xs={12} md={4}>
          //   <RecentActivity />
          // </Grid>
          // <Grid item xs={12} md={8}>
          //   <Feed />
          // </Grid>
          // <Grid item xs={12} md={4}>
          //   <PopularTags />
          // </Grid>
          // <Grid item xs={12} md={7}>
          //   <MyCards />
          // </Grid>
          // <Grid item xs={12} md={5}>
          //   <Addresses />
          // </Grid>
        }
          <Grid item xs={12}>
            <TabsWrapper
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
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>

            {currentTab === 'edit_profile' && <EditProfileTab />}


          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default ManagementUsersView;
