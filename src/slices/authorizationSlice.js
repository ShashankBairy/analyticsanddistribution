// src/slices/authorizationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: {}, // e.g. { APPLICATION_ANALYTICS: "v", APPLICATION_STATUS: "all" }
  roles: [], // 🆕 store user roles like ["CASHIER", "DGM"]
  employeeId: null,
};

const authorizationSlice = createSlice({
  name: "authorization",
  initialState,
  reducers: {
    setRolePermissions: (state, action) => {
      const { mergedPermissions, roles } = action.payload || {};
      state.permissions = mergedPermissions || {};
      state.roles = roles || [];
    },
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload ?? null;
    },
    logout: (state) => {
      state.permissions = {};
      state.roles = [];
      state.employeeId = null;
    },
  },
});

export const { setRolePermissions, setEmployeeId, logout } =
  authorizationSlice.actions;

export default authorizationSlice.reducer;
