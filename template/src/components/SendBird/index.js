
import React from "react";
import useAuth from 'src/hooks/useAuth';

import SBProvider from "@sendbird/uikit-react/SendbirdProvider";
import "@sendbird/uikit-react/dist/index.css";


import CustomizedApp from "./CustomizedApp";
import "./styles.css";

import { APP_ID  } from "./const";

export default function SBapp() {
  const {user} = useAuth()
  if (!APP_ID) {
    return (
      <p>Set APP_ID in const.js</p>
    )
  }
  return (
    <SBProvider appId={APP_ID} userId={user._id} nickname={`${user.firstname} ${user.lastname}`} >
      <CustomizedApp />
    </SBProvider>
  );
}
