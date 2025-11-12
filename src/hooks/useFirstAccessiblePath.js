// hooks/useFirstAccessiblePath.js (New File)
import { useSelector } from "react-redux";
import { TAB_SCREEN_MAPPING } from "../constants/tabScreenMapping"; // Ensure path is correct
import { tabs } from "../components/application-analytics/application-details-nav-links/applications-nav-links-component/links"; // Ensure path is correct

export const useFirstAccessiblePath = () => {
  const permissions = useSelector((state) => state.authorization.permissions);

  // If permissions aren't loaded, we can't determine the path yet
  if (!permissions || Object.keys(permissions).length === 0) {
    return null; 
  }

  const firstVisibleTab = tabs.find((tab) => {
    const relatedScreens = TAB_SCREEN_MAPPING[tab.id] || [];
    // A tab is visible if at least one of its required screens has a permission entry
    return relatedScreens.some((screenKey) => permissions?.[screenKey]);
  });

  // Return the full relative URL path (e.g., "analytics")
  return firstVisibleTab ? firstVisibleTab.path : null;
};