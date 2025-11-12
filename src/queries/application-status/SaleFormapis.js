import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/student-admissions-sale'; // Backend URL
const DISTRIBUTION_API_BASE_URL = 'http://localhost:8080/distribution/gets'; // Distribution API base URL

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
  });
  throw error.response?.data || error.message || 'An error occurred';
};

// Helper function to handle nested API response structure
const processApiResponse = (responseData, apiName) => {
  console.log(`${apiName} API response:`, responseData);
 
  // Handle nested API response structure
  let actualData = responseData;
  if (Array.isArray(responseData) && responseData.length === 2 && responseData[0] === "java.util.ArrayList") {
    actualData = responseData[1];
  } else if (Array.isArray(responseData) && responseData.length > 0 && typeof responseData[0] === "string") {
    actualData = responseData[1] || responseData;
  }
 
  console.log(`Processed ${apiName} data:`, actualData);
  return actualData;
};

// API calls for dropdowns (aligned with backend endpoints)
export const fetchAdmissionTypes = async () => {
  try {
    console.log("🔍 === FETCHING ADMISSION TYPES API ===");
    console.log("🔍 API URL:", `${API_BASE_URL}/admission-types`);
    
    const response = await fetch(`${API_BASE_URL}/admission-types`);
    console.log("🔍 Admission types API response status:", response.status);
    console.log("🔍 Admission types API response ok:", response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("🔍 Admission types API response data:", data);
    console.log("🔍 Response data type:", typeof data);
    console.log("🔍 Is response data array:", Array.isArray(data));
    console.log("🔍 Response data length:", data?.length);
   
    // Handle nested API response structure
    let actualData = data;
    if (Array.isArray(data) && data.length === 2 && data[0] === "java.util.ArrayList") {
      actualData = data[1];
      console.log("🔍 Detected nested ArrayList structure, using index 1");
    } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
      actualData = data[1] || data;
      console.log("🔍 Detected string array structure, using index 1 or fallback");
    }
   
    console.log("🔍 Processed admission types data:", actualData);
    console.log("🔍 === END ADMISSION TYPES API ===");
    return actualData;
  } catch (error) {
    console.error("❌ Error fetching admission types:", error);
    handleApiError(error);
  }
};

export const fetchStudentTypes = async () => {
  try {
    console.log("🔍 === FETCHING STUDENT TYPES API ===");
    console.log("🔍 API URL:", `${API_BASE_URL}/student-types`);
    
    const response = await fetch(`${API_BASE_URL}/student-types`);
    console.log("🔍 Student types API response status:", response.status);
    console.log("🔍 Student types API response ok:", response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("🔍 Student types API response data:", data);
    console.log("🔍 Response data type:", typeof data);
    console.log("🔍 Is response data array:", Array.isArray(data));
    console.log("🔍 Response data length:", data?.length);
   
    // Handle nested API response structure
    let actualData = data;
    if (Array.isArray(data) && data.length === 2 && data[0] === "java.util.ArrayList") {
      actualData = data[1];
      console.log("🔍 Detected nested ArrayList structure, using index 1");
    } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
      actualData = data[1] || data;
      console.log("🔍 Detected string array structure, using index 1 or fallback");
    }
   
    console.log("🔍 Processed student types data:", actualData);
    console.log("🔍 === END STUDENT TYPES API ===");
    return actualData;
  } catch (error) {
    console.error("❌ Error fetching student types:", error);
    handleApiError(error);
  }
};

export const fetchGenders = async () => {
  try {
    console.log("🔍 === FETCHING GENDERS API ===");
    console.log("🔍 API URL:", `${API_BASE_URL}/genders`);
    
    const response = await fetch(`${API_BASE_URL}/genders`);
    console.log("🔍 Genders API response status:", response.status);
    console.log("🔍 Genders API response ok:", response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("🔍 Genders API response data:", data);
    console.log("🔍 Response data type:", typeof data);
    console.log("🔍 Is response data array:", Array.isArray(data));
    console.log("🔍 Response data length:", data?.length);
   
    // Handle nested API response structure
    let actualData = data;
    if (Array.isArray(data) && data.length === 2 && data[0] === "java.util.ArrayList") {
      actualData = data[1];
      console.log("🔍 Detected nested ArrayList structure, using index 1");
    } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
      actualData = data[1] || data;
      console.log("🔍 Detected string array structure, using index 1 or fallback");
    }
   
    console.log("🔍 Processed genders data:", actualData);
    console.log("🔍 === END GENDERS API ===");
    return actualData;
  } catch (error) {
    console.error("❌ Error fetching genders:", error);
    handleApiError(error);
  }
};

export const getSections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sections`, {
      headers: { "Content-Type": "application/json" },
    });
   
    // Use our helper function to process the response
    const processedData = processApiResponse(response.data, "sections");
   
    // Additional processing for sections if needed
    if (processedData && typeof processedData === 'object') {
      return Array.isArray(processedData) ? processedData : [processedData];
    }
    return [];
  } catch (error) {
    console.error("Error fetching sections:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const fetchCampuses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/campuses`);
    return processApiResponse(response.data, "campuses");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return processApiResponse(response.data, "courses");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchClasses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classes`);
    return processApiResponse(response.data, "classes");
  } catch (error) {
    handleApiError(error);
  }
};

// export const fetchCourseBatches = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/course-batches`);
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };


export const fetchQuotas = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quotas`);
    return processApiResponse(response.data, "quotas");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchRelationTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/relation-types`);
    return processApiResponse(response.data, "relation-types");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCityById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/city/${id}`);
    return processApiResponse(response.data, "city-by-id");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchOrientationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orientation/${id}`);
    return processApiResponse(response.data, "orientation-by-id");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchMandalById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mandal/${id}`);
    return processApiResponse(response.data, "mandal-by-id");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchConcessionReasonById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/concession-reason/${id}`);
    return processApiResponse(response.data, "concession-reason-by-id");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchConcessionReasons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/concession-reasons`);
    return processApiResponse(response.data, "concession-reasons");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchOrganizationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/organization/${id}`);
    return processApiResponse(response.data, "organization-by-id");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchBankById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bank/${id}`);
    return processApiResponse(response.data, "bank-by-id");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees`, {
      headers: { "Content-Type": "application/json" },
    });
    return processApiResponse(response.data, "employees");
  } catch (error) {
    handleApiError(error);
  }
};

export const submitAdmissionForm = async (formData) => {
  try {
    console.log("🚀 ===== SUBMITTING TO BACKEND =====");
    console.log("📋 Complete Form Data being sent:", JSON.stringify(formData, null, 2));
   
    // Check for null/undefined ID fields that might cause the error
    const nullIdFields = [];
    const checkForNullIds = (obj, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        if (key.toLowerCase().includes('id') && (value === null || value === undefined || value === '')) {
          nullIdFields.push(`${prefix}${key}: ${value}`);
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          checkForNullIds(value, `${prefix}${key}.`);
        }
      });
    };
   
    checkForNullIds(formData);
   
    if (nullIdFields.length > 0) {
      console.log("⚠️ NULL ID FIELDS FOUND:", nullIdFields);
    } else {
      console.log("✅ No null ID fields found");
    }
   
    console.log("🚀 ===== END BACKEND SUBMISSION =====");
   
    const response = await axios.post(`${API_BASE_URL}/create`, formData);
    return response.data;
  } catch (error) {
    console.error("❌ Backend submission failed:", error);
    handleApiError(error);
  }
};

export const getApplicationDetails = async (applicationNo) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/applications/${applicationNo}`, {
      headers: { "Content-Type": "application/json" },
    });
    return processApiResponse(response.data, "application-details");
  } catch (error) {
    console.error("Error fetching application details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// New APIs for distribution-based endpoints
export const fetchDistributionStates = async () => {
  try {
    const url = `${DISTRIBUTION_API_BASE_URL}/states`;
    console.log("=== API Call Details ===");
    console.log("Base URL:", DISTRIBUTION_API_BASE_URL);
    console.log("Full URL:", url);
    console.log("Making request to:", url);
   
    const response = await axios.get(url);
    console.log("=== API Response Details ===");
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("Response data:", response.data);
    console.log("Response data type:", typeof response.data);
    console.log("Is response data array:", Array.isArray(response.data));
   
    const processedData = processApiResponse(response.data, "distribution-states");
    console.log("=== Processed Data ===");
    console.log("Processed data:", processedData);
    console.log("Processed data type:", typeof processedData);
    console.log("Is processed data array:", Array.isArray(processedData));
   
    return processedData;
  } catch (error) {
    console.error("=== API Error Details ===");
    console.error("Error object:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Request URL:", error.config?.url);
    handleApiError(error);
  }
};

export const fetchDistrictsByDistributionState = async (stateId) => {
  try {
    const response = await axios.get(`${DISTRIBUTION_API_BASE_URL}/districts/${stateId}`);
    return processApiResponse(response.data, "districts-by-state");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchCitiesByDistributionDistrict = async (districtId) => {
  try {
    const response = await axios.get(`${DISTRIBUTION_API_BASE_URL}/cities/${districtId}`);
    return processApiResponse(response.data, "cities-by-district");
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchMandalsByDistributionDistrict = async (districtId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mandals/${districtId}`);
    return processApiResponse(response.data, "mandals-by-district");
  } catch (error) {
    handleApiError(error);
  }
};

// New APIs for Payment Info Section
export const fetchOrganizations = async () => {
  try {
    console.log("Fetching organizations from:", `${API_BASE_URL}/organizations`);
    const response = await axios.get(`${API_BASE_URL}/organizations`);
    return processApiResponse(response.data, "organizations");
  } catch (error) {
    console.error("Error fetching organizations:", error);
    handleApiError(error);
  }
};

export const fetchCities = async () => {
  try {
    console.log("Fetching cities from:", `${DISTRIBUTION_API_BASE_URL}/cities`);
    const response = await axios.get(`${DISTRIBUTION_API_BASE_URL}/cities`);
    return processApiResponse(response.data, "cities");
  } catch (error) {
    console.error("Error fetching cities:", error);
    handleApiError(error);
  }
};

export const fetchBanksByOrganization = async (organizationId) => {
  try {
    console.log("Fetching banks for organization:", organizationId);
    const response = await axios.get(`${API_BASE_URL}/banks/${organizationId}`);
    return processApiResponse(response.data, "banks");
  } catch (error) {
    console.error("Error fetching banks by organization:", error);
    handleApiError(error);
  }
};

export const fetchBranchesByOrganizationAndBank = async (organizationId, bankId) => {
  try {
    console.log("Fetching branches for organization:", organizationId, "and bank:", bankId);
    const response = await axios.get(`${API_BASE_URL}/branches/${organizationId}/${bankId}`);
    return processApiResponse(response.data, "branches");
  } catch (error) {
    console.error("Error fetching branches by organization and bank:", error);
    handleApiError(error);
  }
};

// New APIs for Concession Info Section
export const fetchAuthorizedByAll = async () => {
  try {
    console.log("Fetching authorized by all from:", `${API_BASE_URL}/authorizedBy/all`);
    const response = await axios.get(`${API_BASE_URL}/authorizedBy/all`);
    return processApiResponse(response.data, "authorized-by");
  } catch (error) {
    console.error("Error fetching authorized by all:", error);
    handleApiError(error);
  }
};

export const fetchConcessionReasonAll = async () => {
  try {
    console.log("Fetching concession reason all from:", `${API_BASE_URL}/concessionReson/all`);
    const response = await axios.get(`${API_BASE_URL}/concessionReson/all`);
    return processApiResponse(response.data, "concession-reasons");
  } catch (error) {
    console.error("Error fetching concession reason all:", error);
    handleApiError(error);
  }
};

// Fetch classes by campus for GeneralInfoSection
export const fetchClassesByCampus = async (campusId) => {
  try {
    console.log("🔍 === FETCHING CLASSES BY CAMPUS API ===");
    console.log("🔍 Campus ID:", campusId);
    console.log("🔍 API URL:", `${API_BASE_URL}/classes/by-campus/${campusId}`);
    console.log("🔍 Full URL:", `http://localhost:8080/api/student-admissions-sale/classes/by-campus/${campusId}`);
    
    // Use fetch instead of axios to match the working pattern
    const response = await fetch(`${API_BASE_URL}/classes/by-campus/${campusId}`);
    console.log("🔍 Classes by campus API response status:", response.status);
    console.log("🔍 Classes by campus API response ok:", response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("🔍 Classes by campus API response data:", data);
    console.log("🔍 Response data type:", typeof data);
    console.log("🔍 Is response data array:", Array.isArray(data));
    console.log("🔍 Response data length:", data?.length);
    
    // Use the same processApiResponse logic but with fetch data
    const processedData = processApiResponse(data, "classes-by-campus");
    console.log("🔍 Processed classes by campus data:", processedData);
    console.log("🔍 === END CLASSES BY CAMPUS API ===");
    
    return processedData;
  } catch (error) {
    console.error("❌ Error fetching classes by campus:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error status:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    handleApiError(error);
  }
};

// Fetch orientations by class for GeneralInfoSection
export const fetchOrientationsByClass = async (classId, cpmsId) => {
  try {
    console.log("Fetching orientations by class from:", `${API_BASE_URL}/orientations/by-class/${classId}`);
    const response = await axios.get(`${API_BASE_URL}/orientations/by-class/${classId}/cmps/${cpmsId}`);
    return processApiResponse(response.data, "orientations-by-class");
  } catch (error) {
    console.error("Error fetching orientations by class:", error);
    handleApiError(error);
  }
};

// Fetch orientation batches for GeneralInfoSection
export const fetchOrientationBatches = async (cmpsId, classId, orientationId) => {
  try {
    console.log("Fetching orientation batches from:", `${API_BASE_URL}/${cmpsId}/${classId}/${orientationId}`);
    const response = await axios.get(`${API_BASE_URL}/${cmpsId}/${classId}/${orientationId}`);
    return processApiResponse(response.data, "orientation-batches");
  } catch (error) {
    console.error("Error fetching orientation batches:", error);
    handleApiError(error);
  }
};

// Fetch orientation details by campus, class, orientation and batch for GeneralInfoSection
export const fetchOrientationDetails = async (cmpsId, classId, orientationId, orientationBatchId) => {
  try {
    console.log("Fetching orientation details from:", `${API_BASE_URL}/${cmpsId}/${classId}/${orientationId}/${orientationBatchId}/details`);
    const response = await axios.get(`${API_BASE_URL}/${cmpsId}/${classId}/${orientationId}/${orientationBatchId}/details`);
    return processApiResponse(response.data, "orientation-details");
  } catch (error) {
    console.error("Error fetching orientation details:", error);
    handleApiError(error);
  }
};

// Fetch school states for GeneralInfoSection
export const fetchSchoolStates = async () => {
  try {
    console.log("Fetching school states from:", `http://localhost:8080/distribution/gets/states`);
    const response = await axios.get(`http://localhost:8080/distribution/gets/states`);
    return processApiResponse(response.data, "school-states");
  } catch (error) {
    console.error("Error fetching school states:", error);
    handleApiError(error);
  }
};

// Fetch school districts by state for GeneralInfoSection
export const fetchSchoolDistricts = async (stateId) => {
  try {
    console.log("Fetching school districts from:", `http://localhost:8080/distribution/gets/districts/${stateId}`);
    const response = await axios.get(`http://localhost:8080/distribution/gets/districts/${stateId}`);
   
    console.log("🔍 Raw school districts API response:", response.data);
    console.log("🔍 Response type:", typeof response.data);
    console.log("🔍 Response keys:", response.data ? Object.keys(response.data) : "No keys");
   
    const processedData = processApiResponse(response.data, "school-districts");
    console.log("🔍 Processed school districts data:", processedData);
    console.log("🔍 Processed data keys:", processedData ? Object.keys(processedData) : "No keys");
   
    return processedData;
  } catch (error) {
    console.error("Error fetching school districts:", error);
    handleApiError(error);
  }
};

// Fetch school types for GeneralInfoSection
export const fetchSchoolTypesNew = async () => {
  try {
    console.log("Fetching school types from:", `${API_BASE_URL}/Type_of_school`);
    const response = await axios.get(`${API_BASE_URL}/Type_of_school`);
    return processApiResponse(response.data, "school-types");
  } catch (error) {
    console.error("Error fetching school types:", error);
    handleApiError(error);
  }
};

// Update the existing fetchSchoolTypes to use the correct endpoint
export const fetchSchoolTypes = async () => {
  try {
    console.log("Fetching school types from:", `${API_BASE_URL}/Type_of_school`);
    const response = await axios.get(`${API_BASE_URL}/Type_of_school`);
    return processApiResponse(response.data, "school-types");
  } catch (error) {
    console.error("Error fetching school types:", error);
    handleApiError(error);
  }
};

// Fetch religions for GeneralInfoSection
export const fetchReligions = async () => {
  try {
    console.log("🔍 === FETCHING RELIGIONS API ===");
    console.log("🔍 API URL:", `${API_BASE_URL}/religions`);
    console.log("🔍 Full URL:", `http://localhost:8080/api/student-admissions-sale/religions`);
    
    // Try using fetch instead of axios to match the working pattern from saleApis.js
    const response = await fetch(`${API_BASE_URL}/religions`);
    console.log("🔍 Religions API response status:", response.status);
    console.log("🔍 Religions API response ok:", response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("🔍 Religions API response data:", data);
    console.log("🔍 Response data type:", typeof data);
    console.log("🔍 Is response data array:", Array.isArray(data));
    console.log("🔍 Response data length:", data?.length);
   
    // Handle nested API response structure
    let actualData = data;
    if (Array.isArray(data) && data.length === 2 && data[0] === "java.util.ArrayList") {
      actualData = data[1];
      console.log("🔍 Detected nested ArrayList structure, using index 1");
    } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
      actualData = data[1] || data;
      console.log("🔍 Detected string array structure, using index 1 or fallback");
    }
   
    console.log("🔍 Processed religions data:", actualData);
    console.log("🔍 Processed data type:", typeof actualData);
    console.log("🔍 Is processed data array:", Array.isArray(actualData));
    console.log("🔍 Processed data length:", actualData?.length);
    console.log("🔍 === END RELIGIONS API ===");
    
    return actualData;
  } catch (error) {
    console.error("❌ Error fetching religions:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error status:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    handleApiError(error);
  }
};

// Fetch castes for GeneralInfoSection
export const fetchCastes = async () => {
  try {
    console.log("Fetching castes from:", `${API_BASE_URL}/castes`);
    const response = await axios.get(`${API_BASE_URL}/castes`);
    console.log("Castes API response:", response.data);
   
    // Handle nested API response structure
    let actualData = response.data;
    if (Array.isArray(response.data) && response.data.length === 2 && response.data[0] === "java.util.ArrayList") {
      actualData = response.data[1];
    } else if (Array.isArray(response.data) && response.data.length > 0 && typeof response.data[0] === "string") {
      actualData = response.data[1] || response.data;
    }
   
    console.log("Processed castes data:", actualData);
    return actualData;
  } catch (error) {
    console.error("Error fetching castes:", error);
    handleApiError(error);
  }
};

// Fetch blood groups for GeneralInfoSection
export const fetchBloodGroups = async () => {
  try {
    console.log("Fetching blood groups from:", `${API_BASE_URL}/BloodGroup/all`);
    const response = await axios.get(`${API_BASE_URL}/BloodGroup/all`);
    console.log("Blood groups API response:", response.data);
   
    // Handle nested API response structure
    let actualData = response.data;
    if (Array.isArray(response.data) && response.data.length === 2 && response.data[0] === "java.util.ArrayList") {
      actualData = response.data[1];
    } else if (Array.isArray(response.data) && response.data.length > 0 && typeof response.data[0] === "string") {
      actualData = response.data[1] || response.data;
    }
   
    console.log("Processed blood groups data:", actualData);
    return actualData;
  } catch (error) {
    console.error("Error fetching blood groups:", error);
    handleApiError(error);
  }
};

// Fetch all student classes for siblings
export const fetchAllStudentClasses = async () => {
  try {
    console.log("Fetching all student classes from:", `${API_BASE_URL}/all/Studentclass`);
    const response = await axios.get(`${API_BASE_URL}/all/Studentclass`);
    return processApiResponse(response.data, "all-student-classes");
  } catch (error) {
    console.error("Error fetching all student classes:", error);
    handleApiError(error);
  }
};

// New cascading dropdown APIs

export const fetchBatchTypeByCampusAndClass = async (campusId, classId) => {
  try {
    console.log("Fetching batch type from:", `${API_BASE_URL}/study-typebycmpsId_and_classId?cmpsId=${campusId}&classId=${classId}`);
    const response = await axios.get(`${API_BASE_URL}/study-typebycmpsId_and_classId?cmpsId=${campusId}&classId=${classId}`);
    return processApiResponse(response.data, "batch-type");
  } catch (error) {
    console.error("Error fetching batch type:", error);
    handleApiError(error);
  }
};

export const fetchOrientationNameByCampusClassAndStudyType = async (campusId, classId, studyTypeId) => {
  try {
    console.log("Fetching orientation name from:", `${API_BASE_URL}/orientationbycmpsId_and_classId_and_studyType?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}`);
    const response = await axios.get(`${API_BASE_URL}/orientationbycmpsId_and_classId_and_studyType?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}`);
    return processApiResponse(response.data, "orientation-name");
  } catch (error) {
    console.error("Error fetching orientation name:", error);
    handleApiError(error);
  }
};

export const fetchOrientationBatchByAllFields = async (campusId, classId, studyTypeId, orientationId) => {
  try {
    console.log("Fetching orientation batch from:", `${API_BASE_URL}/orientation-batchbycmpsId_and_classId_and_studyType_and_orientation?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}&orientationId=${orientationId}`);
    const response = await axios.get(`${API_BASE_URL}/orientation-batchbycmpsId_and_classId_and_studyType_and_orientation?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}&orientationId=${orientationId}`);
    return processApiResponse(response.data, "orientation-batch");
  } catch (error) {
    console.error("Error fetching orientation batch:", error);
    handleApiError(error);
  }
};

export const fetchOrientationStartDateAndFee = async (campusId, classId, studyTypeId, orientationId, orientationBatchId) => {
  try {
    console.log("Fetching orientation details from:", `${API_BASE_URL}/get_orientation_startDate_and_fee?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}&orientationId=${orientationId}&orientationBatchId=${orientationBatchId}`);
    const response = await axios.get(`${API_BASE_URL}/get_orientation_startDate_and_fee?cmpsId=${campusId}&classId=${classId}&studyTypeId=${studyTypeId}&orientationId=${orientationId}&orientationBatchId=${orientationBatchId}`);
   
    console.log("🔍 Raw API response:", response.data);
    console.log("🔍 Response type:", typeof response.data);
    console.log("🔍 Response keys:", response.data ? Object.keys(response.data) : "No keys");
   
    const processedData = processApiResponse(response.data, "orientation-details");
    console.log("🔍 Processed data:", processedData);
    console.log("🔍 Processed data keys:", processedData ? Object.keys(processedData) : "No keys");
   
    return processedData;
  } catch (error) {
    console.error("Error fetching orientation details:", error);
    handleApiError(error);
  }
};

// Default export with all API functions
const apiService = {
  fetchDistributionStates,
  fetchDistrictsByDistributionState,
  fetchCitiesByDistributionDistrict,
  fetchMandalsByDistributionDistrict,
  fetchOrganizations,
  fetchCities,
  fetchBanksByOrganization,
  fetchBranchesByOrganizationAndBank,
  fetchAuthorizedByAll,
  fetchConcessionReasonAll,
  fetchAdmissionTypes,
  fetchStudentTypes,
  fetchGenders,
  getSections,
  fetchCampuses,
  fetchCourses,
  // fetchCourseBatches,
  fetchSchoolTypes,
  fetchQuotas,
  fetchRelationTypes,
  fetchClasses,
  fetchCityById,
  fetchOrientationById,
  fetchMandalById,
  fetchConcessionReasonById,
  fetchConcessionReasons,
  fetchOrganizationById,
  fetchBankById,
  fetchEmployees,
  submitAdmissionForm,
  getApplicationDetails,
  // Aliases for backward compatibility
  getAdmissionTypes: fetchAdmissionTypes,
  getStudentTypes: fetchStudentTypes,
  getGenders: fetchGenders,
  getSections: getSections,
  getCampuses: fetchCampuses,
  getCourses: fetchCourses,
  // getCourseBatches: fetchCourseBatches,
  getSchoolTypes: fetchSchoolTypes,
  getQuotas: fetchQuotas,
  getRelationTypes: fetchRelationTypes,
  getClasses: fetchClasses,
  getCityById: fetchCityById,
  getOrientationById: fetchOrientationById,
  getMandalById: fetchMandalById,
  getConcessionReasonById: fetchConcessionReasonById,
  getConcessionReasons: fetchConcessionReasons,
  getOrganizationById: fetchOrganizationById,
  getBankById: fetchBankById,
  getEmployees: fetchEmployees,
  getOrganizations: fetchOrganizations,
  getCities: fetchCities,
  getBanksByOrganization: fetchBanksByOrganization,
  getBranchesByOrganizationAndBank: fetchBranchesByOrganizationAndBank,
  getAuthorizedByAll: fetchAuthorizedByAll,
  getConcessionReasonAll: fetchConcessionReasonAll,
  // New APIs for GeneralInfoSection
  fetchClassesByCampus,
  fetchOrientationsByClass,
  fetchOrientationBatches,
  fetchOrientationDetails,
  fetchSchoolStates,
  fetchSchoolDistricts,
  fetchSchoolTypes,
  fetchReligions,
  fetchCastes,
  fetchBloodGroups,
  fetchAllStudentClasses,
  // New cascading dropdown APIs
  fetchBatchTypeByCampusAndClass,
  fetchOrientationNameByCampusClassAndStudyType,
  fetchOrientationBatchByAllFields,
  fetchOrientationStartDateAndFee,
};

export default apiService;