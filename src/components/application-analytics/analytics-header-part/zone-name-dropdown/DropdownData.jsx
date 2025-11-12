// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// // Async function to fetch zones from the backend
// export const getZones = async () => {
//   try {
//     const response = await axios.get("http://localhost:8080/api/applications/zones");
//     console.log('API Response:', response.data); // Log just the data
    
//     if (!response.data) {
//       // console.error('No data received from API');
//       return [];
//     }

//     // If the response is wrapped in a data property, extract it
//     const zonesData = response.data.data || response.data;
    
//     // Ensure we're getting an array
//     if (!Array.isArray(zonesData)) {
//       // console.error('API response is not an array:', zonesData);
//       return [];
//     }

//     // Map the data to ensure correct format
//     const formattedZones = zonesData.map(zone => ({
//       id: zone.id || zone._id || zone.zoneId,
//       name: zone.name || zone.zoneName || zone.zone_name || zone.zone
//     }));

//     // console.log('Formatted zones:', formattedZones);
//     return formattedZones;
//   } catch (err) {
//     const message = err?.response?.data?.message || err?.message || "Failed to fetch zones";
//     // console.error("getZones error:", message, err);
//     return [];
//   }
// };

// // React Query hook for fetching zones
// export const useZonesQuery = (options = {}) => {
//   return useQuery({
//     queryKey: ['zones'],
//     queryFn: getZones,
//     ...options,
//   });
// };

// // Export the async function for direct API access
// export const zones = getZones;









// // http://localhost:8080/api/student-admissions-sale/campuses


// // Async function to fetch campuses from the backend
// export const getCampuses = async () => {
//   try {
//     const response = await axios.get("http://localhost:8080/api/student-admissions-sale/campuses");
//     // console.log('Campus API Response:', response.data);
    
//     if (!response.data) {
//       console.error('No campus data received from API');
//       return [];
//     }

//     // If the response is wrapped in a data property, extract it
//     const campusesData = response.data.data || response.data;
    
//     // Ensure we're getting an array
//     if (!Array.isArray(campusesData)) {
//       console.error('Campus API response is not an array:', campusesData);
//       return [];
//     }

//     // Map the data to ensure correct format
//     const formattedCampuses = campusesData.map(campus => ({
//       id: campus.id || campus._id || campus.campusId,
//       name: campus.name || campus.campusName || campus.campus_name || campus.campus
//     }));

//     console.log('Formatted campuses:', formattedCampuses);
//     return formattedCampuses;
//   } catch (err) {
//     const message = err?.response?.data?.message || err?.message || "Failed to fetch campuses";
//     // console.error("getCampuses error:", message, err);
//     return [];
//   }
// };

// // React Query hook for fetching campuses
// export const useCampusesQuery = (options = {}) => {
//   return useQuery({
//     queryKey: ['campuses'],
//     queryFn: getCampuses,
//     ...options,
//   });
// };



// // Static DGM data
// const staticDgms = [
//   { id: 1, name: "DGM 1" },
//   { id: 2, name: "DGM 2" },
//   { id: 3, name: "DGM 3" },
// ];







import axios from "axios";
import { useQuery } from "@tanstack/react-query";

//
// ==========================
// 🔹 ZONES
// ==========================
export const getZones = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/applications/zones");
    console.log("API Response:", response.data);

    if (!response.data) return [];

    const zonesData = response.data.data || response.data;

    if (!Array.isArray(zonesData)) return [];

    const formattedZones = zonesData.map((zone) => ({
      id: zone.id || zone._id || zone.zoneId,
      name: zone.name || zone.zoneName || zone.zone_name || zone.zone,
    }));

    return formattedZones;
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || "Failed to fetch zones";
    console.error("getZones error:", message, err);
    return [];
  }
};

export const useZonesQuery = (options = {}) => {
  return useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
    ...options,
  });
};

export const zones = getZones;

//
// ==========================
// 🔹 CAMPUSES
// ==========================
export const getCampuses = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/student-admissions-sale/campuses");
    console.log("Campus API Response:", response.data);

    if (!response.data) return [];

    const campusesData = response.data.data || response.data;

    if (!Array.isArray(campusesData)) return [];

    const formattedCampuses = campusesData.map((campus) => ({
      id: campus.id || campus._id || campus.campusId,
      name: campus.name || campus.campusName || campus.campus_name || campus.campus,
    }));

    console.log("Formatted campuses:", formattedCampuses);
    return formattedCampuses;
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || "Failed to fetch campuses";
    console.error("getCampuses error:", message, err);
    return [];
  }
};

export const useCampusesQuery = (options = {}) => {
  return useQuery({
    queryKey: ["campuses"],
    queryFn: getCampuses,
    ...options,
  });
};

//
// ==========================
// 🔹 DGMs
// ==========================
export const getDgms = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/dashboard/CO/dgm-employees");
    console.log("DGM API Response:", response.data);

    if (!response.data) return [];

    const dgmsData = response.data.data || response.data;

    if (!Array.isArray(dgmsData)) return [];

    const formattedDgms = dgmsData.map((dgm) => ({
      id: dgm.id || dgm._id || dgm.dgmId || dgm.empId,
      name: dgm.name || dgm.fullName || dgm.empName || dgm.employeeName || dgm.dgmName,
    }));

    console.log("Formatted DGMs:", formattedDgms);
    return formattedDgms;
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || "Failed to fetch DGMs";
    console.error("getDgms error:", message, err);
    return [];
  }
};

export const useDgmsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["dgms"],
    queryFn: getDgms,
    ...options,
  });
};

export const dgms = getDgms;
