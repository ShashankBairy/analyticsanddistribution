// PermissionGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from './usePermission '; 
// import UnauthorizedPage from './UnauthorizedPage'; // A component to show access denied message
// import Loader from './Loader'; // Your global loader component

/**
 * Guards a route, ensuring the user has at least view permission for the given key.
 * @param {string} permissionKey - The key corresponding to the required permission (e.g., 'APPLICATION_STATUS').
 * @param {React.ReactNode} children - The component to render if permission is granted.
 */
const PermissionGuard = ({ permissionKey, children }) => {
    // 1. Fetch the necessary permission status
    const { canView, isLoading } = usePermission(permissionKey);

    // 2. Handle loading state (using the simple string "Loading" for now)
    if (isLoading) {
        return "Loading";
    }

    // 3. Check for permission
    if (canView) {
        // User has permission, render the component
        return children;
    } else {
        // 🔑 Redirect unauthorized users to the dashboard route within the scopes area.
        // This keeps the user authenticated but prevents them from seeing restricted pages.
        return <Navigate to="/scopes" replace />; 
    }
};

export default PermissionGuard;