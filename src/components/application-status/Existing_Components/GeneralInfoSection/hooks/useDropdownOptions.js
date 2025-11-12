import { useEffect, useState } from "react";
import apiService from "../../../../../queries/application-status/SaleFormapis";

export const useDropdownOptions = (setFieldValue) => {
  const [dropdownOptions, setDropdownOptions] = useState({
    appTypes: [],
    studentTypes: [],
    genders: [],
    campuses: [],
    cities: [],
    courses: [],
    quotas: [],
    relationTypes: [],
    classes: [],
    sections: [],
    religions: [],
    castes: [],
    bloodGroups: [],
    schoolStates: [],
    schoolDistricts: [],
    schoolTypes: [],
    joiningClasses: [],
    batchTypes: [],
    orientationNames: [],
    orientationBatchesCascading: [],
  });

  const [loadingStates, setLoadingStates] = useState({
    appTypes: false,
    studentTypes: false,
    genders: false,
    campuses: false,
    cities: false,
    courses: false,
    quotas: false,
    relationTypes: false,
    classes: false,
    sections: false,
    religions: false,
    castes: false,
    bloodGroups: false,
    schoolStates: false,
    schoolDistricts: false,
    schoolTypes: false,
    joiningClasses: false,
    batchTypes: false,
    orientationNames: false,
    orientationBatchesCascading: false,
  });

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      // Set parent name IDs
      setFieldValue("fatherNameId", "1");
      setFieldValue("motherNameId", "2");
     
      // Define all API calls with their corresponding keys
      const apiCalls = [
        { key: 'appTypes', call: () => apiService.fetchAdmissionTypes() },
        { key: 'studentTypes', call: () => apiService.fetchStudentTypes() },
        { key: 'genders', call: () => apiService.fetchGenders() },
        { key: 'campuses', call: () => apiService.fetchCampuses() },
        { key: 'cities', call: () => apiService.getCities() },
        { key: 'courses', call: () => apiService.fetchCourses() },
        { key: 'quotas', call: () => apiService.fetchQuotas() },
        { key: 'relationTypes', call: () => apiService.fetchRelationTypes() },
        { key: 'classes', call: () => apiService.fetchClasses() },
        { key: 'sections', call: () => apiService.getSections() },
        // New API calls
        { key: 'religions', call: () => apiService.fetchReligions() },
        { key: 'castes', call: () => apiService.fetchCastes() },
        { key: 'bloodGroups', call: () => apiService.fetchBloodGroups() },
        { key: 'schoolStates', call: () => apiService.fetchSchoolStates() },
        { key: 'schoolTypes', call: () => apiService.fetchSchoolTypes() },
      ];
     
      // Execute all API calls in parallel
      const results = await Promise.allSettled(
        apiCalls.map(async ({ key, call }) => {
          setLoadingStates(prev => ({ ...prev, [key]: true }));
          
          try {
            const data = await call();
            return { key, data };
          } catch (error) {
            console.error(`Failed to fetch ${key}:`, error);
            return { key, data: [], error };
          } finally {
            setLoadingStates(prev => ({ ...prev, [key]: false }));
          }
        })
      );
     
      // Process results and update dropdown options
      const newOptions = { ...dropdownOptions };
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          const { key, data } = result.value;
          
          // Special debugging for religions
          if (key === 'religions') {
            console.log("🔍 === RELIGIONS DATA PROCESSING ===");
            console.log("🔍 Religions result status:", result.status);
            console.log("🔍 Religions result value:", result.value);
            console.log("🔍 Religions data:", data);
            console.log("🔍 Religions data type:", typeof data);
            console.log("🔍 Is religions data array:", Array.isArray(data));
            console.log("🔍 Religions data length:", data?.length);
            console.log("🔍 Religions error:", result.value.error);
          }
          
          if (data && !result.value.error) {
            // Handle different data structures
            let processedData = data;
            if (!Array.isArray(data)) {
              if (data && typeof data === 'object') {
                processedData = [data];
              } else {
                processedData = [];
              }
            }
           
            // Map the data to the expected format
            const mappedData = processedData.map((item, index) => {
              // Handle different possible field names
              let id = "";
              let label = "";
              
              if (key === 'religions') {
                // Special handling for religions
                id = (item?.id || item?.religionId || index)?.toString() || "";
                label = item?.name || item?.religionName || String(item) || "";
                console.log("🔍 Religion item:", item, "ID:", id, "Label:", label);
              } else {
                // Generic handling for other fields
                id = (item?.id || item?.typeId || item?.genderId || item?.campusId || item?.cityId || item?.courseId || item?.quotaId || item?.relationTypeId || item?.classId || item?.sectionId || item?.religionId || item?.casteId || item?.bloodGroupId || item?.stateId || item?.schoolTypeId || index)?.toString() || "";
                label = item?.name || item?.typeName || item?.genderName || item?.campusName || item?.cityName || item?.courseName || item?.quotaName || item?.relationTypeName || item?.className || item?.sectionName || item?.religionName || item?.casteName || item?.bloodGroupName || item?.stateName || item?.schoolTypeName || String(item) || "";
              }
             
              return { id, label };
            });
           
            // Special debugging for religions
            if (key === 'religions') {
              console.log("🔍 Processed religions data:", processedData);
              console.log("🔍 Mapped religions data:", mappedData);
              console.log("🔍 === END RELIGIONS DATA PROCESSING ===");
            }
           
            newOptions[key] = mappedData;
          } else {
            if (key === 'religions') {
              console.log("🔍 Religions data is empty or has error");
            }
            newOptions[key] = [];
          }
        } else {
          console.error(`API call failed for ${result.reason?.key || 'unknown'}:`, result.reason);
        }
      });
     
      setDropdownOptions(newOptions);
    };
   
    fetchDropdownOptions();
  }, [setFieldValue]);

  return {
    dropdownOptions,
    setDropdownOptions,
    loadingStates,
    setLoadingStates
  };
};
