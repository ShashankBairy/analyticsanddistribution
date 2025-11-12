import React, { useRef, useState, useEffect } from "react";
import styles from "../analytical-header-part-components/AnalyticsHeader.module.css";
import ApplicationSearchHeaderIcon from "../../../assets/application-analytics/ApplicationSearchHeaderIcon";
import ApplicationSearchBar from "../../../widgets/application-search-bar-component/ApplicationSearchBar";
import SearchDropdown from "../analytics-header-part/searchbar-drop-down-component/SearchDropdown";
import FilterSearch from "../analytics-header-part/filter-search-component/FilterSearch";
import { usePermission } from "../../../hooks/usePermission ";
import { useZonesQuery, useCampusesQuery, useDgmsQuery } from "../analytics-header-part/zone-name-dropdown/DropdownData";
import {
  useGetAllDgms,
  useGetDgmsForZonalAccountant,
  useGetCampuesForZonalAccountant,
  useGetCampuesForDgmEmpId,
} from "../../../queries/application-analytics/analytics";

const AnalyticsHeader = ({ onTabChange, activeTab }) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  // ✅ Get user info from localStorage
  const [userCategory, setUserCategory] = useState(null);
  const [empId, setEmpId] = useState(null);

  const wrapperRef = useRef(null);

  // ✅ Get permissions
  const zonePerms = usePermission("DISTRIBUTE_ZONE");
  const dgmPerms = usePermission("DISTRIBUTE_DGM");
  const campusPerms = usePermission("DISTRIBUTE_CAMPUS");

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedCategory = localStorage.getItem("category");
    const storedEmpId = localStorage.getItem("empId");
    if (storedCategory) setUserCategory(storedCategory.toUpperCase());
    if (storedEmpId) setEmpId(storedEmpId);
  }, []);

  // ✅ Identify user type
  const isZonalAccountant = userCategory === "SCHOOL" || userCategory === "COLLEGE";
  const isAdmin = !!userCategory && !isZonalAccountant;

  // ✅ Fetch data using the SAME queries as the dropdown
  const allZonesQuery = useZonesQuery({
    enabled: !!userCategory && zonePerms.isFullAccess,
  });

  const dgmsQueryStatic = useDgmsQuery({
    enabled: !!userCategory && isAdmin && dgmPerms.isFullAccess,
  });

  const dgmsForZonalQuery = useGetDgmsForZonalAccountant(empId, {
    enabled: !!empId && !!userCategory && isZonalAccountant && dgmPerms.isFullAccess,
  });

  const allCampusesQuery = useCampusesQuery({
    enabled: !!userCategory && campusPerms.isFullAccess,
  });

  const campusesForZonalQuery = useGetCampuesForZonalAccountant(empId, {
    enabled: !!empId && !!userCategory && isZonalAccountant && campusPerms.isFullAccess,
  });

  const campusesForDgmQuery = useGetCampuesForDgmEmpId(empId, {
    enabled: !!empId && !!userCategory && isZonalAccountant && campusPerms.isFullAccess,
  });

  const handleSearchBarClick = () => {
    // Show dropdown when clicking/focusing on search bar (only if not typing)
    if (!searchTerm) {
      setShowSearchDropdown(true);
      setShowSuggestions(false);
    }
  };

  // ✅ Get searchable items - EXACT same logic as dropdown
  const getSearchableItems = () => {
    const items = [];

    // Zone data - same for all users with permission
    if (zonePerms.isFullAccess) {
      const zoneData = allZonesQuery.data || [];
      zoneData.forEach(zone => {
        const zoneName = zone.name || zone.zoneName || zone.zone_name || zone.zone;
        if (zoneName) {
          items.push({ id: `zone-${zone.id}`, name: zoneName, type: "Zone" });
        }
      });
    }

    // DGM data - different based on user type
    if (dgmPerms.isFullAccess) {
      let dgmData = [];
      if (isAdmin) {
        dgmData = dgmsQueryStatic.data || [];
      } else if (isZonalAccountant) {
        dgmData = dgmsForZonalQuery.data || [];
      }

      dgmData.forEach(dgm => {
        const dgmName = dgm.name || dgm.dgmName || dgm.dgm_name;
        if (dgmName) {
          items.push({ id: `dgm-${dgm.id}`, name: dgmName, type: "DGM" });
        }
      });
    }

    // Campus data - different based on user type
    if (campusPerms.isFullAccess) {
      let campusData = [];
      
      if (isAdmin) {
        campusData = allCampusesQuery.data || [];
      } else if (isZonalAccountant) {
        // Same fallback logic as dropdown
        const zonalData = campusesForZonalQuery.data || [];
        const dgmData = campusesForDgmQuery.data || [];
        campusData = Array.isArray(zonalData) && zonalData.length > 0 ? zonalData : dgmData;
      }

      campusData.forEach(campus => {
        const campusName = campus.name || campus.campusName || campus.campus_name || campus.campus;
        if (campusName) {
          items.push({ id: `campus-${campus.id}`, name: campusName, type: "Campus" });
        }
      });
    }

    return items;
  };

  // ✅ Updated search handler to use real data
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const q = value.toLowerCase().trim();

    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowSearchDropdown(true); // Show dropdown when search is cleared
      return;
    }

    // Get items based on active tab
    const items = getSearchableItems();

    // Filter (case-insensitive)
    const filtered = items.filter((it) => it.name.toLowerCase().includes(q));

    // De-duplicate by exact original string
    const seen = new Set();
    const unique = [];
    for (const it of filtered) {
      if (!seen.has(it.name)) {
        seen.add(it.name);
        unique.push(it);
      }
    }

    // Top-5 only
    setSuggestions(unique.slice(0, 5));
    setShowSuggestions(unique.length > 0);
    setShowSearchDropdown(false); // Hide dropdown when showing suggestions
  };

  useEffect(() => {
    function handleOutside(e) {
      const clickedInsideWrapper = wrapperRef.current?.contains(e.target);
      if (clickedInsideWrapper) return;
      setShowSearchDropdown(false);
      setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ✅ Generate dynamic placeholder based on user's FULL ACCESS permissions (clickable tabs)
  const getSearchPlaceholder = () => {
    const allowedTypes = [];
    if (zonePerms.isFullAccess) allowedTypes.push("Zone");
    if (dgmPerms.isFullAccess) allowedTypes.push("DGM");
    if (campusPerms.isFullAccess) allowedTypes.push("Campus");
    
    if (allowedTypes.length === 0) return "Search";
    if (allowedTypes.length === 1) return `Search for ${allowedTypes[0]}`;
    if (allowedTypes.length === 2) return `Search for ${allowedTypes[0]} or ${allowedTypes[1]}`;
    return `Search for ${allowedTypes[0]}, ${allowedTypes[1]} or ${allowedTypes[2]}`;
  };

  return (
    <div className={styles.analytics_header_and_search_bar} ref={wrapperRef}>
      <div className={styles.analytics_header}>
        <ApplicationSearchHeaderIcon height="44" width="44" />
        <div>
          <h3 className={styles.analytics_heading}>Application Analytics</h3>
          <p className={styles.analytics_header_text_para}>
            Get all the analytics and growth rate of applications
          </p>
        </div>
      </div>

      <div className={styles.searchbar_wrapper}>
        <ApplicationSearchBar
          placeholderText={getSearchPlaceholder()}
          customClass={styles.custom_search_bar}
          onClick={handleSearchBarClick}
          onChange={handleInputChange}
          value={searchTerm}
        />

        {showSuggestions && <FilterSearch suggestions={suggestions} />}
        {showSearchDropdown && <SearchDropdown onTabChange={onTabChange} />}
      </div>
    </div>
  );
};

export default AnalyticsHeader;
