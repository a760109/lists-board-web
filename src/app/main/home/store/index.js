import { combineReducers } from '@reduxjs/toolkit';
import tasks from './tasksSlice';

const homeReducers = combineReducers({
  tasks,
});

export default homeReducers;
