export const checkAccess = (permissions, screenKey) => {
  const level = permissions?.[screenKey];
  return {
    canView: level === "v" || level === "all",
    isFullAccess: level === "all",
  };
};
