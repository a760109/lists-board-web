import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export const getUsers = createAsyncThunk('users/getUsers', (values, { extra }) => {
  return extra.api.get(`/users`);
});

const initialState = {
  accounts: [],
};

const tasksSlice = createSlice({
  name: 'home/tasks',
  initialState,
  extraReducers: {
    [getUsers.fulfilled]: (state, action) => {
      state.accounts = action.payload.data.result;
    },
  },
});

export default tasksSlice.reducer;
