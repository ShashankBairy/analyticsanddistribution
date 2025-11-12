/**
 * Navigation utilities for ApplicationStatusTable
 * Eliminates code duplication in navigation handlers
 */

/**
 * Creates initial values object from row data
 * @param {Object} rowObj - Row object from table
 * @returns {Object} Initial values for navigation
 */
export const createInitialValues = (rowObj) => {
  return {
    applicationNo: rowObj.applicationNo || "",
    zoneName: rowObj.zone || rowObj.zonal_name || rowObj.zoneName || "",
    zone: rowObj.zone || rowObj.zonal_name || rowObj.zoneName || "",
    zoneEmpId: rowObj.zoneEmpId || rowObj.zone_emp_id || "",
    campusName: rowObj.campus || rowObj.cmps_name || rowObj.campusName || "",
    campus: rowObj.campus || rowObj.cmps_name || rowObj.campusName || "",
    campusId: rowObj.campusId || rowObj.campus_id || "",
    proName: rowObj.pro || rowObj.proName || rowObj.pro_name || "",
    proId: rowObj.proId || rowObj.pro_id || "",
    dgmName: rowObj.dgm || rowObj.dgmName || rowObj.dgm_name || "",
    dgmEmpId: rowObj.dgmEmpId || rowObj.dgm_emp_id || "",
    status: rowObj.status || "",
    statusId: rowObj.statusId || rowObj.status_id || "",
    reason: rowObj.reason || "",
    category: rowObj.category || rowObj.type || "college", // Add category field, default to college
  };
};

/**
 * Generic navigation handler that can be used for different status types
 * @param {Object} rowObj - Row object from table
 * @param {string} status - Status to navigate to
 * @param {Function} navigate - React Router navigate function
 * @param {string} route - Route path to navigate to
 */
export const handleNavigation = (rowObj, status, navigate, route) => {
  const id = rowObj?.applicationNo ?? rowObj?.id ?? null;
  
  if (id != null) {
    const initialValues = createInitialValues(rowObj);
    
    console.log(`🚀 Table navigating to ${status} with initialValues:`, initialValues);
    
    navigate(route, {
      state: { 
        initialValues: initialValues,
      },
    });
  }
};
