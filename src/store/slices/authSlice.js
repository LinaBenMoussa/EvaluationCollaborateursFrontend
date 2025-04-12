import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  token: null,
  role: null,
  firstName: null,
  lastName: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.id = action.payload.id;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
    logout: (state) => {
      state.id = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.firstName = null;
      state.lastName = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.id;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentNom = (state) => state.auth.lastName;
export const selectCurrentPrenom = (state) => state.auth.firstName;
