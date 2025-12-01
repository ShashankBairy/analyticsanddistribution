import { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { fetchApplicationDetails,fetchApplicationDetailsForDamage } from "../../../../queries/application-status/apis";
import {
  findIdByLabel,
  reverseStatusMap,
  storeBackendIds,
} from "../utils/formUtils";

/**
 * Custom hook for fetching and managing application details
 */
export const useApplicationDetailsForDamage = ({
  applicationNo,
  isOptionsLoaded,
  dropdownOptions,
  setZoneId,
  setSelectedCampusId,
  setSelectedStatusId,
  setPendingDgmName,
}) => {
  const { setFieldValue } = useFormikContext();
  const [fetchError, setFetchError] = useState(false);
  const campusName = localStorage.getItem("campusName");

  useEffect(() => {
    const fetchApplicationDetailsData = async () => {
      if (applicationNo && isOptionsLoaded) {
        try {
          const data = await fetchApplicationDetailsForDamage(applicationNo);

          // Display the full backend object
          console.log("=== FULL BACKEND DATA OBJECT ===");
          console.log("Complete backend response:", JSON.stringify(data));
          console.log("=== END FULL BACKEND DATA OBJECT ===");

          // Map API response to form fields, handling status mapping
          setFieldValue("zoneName", data.zone_name || "");
          setFieldValue("campusName", data.cmps_name || "");
          setFieldValue("proName", data.pro_name || "");
          setFieldValue("dgmName", data.dgm_name || "");
          setFieldValue("dgm_emp_id", data.dgmEmpId || "");
          setFieldValue("zone_id", data.zoneId || "");
          setFieldValue("cmps_id", data.campusId || "");
          setFieldValue("statusId", 0);
          const normalizedStatus = data.status?.toLowerCase() || "available";
          const mappedStatus =
            normalizedStatus === "left" || normalizedStatus === "confirmed"
              ? "AVAILABLE"
              : normalizedStatus.toUpperCase();
          setFieldValue("status", mappedStatus);
          setFieldValue("reason", data.reason || "");
          setFieldValue("applicationNo", applicationNo);

          // Store pending DGM name for later processing
          if (data.dgmEmpName) {
            setPendingDgmName(data.dgm_name);
          }

          // Use IDs directly from backend data - no need to lookup
          const zoneId = data.zoneId;
          const campusId = data.campusId;
          const proId = data.proEmpId;
          const dgmId = data.dgmEmpId;
          const proName = data.proName;
          const dgmName = data.dgmName;
          const zoneName = data.zoneName;
          const campusName = data.campusName;
          const status = data.status;
          const statusId = 0;

          console.log("=== SETTING FORM VALUES FROM BACKEND DATA ===");
          console.log("Setting form values:", {
            zoneId,
            campusId,
            proId,
            dgmId,
            statusId,
          });
          console.log("=== END SETTING FORM VALUES ===");

          // Store backend IDs for later use in form submission
          storeBackendIds({
            zoneId: zoneId,
            campusId: campusId,
            proId: proId,
            dgmEmpId: dgmId,
            statusId: statusId,
            proName: proName,
            dgmName:dgmName,
            zoneName:zoneName,
            campusName:campusName,
            status:status,
          });

          // Set the IDs in the form - force set with actual values
          console.log("Setting form field values:", {
            zoneId: zoneId,
            campusId: campusId,
            proId: proId,
            dgmEmpId: dgmId,
            statusId: statusId,
            proName: proName,
            dgmName:dgmName,
            zoneName:zoneName,
            campusName:campusName,
            status:status,
          });

          setFieldValue("zoneId", zoneId);
          setFieldValue("campusId", campusId);
          setFieldValue("proId", proId);
          setFieldValue("dgmEmpId", dgmId);
          setFieldValue("statusId", statusId);
          setFieldValue("proName", proName);
          setFieldValue("dgmName",dgmName);
          setFieldValue("zoneName",zoneName);
          setFieldValue("campusName",campusName);
          setFieldValue("status",status);

          // Force set the values again after a short delay to ensure they stick
          setTimeout(() => {
            console.log("=== FORCE SETTING FORM VALUES AGAIN ===");
            setFieldValue("zoneId", zoneId);
            setFieldValue("campusId", campusId);
            setFieldValue("proId", proId);
            setFieldValue("dgmEmpId", dgmId);
            setFieldValue("statusId", statusId);
            console.log("Force set values:", {
              zoneId: zoneId,
              campusId: campusId,
              proId: proId,
              dgmEmpId: dgmId,
              statusId: statusId,
            });
            console.log("=== END FORCE SETTING ===");
          }, 200);

          // Additional verification - try setting values with different approaches
          setTimeout(() => {
            console.log("=== ADDITIONAL VERIFICATION ===");
            console.log("Trying to set values with different field names...");

            // Try alternative field names if they exist
            setFieldValue("campusId", campusId);
            setFieldValue("proId", proId);
            setFieldValue("dgmEmpId", dgmId);

            // Also try setting as numbers explicitly
            if (campusId) setFieldValue("campusId", parseInt(campusId));
            if (proId) setFieldValue("proId", parseInt(proId));
            if (dgmId) setFieldValue("dgmEmpId", parseInt(dgmId));

            console.log("=== END ADDITIONAL VERIFICATION ===");
          }, 500);

          setZoneId(zoneId || "");
          setSelectedCampusId(campusId || "");
          setSelectedStatusId(statusId || "");

          setFetchError(false);
        } catch (err) {
          console.error("Failed to fetch application details:", err);
          setFetchError(true);
        }
      } else if (!applicationNo) {
        // Clear form when no application number
        setFieldValue("zoneName", "");
        setFieldValue("campusName", "");
        setFieldValue("proName", "");
        setFieldValue("dgmName", "");
        setFieldValue("status", "");
        setFieldValue("reason", "");
        setFieldValue("zoneId", "");
        setFieldValue("campusId", "");
        setFieldValue("proId", "");
        setFieldValue("dgmEmpId", "");
        setFieldValue("statusId", "");
        setZoneId("");
        setSelectedCampusId("");
        setSelectedStatusId(null);
        setPendingDgmName("");
        setFetchError(false);
      }
    };

    fetchApplicationDetailsData();
  }, [
    applicationNo,
    isOptionsLoaded,
    setFieldValue,
    dropdownOptions.zoneName,
    dropdownOptions.campusName,
    dropdownOptions.proName,
    dropdownOptions.dgmName,
    dropdownOptions.status,
    setZoneId,
    setSelectedCampusId,
    setSelectedStatusId,
    setPendingDgmName,
  ]);

  return { fetchError };
};
