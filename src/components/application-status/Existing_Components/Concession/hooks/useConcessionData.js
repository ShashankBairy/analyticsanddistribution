import { useState, useEffect } from 'react';
import apiService from '../../../../../queries/application-status/SaleFormapis';

/**
 * Custom hook for ConcessionInfoSection data fetching
 * Extracted from ConcessionInfoSection.js lines 400-530
 * Preserves every single line and functionality exactly as manager wants
 */
export const useConcessionData = () => {
  const [reasonOptions, setReasonOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    reasons: true,
    employees: true,
  });

  // Function to show snackbar messages
  const showSnackbar = (message, severity = 'error') => {
    // This will be handled by the parent component
    console.log(`Snackbar: ${message} (${severity})`);
  };

  // Function to close snackbar
  const closeSnackbar = () => {
    // This will be handled by the parent component
    console.log('Snackbar closed');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setLoadingStates({
          reasons: true,
          employees: true,
        });

        console.log("🔄 Fetching concession data...");

        // Fetch authorized by employees
        const authorizedByResponse = await apiService.getAuthorizedBy();
        console.log("📋 Authorized by response:", authorizedByResponse);

        // Fetch concession reasons
        const concessionReasonsResponse = await apiService.getConcessionReasons();
        console.log("📋 Concession reasons response:", concessionReasonsResponse);

        // Process authorized by data
        const authorizedByArray = authorizedByResponse?.data || authorizedByResponse || [];
        const processedAuthorizedBy = authorizedByArray
          .filter((item) => item && item.id != null && item.name)
          .map((item) => ({
            value: item.id?.toString() || "",
            label: item.name || "",
          }));

        // Process concession reasons data
        const concessionReasonArray = concessionReasonsResponse?.data || concessionReasonsResponse || [];
        const processedConcessionReasons = concessionReasonArray
          .filter((item) => item && item.id != null && item.name)
          .map((item) => ({
            value: item.id?.toString() || "",
            label: item.name || "",
          }));

        // Set the options
        setEmployeeOptions(processedAuthorizedBy);
        setReasonOptions(processedConcessionReasons);

        // Update loading states
        setLoadingStates({
          reasons: false,
          employees: false,
        });

        console.log("✅ Loaded authorized by:", processedAuthorizedBy);
        console.log("✅ Loaded concession reasons:", processedConcessionReasons);
      } catch (error) {
        console.error("❌ Error fetching concession data:", error);
        setLoadingStates({
          reasons: false,
          employees: false,
        });
      }
    };
   
    fetchData();
  }, []);

  return {
    reasonOptions,
    setReasonOptions,
    employeeOptions,
    setEmployeeOptions,
    isLoading,
    setIsLoading,
    loadingStates,
    setLoadingStates,
    showSnackbar,
    closeSnackbar,
  };
};
