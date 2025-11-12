import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React from "react"; // Added React import for component definitions
import "./App.css";

// --- Components ---
import Header from "./components/HeaderComponents/Header";
import SideBarContainer from "./containers/SideBar-container/SideBarContainer";
import ApplicationModuleContainer from "./containers/Application-module-container/ApplicationModuleContainer";

import LoginContainer from "./components/login-components/LoginContainer";

// --- Redux ---
import { store, persistor } from "./redux/store"; 
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// 🔑 Assuming these utility components/hooks exist
import PermissionGuard from "./hooks/PermissionGuard"; // The guard you defined
// import { useAuth } from "./hooks/useAuth"; // Placeholder for actual auth check

// --- Dummy Components (unchanged) ---
const Dashboard = () => <div>Dashboard</div>;
const Students = () => <div>Students</div>;
const Employee = () => <div>Employee</div>;
const Fleet = () => <div>Fleet</div>;
const Warehouse = () => <div>Warehouse</div>;
const Sms = () => <div>SMS</div>;
const QuestionBank = () => <div>Question Bank</div>;
const AssetsManagement = () => <div>Assets Management</div>;
const PaymentsService = () => <div>Payment Services</div>;
const Cctv = () => <div>CCTV</div>;
const Hrms = () => <div>HRMS</div>;
const Masters = () => <div>Masters</div>;


// --- 1. Central Authentication Guard ---
// 🔑 Checks if the user is logged in (via token in localStorage for this example).
const AuthGuard = ({ children }) => {
    // **IMPORTANT**: Use your actual authentication logic (e.g., checking Redux state or cookie)
    const isAuthenticated = localStorage.getItem('authToken') !== null; 

    if (isAuthenticated) {
        return children;
    } else {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />; 
    }
};

// Create the QueryClient instance
const queryClient = new QueryClient();

// 2. AppWrapper: Routes that require specific permissions
function AppWrapper() {
  return (
    <>
      <Header />

      <aside>
        <SideBarContainer />
      </aside>

      <div className="main_body">
        <Routes>
          {/* Default path inside scopes */}
          {/* <Route path="/" element={<Navigate to="dashboard" replace />} />  */}
          
          {/* 🔑 Protected Routes using PermissionGuard */}
          <Route 
            path="dashboard" 
            element={
              <PermissionGuard permissionKey="VIEW_DASHBOARD">
                <Dashboard />
              </PermissionGuard>
            } 
          />
          <Route 
            path="students" 
            element={
              <PermissionGuard permissionKey="VIEW_STUDENTS">
                <Students />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/application/*" 
            element={
              // Assuming 'APPLICATION_STATUS' covers the entire application module
              <PermissionGuard permissionKey="APPLICATION_STATUS">
                <ApplicationModuleContainer />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/employee" 
            element={
              <PermissionGuard permissionKey="VIEW_EMPLOYEE">
                <Employee />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/fleet" 
            element={
              <PermissionGuard permissionKey="ACCESS_FLEET">
                <Fleet />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/warehouse" 
            element={
              <PermissionGuard permissionKey="ACCESS_WAREHOUSE">
                <Warehouse />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/sms" 
            element={
              <PermissionGuard permissionKey="ACCESS_SMS">
                <Sms />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/question-bank" 
            element={
              <PermissionGuard permissionKey="ACCESS_QUESTION_BANK">
                <QuestionBank />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/assets-management" 
            element={
              <PermissionGuard permissionKey="ACCESS_ASSETS">
                <AssetsManagement />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/payments-service" 
            element={
              <PermissionGuard permissionKey="ACCESS_PAYMENTS">
                <PaymentsService />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/cctv" 
            element={
              <PermissionGuard permissionKey="ACCESS_CCTV">
                <Cctv />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/hrms" 
            element={
              <PermissionGuard permissionKey="ACCESS_HRMS">
                <Hrms />
              </PermissionGuard>
            } 
          />
          <Route 
            path="/masters" 
            element={
              <PermissionGuard permissionKey="ACCESS_MASTERS">
                <Masters />
              </PermissionGuard>
            } 
          />
          
          {/* Fallback for paths inside /scopes/* that don't match */}
          {/* PermissionGuard will handle redirecting users without permission from the current route to /scopes/dashboard */}
          <Route path="*" element={<Navigate to="/scopes" replace />} />
        </Routes>
      </div>
    </>
  );
}

// 3. App: Wraps protected routes with AuthGuard
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="scopes_app">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login/*" element={<LoginContainer />} />
                
                {/* Protected Routes: Check Authentication first */}
                <Route 
                  path="/scopes/*" 
                  element={
                    // 🔑 Wrap AppWrapper with AuthGuard
                    <AuthGuard>
                      <AppWrapper />
                    </AuthGuard>
                  } 
                />

                {/* Global Fallback for 404 / Unknown path */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;