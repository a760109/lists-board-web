import { combineReducers } from '@reduxjs/toolkit';
import tasks from './tasksSlice';
import users from './usersSlice';

const homeReducers = combineReducers({
  tasks,
  users,
});

export default homeReducers;
