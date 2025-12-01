import { SCREEN_KEY_MAP } from "../constants/screenKeyMapping";

/**
 * rolesPermissions structure expected:
 * {
 *   ADMIN: [
 *     { screen_name: "screen1", permission_name: "all" },
 *     { screen_name: "screen10", permission_name: "v" }
 *   ]
 * }
 */

export const mergeAllRolePermissions = (rolesPermissions = {}) => {
  const mergedScreens = {};   // screen1 → Set("all")
  const extractedRoles = [];  // ["ADMIN"]

  // ---------------------------
  // 1️⃣ Aggregate per role
  // ---------------------------
  for (const role in rolesPermissions) {
    extractedRoles.push(role);

    rolesPermissions[role].forEach(({ screen_name, permission_name }) => {
      if (!mergedScreens[screen_name]) {
        mergedScreens[screen_name] = new Set();
      }
      mergedScreens[screen_name].add(permission_name);
    });
  }

  // ---------------------------
  // 2️⃣ Build final permission object
  // ---------------------------
  const finalPermissions = {};

  Object.entries(mergedScreens).forEach(([backendScreen, permsSet]) => {
    const perms = [...permsSet];

    // Decide access level
    const accessLevel =
      perms.length === 1 && perms.includes("v") ? "v" : "all";

    // Check if screen exists in SCREEN_KEY_MAP
    const mappedKey = SCREEN_KEY_MAP[backendScreen];

    if (mappedKey) {
      // Use mapped key (example: screen1 → APPLICATION_ANALYTICS)
      finalPermissions[mappedKey] = accessLevel;
    } else {
      // Use original backend key (screen10) when mapping is not found
      finalPermissions[backendScreen] = accessLevel;
    }
  });

  return {
    mergedPermissions: finalPermissions,
    roles: extractedRoles,
  };
};
