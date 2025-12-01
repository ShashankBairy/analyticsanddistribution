import React, { useState, useMemo } from "react";
import styles from "./CostSelectionForGraph.module.css";
import Button from "../../widgets/Button/Button";
import { useSelectedEntity } from "../../../src/contexts/SelectedEntityContext";
import { useGetAllAmounts } from "../../../src/queries/application-analytics/analytics";
 
const CostSelectionForGraph = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(null);
  const { setAmount, clearAmount, selectedAmount } = useSelectedEntity();
 
  // Get employee ID from localStorage
  const empId = localStorage.getItem("empId");
  const academicYearId = 26; // Hardcoded as per requirement
 
  console.log("💰 CostSelectionForGraph - empId:", empId, "academicYearId:", academicYearId);
 
  // Fetch amounts from backend
  const { data: amountsData, isLoading: amountsLoading, isError: amountsError } = useGetAllAmounts(empId, academicYearId);
 
  console.log("💰 CostSelectionForGraph - API Response:", {
    amountsData,
    isLoading: amountsLoading,
    isError: amountsError,
    dataType: typeof amountsData,
    isArray: Array.isArray(amountsData)
  });
 
  // Transform backend data to costTabs format
  const costTabs = useMemo(() => {
    // Only use fallback if we're not loading and there's no data
    if (amountsLoading) {
      // Return empty array while loading
      return [];
    }
   
    if (amountsError) {
      console.warn("💰 Error loading amounts, using fallback values");
      // Fallback to default values if API fails
      return [
        { id: 1, label: "10000", value: "10000" },
        { id: 2, label: "5000", value: "5000" },
        { id: 3, label: "2000", value: "2000" },
        { id: 4, label: "0", value: "0" },
      ];
    }
   
    // If no data yet, return empty array
    if (!amountsData) {
      console.log("💰 No amounts data yet");
      return [];
    }
   
    // Handle different response formats
    let amountsArray = [];
   
    if (Array.isArray(amountsData)) {
      amountsArray = amountsData;
    } else if (typeof amountsData === 'object' && amountsData !== null) {
      // If it's an object, try to extract array from common properties
      amountsArray = amountsData.data || amountsData.amounts || amountsData.values || [];
    } else {
      console.warn("💰 Unexpected data format:", amountsData);
      // Fallback
      return [
        { id: 1, label: "10000", value: "10000" },
        { id: 2, label: "5000", value: "5000" },
        { id: 3, label: "2000", value: "2000" },
        { id: 4, label: "0", value: "0" },
      ];
    }
   
    if (!Array.isArray(amountsArray) || amountsArray.length === 0) {
      console.warn("💰 Amounts array is empty or invalid, using fallback");
      return [
        { id: 1, label: "10000", value: "10000" },
        { id: 2, label: "5000", value: "5000" },
        { id: 3, label: "2000", value: "2000" },
        { id: 4, label: "0", value: "0" },
      ];
    }
   
    console.log("💰 Transforming amounts array:", amountsArray);
   
    // Transform backend response to costTabs format
    // Handle both: [10000, 5000, 2000, 0] and [{amount: 10000}, {amount: 5000}, ...]
    const transformed = amountsArray.map((item, index) => {
      let amount;
     
      if (typeof item === 'object' && item !== null) {
        // Object format: {amount: 10000} or {value: 10000} or {id: 1, amount: 10000}
        amount = item.amount || item.value || item.id || item;
      } else {
        // Direct value: 10000
        amount = item;
      }
     
      const amountStr = String(amount);
      return {
        id: index + 1,
        label: amountStr,
        value: amountStr,
      };
    }).sort((a, b) => Number(b.value) - Number(a.value)); // Sort descending
   
    console.log("💰 Transformed costTabs:", transformed);
    return transformed;
  }, [amountsData, amountsLoading, amountsError]);
 
  // Initialize activeTab from context if available
  React.useEffect(() => {
    if (selectedAmount !== null && selectedAmount !== undefined) {
      setActiveTab(selectedAmount.toString());
    }
  }, [selectedAmount]);
 
  const handleNavTab = (value) => {
    setActiveTab(value);
  };
 
  const clearActive = () => {
    setActiveTab(null);
    clearAmount();
  };
 
  const handleApply = () => {
    // Apply the selected amount to context
    if (activeTab) {
      setAmount(activeTab);
    } else {
      clearAmount();
    }
    // Close the filter after applying
    if (onClose) {
      onClose();
    }
  };
 
  return (
    <div className={styles.costSelectionForGraphWrapper}>
        <div className={styles.costFilterTop}>
        <p className={styles.costFilterheading}>Application Price</p>
      {amountsLoading ? (
        <p>Loading amounts...</p>
      ) : amountsError ? (
        <p>Error loading amounts. Using default values.</p>
      ) : (
        <ul className={styles.cost_nav_tab}>
          {costTabs.map((tab) => (
            <li
              key={tab.id}
              className={styles.cost_nav_list}
              onClick={() => handleNavTab(tab.value)}
            >
              <a
                className={`${styles.cost_nav_item} ${
                  activeTab === tab.value ? styles.active : ""
                }`}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      )}
        </div>
 
      <div className={styles.filterAppButtons}>
        <Button
          buttonname={"Clear"}
          variant={"secondary"}
          onClick={clearActive}
        />
        <Button
          buttonname={"Apply"}
          variant={"primary"}
          onClick={handleApply}
        />
      </div>
    </div>
  );
};
 
export default CostSelectionForGraph;