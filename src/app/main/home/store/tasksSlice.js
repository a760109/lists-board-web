import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import _ from 'lodash';

export const getTasksData = createAsyncThunk('tasks/getData', (values, { extra }) => {
  return extra.api.get(`/tasks`);
});

export const createTask = createAsyncThunk('tasks/createTask', (values, { extra }) => {
  let resp = extra.api.post(`/tasks`, values);

  console.log(resp);

  const payload = {};
  return {
    payload,
  };
});

const initialState = {
  tasks: {},
  jobs: {},
};

const parserDatas = data => {
  const tasks = data.tasks.rows.reduce((m, task) => {
    m[task.id] = task;
    return m;
  }, {});

  const jobs = data.jobs.rows.reduce((m, job) => {
    // m[task.id] = task;
    return m;
  }, {});

  return {
    tasks,
    jobs,
  };
};

const tasksSlice = createSlice({
  name: 'home/tasks',
  initialState,
  extraReducers: {
    [getTasksData.fulfilled]: (state, action) => {
      const datas = parserDatas(action.payload.data.result);
      return {
        ...state,
        tasks: datas.tasks,
        jobs: datas.jobs,
      };
    },
  },
});

export default tasksSlice.reducer;
