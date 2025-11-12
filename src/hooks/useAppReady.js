import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// Import the special Redux-Persist selector
import { selectPersistReady } from 'redux-persist/integration/react'; // You might need to check the exact path for your setup, or use a manual check against the _persist key.
// A simpler way without a specific import:
export const useAppReady = () => {
  const [isReady, setIsReady] = useState(false);
  // Ensure you are using the <PersistGate> at your app root.
  const { permissions } = useSelector((state) => state.authorization);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const hasPermissions = permissions && Object.keys(permissions).length > 0;

    // Check instantly, no delay needed if PersistGate is handling initial mount
    if (token && hasPermissions) {
      console.log("[useAppReady] ✅ App ready with permissions:", permissions);
      setIsReady(true);
    } else {
      console.log("[useAppReady] ⏳ Waiting for permissions/token...");
      setIsReady(false); // Ensure it resets if token is removed/permissions cleared
    }

  }, [permissions, token]); // will re-run when permissions are hydrated/set

  return { isAppReady: isReady };
};