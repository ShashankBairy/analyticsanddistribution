import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getCampusIdFromCampusName = async(campusName) =>{
  try{
    const reponse = await axios.get(`${API_BASE_URL}/application-confirmation/get/campusName/
      ${campusName}`);
      return reponse;
      console.log("Campus Id :", reponse.data);
  }catch(error){
    console.log(error);
  }
}

export const getProEmployees = async (campusId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/pro-employees/${campusId}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`Pro Employees Response for campusId ${campusId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching pro employees:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getZones = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/zones`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Zones Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching zones:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getDgmEmployees = async (zoneId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/by-dgm/${zoneId}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`DGM Employees Response for zoneId ${zoneId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching dgm employees:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getCampuses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/campuses`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Campuses Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching campuses:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getStatuses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/statuses`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Statuses Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching statuses:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getApplicationDetails = async (applicationNo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/${applicationNo}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`Application Details Response for ${applicationNo}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching application details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getApplicationStatus = async (campusId, empId) => {
  try {
    // For employee-based API, campusId is not required
    // Only validate if we're using campus-based API
    if (campusId && (campusId === "default" || campusId === "All Campuses")) {
      throw new Error("Please select a valid campus ID");
    }
    
    // Get empId from localStorage if not provided
    const employeeId = empId || localStorage.getItem('empId');
    if (!employeeId) {
      throw new Error("Employee ID not found. Please login again.");
    }
    
    console.log(`🔍 Fetching application status for campusId: ${campusId}, empId: ${employeeId}`);
    
    try {
      // Try the new employee-based endpoint first (shows only employee's applications)
      console.log("🔍 Trying employee-based API first...");
      const response = await axios.get(`http://localhost:8080/api/application-status/getview/employee-campus/${employeeId}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("🔍 Employee-based API Response:", response.data);
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : response.data.results || [];
      } else {
        throw new Error("Invalid API response from employee-based endpoint");
      }
    } catch (employeeApiError) {
      console.warn("🔍 Employee-based API failed, trying campus-based API:", employeeApiError.message);
      
      // Only try campus-based API if we have a valid campusId
      if (!campusId) {
        throw new Error("Employee-based API failed and no campus ID provided for fallback");
      }
      
      // Fallback to old campus-based endpoint if employee-based fails
      const response = await axios.get(`http://localhost:8080/api/application-status/getview/${campusId}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("🔍 Campus-based API Response:", response.data);
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : response.data.results || [];
      } else {
        throw new Error("Invalid API response from campus-based endpoint");
      }
    }
  } catch (error) {
    console.error("Error fetching application status:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
 
export const submitApplicationStatus = async (data) => {
  try {
    // Ensure all required fields are present to help backend identify a unique record
    if (!data.applicationNo || !data.statusId || !data.campusId || !data.proId || !data.zoneId || !data.dgmEmpId) {
      throw new Error("Missing required fields in submission data");
    }

    const response = await axios.post(`${API_BASE_URL}/applications/status`, data, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Submit Application Status Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Submit error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    // Check for the specific duplicate result error and enhance the error message
    if (error.response?.status === 400 && error.response?.data?.includes("Query did not return a unique result")) {
      throw new Error(`Submission failed: Multiple statuses found for applicationNo ${data.applicationNo}. Please contact support to resolve duplicates.`);
    }
    throw error;
  }
};
//Concession
export const getConcessionReasons = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/concession-reasons`,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching concession reasons:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
//Conformation

export const getJoinYears = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/dropdownforjoinyear`,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data; // { default: {...}, options: [...] }
  } catch (error) {
    console.error("Error fetching join years:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
export const getCourses = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/course-tracks`,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data; // [{courseTrackId, course_track_name, ...}]
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// ✅ Fetch streams by courseTrackId
export const getStreams = async (courseTrackId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/by-course-track/id/${courseTrackId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data; // [{streamId, streamName, ...}]
  } catch (error) {
    console.error("Error fetching streams:", error);
    throw error;
  }
};
export const getProgramsByStream = async (streamId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/getProgramsByStream?streamId=${streamId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    // API may return an object or array; normalize into an array
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching programs by stream:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
export const getBatchesByCourse = async (courseTrackId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/getbatches/${courseTrackId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching batches by course:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
export const getExamPrograms = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/examprograms`,
      { headers: { "Content-Type": "application/json" } }
    );
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching exam programs:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
export const getSections = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/sections`,
      { headers: { "Content-Type": "application/json" } }
    );
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching sections:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
export const getCourseFee = async (cmpsId, courseTrackId, courseBatchId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/application-confirmation/course-fee/campus/${cmpsId}/track/${courseTrackId}/batch/${courseBatchId}`
    );
    return response.data; // should return fee (float)
  } catch (error) {
    console.error("Error fetching course fee:", error);
    throw error;
  }
};


// Fetch campuses by Zone Id
export const getCampusesByZoneId = async (zoneId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/by-zone/${zoneId}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`Campuses by Zone ID Response for ${zoneId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching campuses by Zone ID:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};


// src/Bakend/apiService.js
export const fetchApplicationDetails = async (applicationNo, campusName) => {
  try {
    console.log("=== FETCH APPLICATION DETAILS DEBUG ===");
    console.log("Fetching application details for applicationNo:", applicationNo);
    console.log("API URL:", `http://localhost:8080/api/applications/details/${applicationNo}`);
    
    const response = await fetch(
      `http://localhost:8080/api/applications/by_campus/damaged_details?appNo=${applicationNo}&campusName=${campusName}`
    );
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    console.log("Response headers:", response.headers);
    
    if (!response.ok) {
      console.log("Response not ok, status:", response.status);
      throw new Error("Failed to fetch application details");
    }
    
    const data = await response.json();
    console.log("=== APPLICATION DETAILS DATA ===");
    console.log("Raw application details data:", data);
    console.log("Data type:", typeof data);
    console.log("Data keys:", data ? Object.keys(data) : "No data");
    console.log("Data structure:", JSON.stringify(data, null, 2));
    console.log("=== END APPLICATION DETAILS DATA ===");
    
    return data;
  } catch (err) {
    console.error("Failed to fetch application details:", err);
    console.log("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    throw err;
  }
};