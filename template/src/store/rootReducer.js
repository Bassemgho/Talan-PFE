import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as mailboxReducer } from 'src/slices/messenger';

const rootReducer = combineReducers({
  calendar: calendarReducer,

  messenger: mailboxReducer
});

export default rootReducer;
