import { SCREEN_KEY_MAP } from "../constants/screenKeyMapping"; 
// Assuming SCREEN_KEY_MAP is defined as: 
// { screen1: "APPLICATION_ANALYTICS", screen3: "DISTRIBUTE_DGM", ... }

export const mergeAllRolePermissions = (rolesPermissions) => {
  // 1. First Pass: Aggregate all unique permissions by the original screen_name.
  // The 'merged' object keys will be the backend's generic keys (e.g., 'screen1', 'screen3').
  const merged = {};

  for (const role in rolesPermissions) {
    rolesPermissions[role].forEach(({ screen_name, permission_name }) => {
      // Use screen_name as the key for aggregation
      if (!merged[screen_name]) {
        merged[screen_name] = new Set();
      }
      merged[screen_name].add(permission_name);
    });
  }

  // 2. Final Pass: Flatten permissions to "v" or "all" AND
  //    *** TRANSLATE THE KEY USING SCREEN_KEY_MAP ***
  const finalPermissions = {};
  for (const screenKeyFromBackend in merged) {
    const perms = [...merged[screenKeyFromBackend]]; // Set -> Array

    // Determine the access level: 'v' (view-only) or 'all' (full access).
    const accessLevel = 
      perms.length === 1 && perms.includes("v") ? "v" : "all";

    // Get the standard application screen key (e.g., "APPLICATION_ANALYTICS")
    const appScreenKey = SCREEN_KEY_MAP[screenKeyFromBackend];

    // Map the permission to the new, corrected application key
    if (appScreenKey) {
      finalPermissions[appScreenKey] = accessLevel;
    } else {
      // Optional: Log a warning if a backend key is missing from your map.
      console.warn(`[Permissions] Unmapped screen key received from API: ${screenKeyFromBackend}. Skipping.`);
    }
  }

  return finalPermissions;
};