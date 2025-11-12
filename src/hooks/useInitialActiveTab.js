import { useMemo } from "react";
import { usePermission } from "./usePermission ";

/**
 * Hook to determine the initial active tab based on user permissions
 * Returns the first tab the user can interact with (has full access to)
 * Falls back to the first tab they can view if no interactive tabs available
 */
export const useInitialActiveTab = () => {
  // Get permissions for all tabs
  const zonePerms = usePermission("DISTRIBUTE_ZONE");
  const dgmPerms = usePermission("DISTRIBUTE_DGM");
  const campusPerms = usePermission("DISTRIBUTE_CAMPUS");

  const initialActiveTab = useMemo(() => {
    const TAB_PERMISSIONS = [
      { label: "Zone", key: "DISTRIBUTE_ZONE" },
      { label: "DGM", key: "DISTRIBUTE_DGM" },
      { label: "Campus", key: "DISTRIBUTE_CAMPUS" },
    ];

    const permissionMap = {
      Zone: { ...zonePerms, canInteract: zonePerms.isFullAccess },
      DGM: { ...dgmPerms, canInteract: dgmPerms.isFullAccess },
      Campus: { ...campusPerms, canInteract: campusPerms.isFullAccess },
    };

    const tabAccess = TAB_PERMISSIONS.map((tab) => {
      const access = permissionMap[tab.label];
      return {
        ...tab,
        canView: access.canView,
        canInteract: access.canInteract,
      };
    });

    // Find the first interactable tab, or fall back to first viewable tab
    const firstInteractable = tabAccess.find((t) => t.canInteract)?.label;
    const firstViewable = tabAccess.find((t) => t.canView)?.label;

    return firstInteractable || firstViewable || "Zone";
  }, [zonePerms, dgmPerms, campusPerms]);

  return initialActiveTab;
};
