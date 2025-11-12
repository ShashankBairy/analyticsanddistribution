import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permissions: {}, // merged per-screen permissions like {APPLICATION_ANALYTICS: "v", ...}
  employeeId: null,
};

const authorizationSlice = createSlice({
  name: "authorization",
  initialState,
  reducers: {
    setRolePermissions: (state, action) => {
      // action.payload should be the mergedPermissions object
      state.permissions = action.payload || {};
    },
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload ?? null;
    },
    logout: (state) => {
      state.permissions = {};
      state.employeeId = null;
    },
  },
});

export const { setRolePermissions, setEmployeeId, logout } =
  authorizationSlice.actions;

export default authorizationSlice.reducer;
