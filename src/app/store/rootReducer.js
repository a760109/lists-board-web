import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';

const createReducer = asyncReducers => (state, action) => {
  const combinedReducer = combineReducers({
    auth,
    ...asyncReducers,
  });

  return combinedReducer(state, action);
};

export default createReducer;
