/* eslint-disable */

import { useState,useEffect,useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';
import Activate from 'src/content/pages/Activate';

const Activated = (props)=>{
  const { children } = props;
  const auth = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  const activate = useCallback(async function(){
    const user = auth.user;
    if (user.active ===false){
      const response = await axios.get('http://localhost:5000/auth/activate')
    }
  })
  if (!auth.user.active) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }
    return <Activate />;
  }
  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }
  return <>{children}</>;
};
Activated.propTypes = {
  children: PropTypes.node
};
export default Activated;
