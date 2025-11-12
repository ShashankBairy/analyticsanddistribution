// Normalize API response fields
export const normalizeApiResponse = (data) => {
  const getFullName = (emp) =>
    emp && emp.first_name && emp.last_name
      ? `${emp.first_name} ${emp.last_name}`
      : emp?.name || "";
  return data.map((item) => ({
    ...item,
    applicationNo: item.num || item.applicationNo || item.application_no || "",
    zone: item.zone_name || item.zonal_name || item.zone || item.zoneName || "",
    zoneEmpId: item.zoneEmpId || item.zone_emp_id || null,
    campus: item.cmps_name || item.campus || item.campusName || "",
    campusId: item.cmps_id || item.campusId || item.campus_id || null,
    pro:
      item.pro_name ||
      item.pro ||
      item.proName ||
      getFullName(item.pro_employee) ||
      "",
    proId: item.proId || item.pro_id || null,
    dgm:
      item.dgm_name ||
      item.dgm ||
      item.dgmName ||
      getFullName(item.dgm_employee) ||
      "",
    dgmEmpId: item.dgmEmpId || item.dgm_emp_id || null,
    status: item.status || "",
    statusId: item.statusId || item.status_id || null,
    reason: item.reason || "",
    isSelected: !!item.isSelected,
  }));
};
