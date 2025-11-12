import { useState, useEffect, useMemo } from "react";
import styles from "./ZoneNameDropdown.module.css";
import Dropdown from "../../../../widgets/Dropdown/Dropdown";
import {
  useGetAllZones,
  useGetAllDgms,
  useGetAllCampuses,
  useGetDgmsForZonalAccountant,
  useGetCampuesForZonalAccountant,
  useGetCampuesForDgmEmpId,
} from "../../../../queries/application-analytics/analytics";

const ZoneNameDropdown = ({ activeTab }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [userCategory, setUserCategory] = useState(null);
  const [empId, setEmpId] = useState(null);

  // ✅ Load category & empId safely from localStorage
  useEffect(() => {
    const storedCategory = localStorage.getItem("category");
    const storedEmpId = localStorage.getItem("empId");
    if (storedCategory) setUserCategory(storedCategory.toUpperCase());
    if (storedEmpId) setEmpId(storedEmpId);
  }, []);

  // ✅ Identify user type
  const isZonalAccountant =
    userCategory === "SCHOOL" || userCategory === "COLLEGE";
  const isAdmin = !!userCategory && !isZonalAccountant;

  // ✅ Conditionally enable queries
  const allZonesQuery = useGetAllZones({
    enabled: !!userCategory && isAdmin && activeTab === "Zone",
  });

  const allDgmsQuery = useGetAllDgms({
    enabled: !!userCategory && isAdmin && activeTab === "DGM",
  });

  const allCampusesQuery = useGetAllCampuses({
    enabled: !!userCategory && isAdmin && activeTab === "Campus",
  });

  const dgmsForZonalQuery = useGetDgmsForZonalAccountant(empId, {
    enabled: !!empId && !!userCategory && isZonalAccountant && activeTab === "DGM",
  });

  const campusesForZonalQuery = useGetCampuesForZonalAccountant(empId, {
    enabled: !!empId && !!userCategory && isZonalAccountant && activeTab === "Campus",
  });

  const campusesForDgmQuery = useGetCampuesForDgmEmpId(empId, {
    enabled: !!empId && !!userCategory && isZonalAccountant && activeTab === "Campus",
  });

  // ✅ Choose which data to display dynamically
  let rawData = [];
  let isLoading = false;
  let isError = false;

  if (isAdmin) {
    if (activeTab === "Zone")
      ({ data: rawData = [], isLoading, isError } = allZonesQuery);
    else if (activeTab === "DGM")
      ({ data: rawData = [], isLoading, isError } = allDgmsQuery);
    else if (activeTab === "Campus")
      ({ data: rawData = [], isLoading, isError } = allCampusesQuery);
  } else if (isZonalAccountant) {
    if (activeTab === "DGM")
      ({ data: rawData = [], isLoading, isError } = dgmsForZonalQuery);
    else if (activeTab === "Campus") {
      // 🧩 Fallback: campuses for Zonal first, else for DGM
      const zonalData = campusesForZonalQuery.data || [];
      const dgmData = campusesForDgmQuery.data || [];
      rawData =
        Array.isArray(zonalData) && zonalData.length > 0 ? zonalData : dgmData;

      isLoading =
        campusesForZonalQuery.isLoading || campusesForDgmQuery.isLoading;
      isError =
        campusesForZonalQuery.isError && campusesForDgmQuery.isError;
    }
  }

  // ✅ Map raw data (common format: { id, name })
  const dropdownResults = useMemo(() => {
    if (!Array.isArray(rawData) || rawData.length === 0) return [];
    return rawData.map((item) => item.name).filter(Boolean);
  }, [rawData]);

  // ✅ Reset value when tab or data changes
  useEffect(() => {
    if (!isLoading) setSelectedValue("");
  }, [activeTab, isLoading]);

  const handleChange = (event) => {
    const newValue = event.target?.value || event;
    setSelectedValue(newValue);
  };

  const dropdownName = activeTab ? `${activeTab} Name` : "Select Category";
  const isDisabled =
    isLoading || isError || dropdownResults.length === 0;

  // 🧠 Prevent rendering until both category & empId are ready
  if (!userCategory || !empId) {
    return <div>Loading...</div>;
  }

  return (
    <div id="zone_name_dropdown">
      <Dropdown
        dropdownname={dropdownName}
        results={dropdownResults}
        onChange={handleChange}
        value={selectedValue}
        name={activeTab.toLowerCase() + "Name"}
        disabled={isDisabled}
      />
    </div>
  );
};

export default ZoneNameDropdown;
