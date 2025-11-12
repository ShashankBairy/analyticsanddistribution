import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getApplicationStatus } from '../../../../../queries/application-status/apis';
import { normalizeApiResponse } from '../utils/dataNormalization';

export const useApplicationData = (selectedCampus) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    console.log('🔄 useApplicationData useEffect triggered');
    console.log('🔄 selectedCampus:', selectedCampus);
    console.log('🔄 location.pathname:', location.pathname);
    
    const fetchData = async () => {
      // Skip fetching if selectedCampus is invalid (empty string or null/undefined)
      if (!selectedCampus || selectedCampus.trim() === '') {
        console.log('⚠️ No selectedCampus, skipping fetch');
        setData([]);
        setError("Please select a valid campus to view application status.");
        setLoading(false);
        return;
      }

      // For "All Campuses", we should still fetch data
      if (selectedCampus === "All Campuses") {
        console.log('🔄 Fetching data for "All Campuses"');
      }

      console.log('🚀 Starting data fetch...');
      setLoading(true);
      setError(null);
      try {
        // Since we're using employee-based API, we don't need campus ID
        // The employee-based API will return applications for the logged-in employee regardless of campus
        const empId = localStorage.getItem('empId');
        console.log('🔄 Fetching data with empId:', empId);
        const result = await getApplicationStatus(null, empId); // Pass null for campusId since employee-based API doesn't need it
       
        // Handle nested API response structure
        let actualData = result;
        if (Array.isArray(result) && result.length === 2 && result[0] === "java.util.ArrayList") {
          actualData = result[1];
        } else if (Array.isArray(result) && result.length > 0 && typeof result[0] === "string") {
          // If first element is a string, the actual data is likely in the second element
          actualData = result[1] || result;
        }
       
        const normalized = normalizeApiResponse(Array.isArray(actualData) ? actualData : []);
        
        console.log('✅ Data fetched successfully, normalized length:', normalized.length);
        
        if (normalized.length === 0) {
          console.warn("No data found! This might be because:");
          console.warn("1. The employee has no applications assigned");
          console.warn("2. The new API endpoint is not working");
          console.warn("3. The data format has changed");
        }
        
        setData(normalized);
      } catch (err) {
        console.error("Error fetching application status:", err);
        setError(err.message || "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
        console.log('🏁 Data fetch completed');
      }
    };
    fetchData();
  }, [selectedCampus, location.pathname]); // Add location.pathname to re-fetch when route changes

  return { data, setData, loading, error };
};
