
import { useSelector } from "react-redux";
import { checkAccess } from "../utils/permissionUtils";

export const usePermission = (screenKey) => {
  const permissions = useSelector((state) => state.authorization.permissions);
  return checkAccess(permissions, screenKey);
};
