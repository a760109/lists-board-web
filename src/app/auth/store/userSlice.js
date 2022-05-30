import { createSlice, createAction } from '@reduxjs/toolkit';

export const exchangeToken = createAction('user/exchangeToken', (idToken, userData) => {
  const payload = {
    ...userData,
    idToken,
  };
  return {
    payload,
  };
});

export const clearToken = createAction('user/clearToken', () => {
  localStorage.clear();
  return {};
});

const initialState = {
  isAuthenticated: false,
  userData: {},
};

const userSlice = createSlice({
  name: 'auth/user',
  initialState,
  extraReducers: {
    [exchangeToken]: (state, action) => {
      return {
        ...state,
        userData: action.payload,
        isAuthenticated: true,
      };
    },
    [clearToken]: state => initialState,
  },
});

export default userSlice.reducer;
