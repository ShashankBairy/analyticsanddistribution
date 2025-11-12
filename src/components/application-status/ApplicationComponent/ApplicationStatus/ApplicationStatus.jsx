import React, { useState, useEffect } from "react";
import styles from "./ApplicationStatus.module.css";
import ApplicationStatusHeader from "./components/ApplicationStatusHeader";
import ApplicationStatusContent from "./components/ApplicationStatusContent";
import { useApplicationData } from "./hooks/useApplicationData";
import { useApplicationFilters } from "./hooks/useApplicationFilters";
import { useApplicationSearch } from "./hooks/useApplicationSearch";
import { useApplicationNavigation } from "./hooks/useApplicationNavigation";
import { useApplicationUI } from "./hooks/useApplicationUI";
 
const ApplicationStatus = () => {
  console.log('🔄 ApplicationStatus component rendered');
  
  // Custom hooks for different concerns
  const {
    showFilter,
    setShowFilter,
    showExport,
    setShowExport,
    activeTab,
    setActiveTab,
    selectedCampus,
    setSelectedCampus,
    pageIndex,
    setPageIndex
  } = useApplicationUI();
  
  const { data, setData, loading, error } = useApplicationData(selectedCampus);
  const { search, handleSearchChange } = useApplicationSearch();
  const { handleCardClick } = useApplicationNavigation();
  
  const {
    studentCategory,
    setStudentCategory,
    isFilterApplied,
    filteredData
  } = useApplicationFilters(data, search, selectedCampus);
 
  // Handle page index changes when filtered data changes
  useEffect(() => {
    if (filteredData.length <= pageIndex * 10) {
      setPageIndex(0);
    }
  }, [filteredData, pageIndex, setPageIndex]);

  // Debug: Track component mount and data changes
  useEffect(() => {
    console.log('🔄 ApplicationStatus mounted/updated');
    console.log('🔄 selectedCampus:', selectedCampus);
    console.log('🔄 data length:', data.length);
    console.log('🔄 loading:', loading);
    console.log('🔄 error:', error);
  }, [selectedCampus, data.length, loading, error]);

  // Debug: Track component mount/unmount
  useEffect(() => {
    console.log('🔄 ApplicationStatus component mounted');
    return () => {
      console.log('🔄 ApplicationStatus component unmounted');
    };
  }, []);
 
 
  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>{error}</div>;
 
  return (
    <div className={styles["application-status"]}>
      {(showFilter || showExport) && (
        <div
          className={styles["application-status__overlay"]}
          onClick={() => {
            setShowFilter(false);
            setShowExport(false);
          }}
        />
      )}
      <div className={styles["application-status__card"]}>
        <h2 className={styles["application-status__title"]}>Application Status</h2>
        <p className={styles["application-status__subtitle"]}>
          Access and manage comprehensive student details seamlessly. View
          personalized profiles tailored to your campus.
        </p>
        
        <ApplicationStatusHeader
          search={search}
          handleSearchChange={handleSearchChange}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          showExport={showExport}
          setShowExport={setShowExport}
          isFilterApplied={isFilterApplied}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
          studentCategory={studentCategory}
          setStudentCategory={setStudentCategory}
          data={data} // Pass data to header for export functionality
        />
     
        <ApplicationStatusContent
          search={search}
          filteredData={filteredData}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          handleCardClick={handleCardClick}
          setData={setData}
        />
      </div>
    </div>
  );
};
 
export default ApplicationStatus;