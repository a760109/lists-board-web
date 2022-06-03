import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import home from 'app/main/home/store';
import message from './messageSlice';

const createReducer = asyncReducers => (state, action) => {
  const combinedReducer = combineReducers({
    message,
    auth,
    home,
    ...asyncReducers,
  });

  return combinedReducer(state, action);
};

export default createReducer;
