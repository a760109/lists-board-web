import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: null,
  options: {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    autoHideDuration: 6000,
    message: 'Hi',
    variant: null,
  },
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    showMessage: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload,
      };
    },
    showSuccess: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        message: action.payload ?? 'Updated',
        variant: 'success',
      };
    },
    showWarning: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        message: action.payload,
        variant: 'warning',
      };
    },
    showError: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        message: action.payload,
        variant: 'error',
      };
    },
    hideMessage: (state, action) => {
      state.state = null;
    },
  },
});

export const { hideMessage, showMessage, showSuccess, showWarning, showError } = messageSlice.actions;

export default messageSlice.reducer;
