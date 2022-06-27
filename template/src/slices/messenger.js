/*eslint-disable*/
import { createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import objectArray from 'src/utils/objectArray';

const initialState = {
  users:[],
  chats: [],
  // tags: [],
  chat:{},
  selectedChat:null,
  sidebarOpen: false
};

const slice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    getUsers(state,action) {
      const {users } = action.payload
      state.users = users
    },

    getChats(state, action) {
      const { chats } = action.payload;
      state.chats = chats
      // state.mails.byId = objectArray(mails);
      // state.mails.allIds = Object.keys(state.mails.byId);
    },
    getChat(state, action) {
      const { chat } = action.payload;
      state.chat = chat
    },
    createChat(state,action) {
      const {chat} = action.payload
        state.chats = state.chats.concat([chat])
    },
    selectChat(state,action) {
      const {chat} = action.payload
      state.selectedChat = chat
    },
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    }
  }
});

export const reducer = slice.reducer;

export const getUsers = () => async (dispatch) => {

  try {
    const response = await axios.get('http://localhost:5000/allusers');
    dispatch(slice.actions.getUsers(response.data))
  } catch (e) {
    console.log(e);
  }
}
export const getChats = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:5000/chat/getuserchats")
    dispatch(slice.actions.getChats(response.data))

  } catch (e) {
    console.log(e);
  }
}
export const getChat = (chatid) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/chat/getuserchat/${chatid}`)
      dispatch(slice.actions.getChat(response.data))

  } catch (e) {
    console.log(e);
  }

}

export const selectChat = (chatid) => async (dispatch) => {
  dispatch(slice.actions.selectChat(chatid))
}
export const createChat = (ids)=> async (dispatch) => {
  console.log('ids',ids);
  const l = ids.map((v,i)=>v.value)
  try {
    const response = await axios.post('http://localhost:5000/chat/createchat',{participants:l})
    if (response.data.success) {
      dispatch(slice.actions.createChat(response.data))

    }

  } catch (e) {
    console.log(e);
  }

}
// export const sendmessage = () => async (dispatch) => {
//
// }

// export const getTags = () => async (dispatch) => {
//   const response = await axios.get('/api/mailbox/tags');
//
//   dispatch(slice.actions.getTags(response.data));
// };
//
// export const getMails = (params) => async (dispatch) => {
//   const response = await axios.get('/api/mailbox/mails', {
//     params
//   });
//
//   dispatch(slice.actions.getMails(response.data));
// };
//
// export const getMail = (mailboxCategory) => async (dispatch) => {
//   const response = await axios.get('/api/mailbox/mail', {
//     params: {
//       mailboxCategory
//     }
//   });
//
//   dispatch(slice.actions.getMail(response.data));
// };

export const openSidebar = () => async (dispatch) => {
  dispatch(slice.actions.openSidebar());
};

export const closeSidebar = () => async (dispatch) => {
  dispatch(slice.actions.closeSidebar());
};

export default slice;
