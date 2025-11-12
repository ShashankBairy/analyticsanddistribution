import { useNavigate } from 'react-router-dom';
import { reverseStatusMap } from '../utils/statusMapping';
 
export const useApplicationNavigation = () => {
  const navigate = useNavigate();
 
  const handleCardClick = (item) => {
    const applicationNo = item?.applicationNo;
    const displayStatus = item?.displayStatus;
   
    if (applicationNo) {
      // Navigation logic based on sale completion:
      // - If sale is complete (Sold or Confirmed) -> route to confirmation page
      // - If sale is not complete -> route to sale page
      // - If damaged -> route to damaged page
      let route;
      if (displayStatus === "Damaged") {
        route = "damaged";
      } else if (displayStatus === "Sold" || displayStatus === "Confirmed") {
        // Sale is complete (checkmark on Sale) -> route to confirmation
        route = "confirm";
      } else {
        // Sale is not complete -> route to sale form
        route = "sale";
      }
      const initialValues = {
        applicationNo: item.applicationNo || "",
        zoneName: item.zonal_name || item.zone || item.zoneName || "",
        zone: item.zonal_name || item.zone || item.zoneName || "",
        zoneEmpId: item.zoneEmpId || item.zone_emp_id || "",
        campusName: item.cmps_name || item.campus || item.campusName || "",
        campus: item.cmps_name || item.campus || item.campusName || "",
        campusId: item.campusId || item.campus_id || "",
        proName:
          item.pro ||
          item.proName ||
          item.pro_name ||
          (item.pro_employee ? `${item.pro_employee.first_name} ${item.pro_employee.last_name}` : "") ||
          "",
        proId: item.proId || item.pro_id || "",
        dgmName:
          item.dgm ||
          item.dgmName ||
          item.dgm_name ||
          (item.dgm_employee ? `${item.dgm_employee.first_name} ${item.dgm_employee.last_name}` : "") ||
          "",
        dgmEmpId: item.dgmEmpId || item.dgm_emp_id || "",
        status: reverseStatusMap[(item.status || "").toLowerCase()] || item.status?.toUpperCase() || "UNKNOWN",
        statusId: item.statusId || item.status_id || "",
        reason: item.reason || "",
      };
     
      navigate(`/scopes/application/status/${applicationNo}/${route}`, {
        state: {
          initialValues: initialValues,
        },
      });
    }
  };
 
  return { handleCardClick };
};
 