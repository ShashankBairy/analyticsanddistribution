import { useState, useEffect, useCallback } from "react";
import {
  getProEmployees,
  getZones,
  getDgmEmployees,
  getStatuses,
  getCampusesByZoneId,
} from "../../../../queries/application-status/apis";
import { mapToDropdownOptions, reverseStatusMap } from "../utils/formUtils";

/**
 * Custom hook for managing dropdown data and loading states
 */
export const useDropdownData = () => {
  const [dropdownOptions, setDropdownOptions] = useState({
    zoneName: [],
    campusName: [],
    proName: [],
    dgmName: [],
    status: [],
  });

  const [loadingStates, setLoadingStates] = useState({
    zones: true,
    campuses: false,
    statuses: true,
    proEmployees: false,
    dgmEmployees: true,
  });

  const [error, setError] = useState(null);
  const [isOptionsLoaded, setIsOptionsLoaded] = useState(false);

  // Fetch initial dropdown options (zones and statuses)
  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        const [zonesData, statusesData] = await Promise.all([
          getZones(),
          getStatuses(),
        ]);

        // Map zones
        const mappedZones = mapToDropdownOptions(zonesData, "zoneName", "zoneId", "Unknown Zone");
        setDropdownOptions((prev) => ({
          ...prev,
          zoneName: mappedZones.filter((opt) => opt.label && opt.value),
        }));

        // Map statuses
        const mappedStatuses = statusesData
          ?.map((s) => {
            const raw = (s.status || s.status_type || s.name || "").toLowerCase();
            const statusName = reverseStatusMap[raw] || (s.status || s.status_type || s.name || "").toUpperCase();
            if (statusName === "LEFT" || statusName === "CONFIRMED") return null;
            return { label: statusName, value: s.status_id || s.id || null };
          })
          .filter((opt) => opt !== null) || [];

        setDropdownOptions((prev) => ({
          ...prev,
          status: mappedStatuses.filter((opt) => opt.label && opt.value),
        }));

        setLoadingStates((prev) => ({ ...prev, zones: false, statuses: false }));
        setIsOptionsLoaded(true);
      } catch (err) {
        console.error("Error fetching initial options:", err);
        setError("Failed to load initial data. Please refresh the page.");
        setLoadingStates((prev) => ({ ...prev, zones: false, statuses: false }));
      }
    };

    fetchInitialOptions();
  }, []);

  // Fetch campuses when zone changes
  const fetchCampuses = useCallback(async (zoneId) => {
    console.log("fetchCampuses called with zoneId:", zoneId);
    
    if (!zoneId) {
      console.log("No zoneId provided, clearing campuses");
      setDropdownOptions((prev) => ({ ...prev, campusName: [] }));
      setLoadingStates((prev) => ({ ...prev, campuses: false }));
      return;
    }

    try {
      console.log("Fetching campuses for zoneId:", zoneId);
      setLoadingStates((prev) => ({ ...prev, campuses: true }));
      const campuses = await getCampusesByZoneId(zoneId);
      
      console.log("=== CAMPUS FETCH DEBUG ===");
      console.log("Zone ID:", zoneId);
      console.log("Raw campuses data:", campuses);
      console.log("Campuses type:", typeof campuses);
      console.log("Campuses length:", Array.isArray(campuses) ? campuses.length : "Not an array");
      console.log("First campus object:", campuses && campuses[0]);
      console.log("First campus keys:", campuses && campuses[0] ? Object.keys(campuses[0]) : "No first campus");
      
      const mappedCampuses = mapToDropdownOptions(campuses, "campusName", "campusId", "Unknown Campus");
      console.log("Mapped campuses:", mappedCampuses);
      console.log("Mapped campuses length:", mappedCampuses.length);
      console.log("First mapped campus:", mappedCampuses[0]);
      console.log("=== END CAMPUS FETCH DEBUG ===");

      if (mappedCampuses.length === 0) {
        console.log("No campuses found after mapping");
        setError("No campuses found for the selected zone.");
      } else {
        console.log("Setting campuses in dropdown options");
        setError(null);
      }

      setDropdownOptions((prev) => ({ ...prev, campusName: mappedCampuses }));
      setLoadingStates((prev) => ({ ...prev, campuses: false }));
    } catch (err) {
      console.error("Error fetching campuses:", err);
      setError("Failed to load campuses. Please try again.");
      setDropdownOptions((prev) => ({ ...prev, campusName: [] }));
      setLoadingStates((prev) => ({ ...prev, campuses: false }));
    }
  }, []);

  // Fetch DGM employees when zone changes
  const fetchDgmEmployees = useCallback(async (zoneId) => {
    if (!zoneId) {
      setDropdownOptions((prev) => ({ ...prev, dgmName: [] }));
      setLoadingStates((prev) => ({ ...prev, dgmEmployees: false }));
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, dgmEmployees: true }));
      const dgmEmployees = await getDgmEmployees(zoneId);
      
      console.log("=== DGM EMPLOYEES FETCH DEBUG ===");
      console.log("Zone ID:", zoneId);
      console.log("Raw DGM employees data:", dgmEmployees);
      console.log("DGM employees type:", typeof dgmEmployees);
      console.log("DGM employees length:", Array.isArray(dgmEmployees) ? dgmEmployees.length : "Not an array");
      console.log("First DGM employee object:", dgmEmployees && dgmEmployees[0]);
      console.log("First DGM employee keys:", dgmEmployees && dgmEmployees[0] ? Object.keys(dgmEmployees[0]) : "No first DGM employee");
      
      const mappedDgmEmployees = mapToDropdownOptions(dgmEmployees, "name", "empId", "Unknown DGM");
      console.log("Mapped DGM employees:", mappedDgmEmployees);
      console.log("Mapped DGM employees length:", mappedDgmEmployees.length);
      console.log("First mapped DGM employee:", mappedDgmEmployees[0]);
      console.log("=== END DGM EMPLOYEES FETCH DEBUG ===");

      if (mappedDgmEmployees.length === 0) {
        setError("No DGM employees found for the selected zone. Please try another zone.");
      } else {
        setError(null);
      }

      setDropdownOptions((prev) => ({ ...prev, dgmName: mappedDgmEmployees }));
      setLoadingStates((prev) => ({ ...prev, dgmEmployees: false }));
    } catch (err) {
      console.error("Error fetching DGM employees:", err);
      setError("Failed to load DGM employees. Please select a different zone or try again.");
      setDropdownOptions((prev) => ({ ...prev, dgmName: [] }));
      setLoadingStates((prev) => ({ ...prev, dgmEmployees: false }));
    }
  }, []);

  // Fetch PRO employees when campus changes
  const fetchProEmployees = useCallback(async (campusId) => {
    if (!campusId) {
      setDropdownOptions((prev) => ({ ...prev, proName: [] }));
      setLoadingStates((prev) => ({ ...prev, proEmployees: false }));
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, proEmployees: true }));
      const proEmployees = await getProEmployees(campusId);
      
      console.log("=== PRO EMPLOYEES FETCH DEBUG ===");
      console.log("Campus ID:", campusId);
      console.log("Raw PRO employees data:", proEmployees);
      console.log("PRO employees type:", typeof proEmployees);
      console.log("PRO employees length:", Array.isArray(proEmployees) ? proEmployees.length : "Not an array");
      console.log("First PRO employee object:", proEmployees && proEmployees[0]);
      console.log("First PRO employee keys:", proEmployees && proEmployees[0] ? Object.keys(proEmployees[0]) : "No first PRO employee");
      
      const mappedProEmployees = mapToDropdownOptions(proEmployees, "name", "empId", "Unknown PRO");
      console.log("Mapped PRO employees:", mappedProEmployees);
      console.log("Mapped PRO employees length:", mappedProEmployees.length);
      console.log("First mapped PRO employee:", mappedProEmployees[0]);
      console.log("=== END PRO EMPLOYEES FETCH DEBUG ===");

      if (mappedProEmployees.length === 0) {
        setError("No PRO employees found for the selected campus. Please try another campus.");
      } else {
        setError(null);
      }

      setDropdownOptions((prev) => ({ ...prev, proName: mappedProEmployees }));
      setLoadingStates((prev) => ({ ...prev, proEmployees: false }));
    } catch (err) {
      console.error("Error fetching PRO employees:", err);
      setError("Failed to load PRO employees. Please select a different campus or try again.");
      setDropdownOptions((prev) => ({ ...prev, proName: [] }));
      setLoadingStates((prev) => ({ ...prev, proEmployees: false }));
    }
  }, []);

  return {
    dropdownOptions,
    loadingStates,
    error,
    isOptionsLoaded,
    fetchCampuses,
    fetchDgmEmployees,
    fetchProEmployees,
    setError,
  };
};
