import { useState, useEffect } from 'react';

export const useApplicationUI = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState("zone");
  const [selectedCampus, setSelectedCampus] = useState("All Campuses");
  const [pageIndex, setPageIndex] = useState(0);

  // Handle click outside to close panels
  useEffect(() => {
    const handleClickOutside = (event) => {
      const exportPanel = document.querySelector(`[class*="exportContainer"]`);
      const filterPanel = document.querySelector(`[class*="filter_panel"]`);
      const filterButton = event.target.closest(
        `[class*="application-status__filter-btn"]`
      );
      const exportButton = event.target.closest(
        `[class*="application-status__export-btn"]`
      );
      if (
        showExport &&
        exportPanel &&
        !exportPanel.contains(event.target) &&
        !exportButton
      ) {
        setShowExport(false);
      }
      if (
        showFilter &&
        filterPanel &&
        !filterPanel.contains(event.target) &&
        !filterButton
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExport, showFilter]);

  return {
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
  };
};
