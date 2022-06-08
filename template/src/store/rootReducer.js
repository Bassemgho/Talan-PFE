import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as mailboxReducer } from 'src/slices/mailbox';

const rootReducer = combineReducers({
  calendar: calendarReducer,

  mailbox: mailboxReducer
});

export default rootReducer;
