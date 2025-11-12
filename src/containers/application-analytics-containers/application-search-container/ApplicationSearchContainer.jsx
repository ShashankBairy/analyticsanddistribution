

// Sample data
//   const data = [
//     { appNo: "A123", status: "Sold", campusName: "Campus A", zoneName: "Zone 1" },
//     { applicationNo: "B456", displayStatus: "Damaged", campus: "Campus B", zone: "Zone 2" },
//     { applicationNo: "C789", displayStatus: "Confirmed", campus: "Campus C", zone: "Zone 3" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },
//     { applicationNo: "A123", displayStatus: "Sold", campus: "Campus A", zone: "Zone 1" },

//   ];

import React, { useState, useEffect } from "react";
import ApplicationSearchHeader from "../../../components/application-analytics/application-search-components/application-search-header-component/ApplicationSearchHeader";
import ApplicationSearchBar from "../../../widgets/application-search-bar-component/ApplicationSearchBar";
import SearchCards from "../../../components/application-status/ApplicationComponent/SearchComponent/SearchCards";
import styles from "../application-search-container/ApplicationSearchContainer.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ApplicationSearchContainer = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // ✅ API fetch function
  const fetchApp = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/application-status/all_status_list"
    );
    console.log("Fetched Data →", response.data);
    return response.data ?? [];
  };

  // ✅ useQuery hook — always runs in same order
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["appCard"],
    queryFn: fetchApp,
  });

  // ✅ Handle search
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // ✅ Filter data based on search
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData([]);
    } else {
      const filtered = data.filter((item) =>
        String(item.applicationNo ?? "").toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [search, data]);

  // ✅ Conditional rendering inside JSX instead of early return
  return (
    <>
      <div id="application_search_container" className={styles.application_search_container}>
        <ApplicationSearchHeader />
        <ApplicationSearchBar
          placeholderText="Search for Application"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Loading / Error states */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Popup cards */}
      {!isLoading && !error && search.trim() !== "" && filteredData.length > 0 && (
        <div className={styles.search_list_container}>
          <SearchCards
            data={filteredData}
            maxResults={5}
            onCardClick={(item) => console.log("Card clicked:", item)}
          />
        </div>
      )}

      {/* No results */}
      {!isLoading && !error && search.trim() !== "" && filteredData.length === 0 && (
        <p style={{ textAlign: "center", color: "#777" }}>No results found.</p>
      )}
    </>
  );
};

export default ApplicationSearchContainer;
