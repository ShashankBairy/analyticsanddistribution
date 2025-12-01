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
import { useSelectedEntity } from "../../../../contexts/SelectedEntityContext";
 
const ZoneNameDropdown = ({ activeTab }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [userCategory, setUserCategory] = useState(null);
  const [empId, setEmpId] = useState(null);
 
  const { selectEntity, clearSelection } = useSelectedEntity();
 
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
 
  // ✅ Reset dropdown value when tab changes (but DON'T clear the selected entity context)
  useEffect(() => {
    if (!isLoading) {
      setSelectedValue(""); // Only reset the dropdown display value
      // DON'T call clearSelection() - user wants selection to persist until they select a new item
    }
  }, [activeTab, isLoading]);
 
  const handleChange = (event) => {
    const newValue = event.target?.value || event;
    setSelectedValue(newValue);
   
    console.log("🎯🎯🎯 === DROPDOWN CLICKED AND CHANGED! ===");
    console.log("=== DROPDOWN CHANGE DEBUG ===");
    console.log("Selected value:", newValue);
    console.log("Raw data available:", rawData);
    console.log("Active tab:", activeTab);
   
    // ✅ Find the selected item's ID and pass to context
    if (!rawData || rawData.length === 0) {
      console.log("❌ No raw data available");
      clearSelection();
      return;
    }
   
    const selectedItem = rawData.find((item) => item.name === newValue);
    console.log("🔍 Found selected item:", selectedItem);
   
    if (selectedItem) {
      const entityType = activeTab === "Zone" ? "zone" : "campus"; // DGM and Campus both use campus API
      console.log(`✅ Calling selectEntity with:`, {
        id: selectedItem.id,
        name: selectedItem.name,
        type: entityType
      });
      selectEntity(selectedItem.id, selectedItem.name, entityType);
      console.log(`✅ Selected ${entityType}:`, selectedItem);
    } else {
      console.log("❌ No matching item found, clearing selection");
      clearSelection();
    }
  };
 
  const dropdownName = activeTab ? `${activeTab} Name` : "Select Category";
  const isDisabled =
    isLoading || isError || dropdownResults.length === 0;
 
  // 🔥 Debug logs AFTER all variables are declared
  console.log("🔥 DROPDOWN RENDER DEBUG 🔥");
  console.log("Active Tab:", activeTab);
  console.log("Raw Data:", rawData);
  console.log("Dropdown Results:", dropdownResults);
  console.log("Is Disabled:", isDisabled);
  console.log("Is Loading:", isLoading);
 
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