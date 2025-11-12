
export const formatPermissions = (data) => {
  const formatted = {};

  for (const role in data) {
    formatted[role] = {};

    const roleData = data[role];
    const screenMap = {};

    roleData.forEach(({ screen_name, permission_name }) => {
      if (!screenMap[screen_name]) screenMap[screen_name] = new Set();
      screenMap[screen_name].add(permission_name);
    });

    for (const screen in screenMap) {
      const perms = [...screenMap[screen]];
      // 👉 only “v” = view; anything else = all
      formatted[role][screen] =
        perms.length === 1 && perms.includes("v") ? "v" : "all";
    }
  }

  return formatted;
};
