import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import _ from 'lodash';

export const getTasksData = createAsyncThunk('tasks/getData', (values, { extra }) => {
  return extra.api.get(`/tasks`);
});

export const createTask = createAsyncThunk('tasks/createTask', (values, { extra }) => {
  return extra.api.post(`/tasks`, values);
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', (values, { extra }) => {
  return extra.api.delete(`/tasks/${values.id}`, values);
});

export const deleteSubtask = createAsyncThunk('tasks/deleteSubtask', (values, { extra }) => {
  return extra.api.delete(`/tasks/job/${values.id}`, values);
});

export const createSubtask = createAsyncThunk('tasks/createSubtask', (values, { extra }) => {
  return extra.api.post(`/tasks/job`, values);
});

export const updateTask = createAsyncThunk('tasks/createTask', (values, { extra }) => {
  return extra.api.put(`/tasks`, values);
});

export const updateSubtask = createAsyncThunk('tasks/createSubtask', (values, { extra }) => {
  return extra.api.put(`/tasks/job`, values);
});

const initialState = {
  tasks: {},
  jobs: {},
};

const parserDatas = data => {
  const tasks = data.tasks.rows.reduce((m, task) => {
    task.id = _.toNumber(task.id);

    task.pendingCount = 0;
    task.doneCount = 0;
    task.doneCost = 0;

    m[task.id] = task;
    return m;
  }, {});

  const jobs = data.jobs.rows.reduce((m, job) => {
    job.taskId = _.toNumber(job.taskId);
    job.id = _.toNumber(job.id);
    job.cost = _.toNumber(job.cost);
    job.price = _.toNumber(job.price);

    if (!(job.taskId in m)) {
      m[job.taskId] = [];
    }

    if (job.status === 'pending') {
      tasks[job.taskId].pendingCount += 1;
    } else {
      tasks[job.taskId].doneCount += 1;
      tasks[job.taskId].doneCost += job.cost;
    }

    m[job.taskId].push(job);
    return m;
  }, {});

  for (let task of Object.values(tasks)) {
    let total = task.pendingCount + task.doneCount;
    task.progress = ((task.doneCount * 100) / total) | 0;
    if (total === 0 || task.progress === 100) {
      task.status = 'done';
    } else if (task.progress === 0) {
      task.status = 'pending';
    } else {
      task.status = 'process';
    }
  }

  return {
    tasks,
    jobs,
  };
};

const updateData = (state, action) => {
  const datas = parserDatas(action.payload.data.result);
  return {
    ...state,
    tasks: datas.tasks,
    jobs: datas.jobs,
  };
};

const tasksSlice = createSlice({
  name: 'home/tasks',
  initialState,
  extraReducers: {
    [getTasksData.fulfilled]: updateData,
    [createTask.fulfilled]: updateData,
    [createSubtask.fulfilled]: updateData,
    [updateTask.fulfilled]: updateData,
    [updateSubtask.fulfilled]: updateData,
    [deleteTask.fulfilled]: updateData,
    [deleteSubtask.fulfilled]: updateData,
  },
});

export default tasksSlice.reducer;
