import { useState, useEffect } from 'react';
import apiService from '../../../../../queries/application-status/SaleFormapis';
import { processStatesData, processDistrictsData, processCitiesAndMandalsData } from '../utils/dataProcessors';

/**
 * Custom hook for AddressInfoSection data fetching
 * Extracted from AddressInfoSection.js lines 71-278
 * Preserves every single line and functionality exactly as manager wants
 */
export const useAddressData = (values, setFieldValue) => {
  const [dropdownOptions, setDropdownOptions] = useState({
    states: [],
    cities: [],
    districts: [],
    mandals: [],
  });

  // Fetch initial states
  useEffect(() => {
    const fetchInitialStates = async () => {
      try {
        console.log("=== Starting to fetch states ===");
        console.log("API Service:", apiService);
        console.log("fetchDistributionStates function:", apiService.fetchDistributionStates);
       
        const states = await apiService.fetchDistributionStates();
        const processedStates = processStatesData(states);
       
        setDropdownOptions((prev) => {
          const newOptions = {
            ...prev,
            states: processedStates,
          };
          console.log("Updated dropdown options:", newOptions);
          return newOptions;
        });
       
        if (processedStates.length === 0) {
          setDropdownOptions((prev) => ({
            ...prev,
            states: [],
          }));
        }
      } catch (error) {
        console.error("=== Error fetching initial states ===");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        setDropdownOptions((prev) => ({ ...prev, states: [] }));
        alert(`Failed to load states: ${error.message || 'Please check the server or try again later.'}`);
      }
    };
    fetchInitialStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (values.stateId) {
        try {
          console.log("Fetching districts for stateId:", values.stateId);
          const districts = await apiService.fetchDistrictsByDistributionState(values.stateId);
          const processedDistricts = processDistrictsData(districts);
         
          setDropdownOptions((prev) => ({
            ...prev,
            districts: processedDistricts,
            cities: [], // Reset cities
            mandals: [], // Reset mandals
          }));
          setFieldValue("district", ""); // Reset district
          setFieldValue("addressCity", ""); // Reset city
          setFieldValue("mandal", ""); // Reset mandal
        } catch (error) {
          console.error("Error fetching districts:", error);
          setDropdownOptions((prev) => ({ ...prev, districts: [], cities: [], mandals: [] }));
        }
      }
    };
    fetchDistricts();
  }, [values.stateId, setFieldValue]);

  // Fetch cities and mandals when district changes
  useEffect(() => {
    const fetchCitiesAndMandals = async () => {
      if (values.district) {
        try {
          console.log("Fetching cities and mandals for districtId:", values.district);
          const [cities, mandals] = await Promise.all([
            apiService.fetchCitiesByDistributionDistrict(values.district),
            apiService.fetchMandalsByDistributionDistrict(values.district),
          ]);
          const processed = processCitiesAndMandalsData(cities, mandals);
         
          setDropdownOptions((prev) => ({
            ...prev,
            cities: processed.cities,
            mandals: processed.mandals,
          }));
          setFieldValue("addressCity", ""); // Reset city
          setFieldValue("mandal", ""); // Reset mandal
        } catch (error) {
          console.error("Error fetching cities or mandals:", error);
          setDropdownOptions((prev) => ({ ...prev, cities: [], mandals: [] }));
        }
      }
    };
    fetchCitiesAndMandals();
  }, [values.district, setFieldValue]);

  return {
    dropdownOptions,
    setDropdownOptions,
  };
};
