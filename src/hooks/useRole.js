// src/hooks/useRole.js
import { useSelector } from "react-redux";
import { checkRole } from "../utils/permissionUtils";

/**
 * Custom hook to check if current user has a specific role
 * @example
 * const { hasRole } = useRole("DGM");
 */
export const useRole = (targetRole) => {
  const roles = useSelector((state) => state.authorization.roles);
  const hasRole = checkRole(roles, targetRole);

  return { hasRole, roles };
};
