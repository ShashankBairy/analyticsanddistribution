import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ANALYTICS_GET_ADMIN = "http://localhost:8080/api/applications";
const DISTRIBUTION_GETS = "http://localhost:8080/distribution/gets";

// ----------------------
// 💰 Amount APIs
// ----------------------
const getAllAmounts = async (empId, academicYearId) => {
  console.log("💰 API CALL: getAllAmounts", { empId, academicYearId });
  const url = `${DISTRIBUTION_GETS}/getallamounts/${empId}/${academicYearId}`;
  console.log("💰 API URL:", url);
 
  try {
    const { data } = await axios.get(url);
    console.log("💰 API RESPONSE: getAllAmounts data:", data);
    console.log("💰 API RESPONSE type:", typeof data, "isArray:", Array.isArray(data));
    return data;
  } catch (error) {
    console.error("💰 API ERROR: getAllAmounts failed", error);
    throw error;
  }
};

// ----------------------
// 📊 Admin APIs
// ----------------------
const getAllZones = async () =>
  (await axios.get(`${ANALYTICS_GET_ADMIN}/zones`)).data;

const getAllDgms = async () =>
  (await axios.get(`${ANALYTICS_GET_ADMIN}/dgmcampuses`)).data;

const getAllCampuses = async () =>
  (await axios.get(`${ANALYTICS_GET_ADMIN}/campuses`)).data;

// ----------------------
// 🧾 Zonal Accountant & DGM APIs
// ----------------------
const getDgmsForZonalAccountant = async (empId) => {
  if (!empId) return [];
  const { data } = await axios.get(
    `${DISTRIBUTION_GETS}/dgmforzonal_accountant/${empId}`
  );
  return data;
};

const getCampusesForZonalAccountant = async (empId) => {
  if (!empId) return [];
  const { data } = await axios.get(
    `${DISTRIBUTION_GETS}/campusesforzonal_accountant/${empId}`
  );
  return data;
};

const getCampusesByDgmEmpId = async (empId) => {
  if (!empId) return [];
  const { data } = await axios.get(
    `${DISTRIBUTION_GETS}/campusesfordgm/${empId}`
  );
  return data;
};

// ----------------------
// 📊 Metrics APIs
// ----------------------
const getMetricsForAdmin = async (employeeId) => {
  if (!employeeId) {
    console.warn("⚠️ getMetricsForAdmin: employeeId is required");
    return null;
  }
  const url = `http://localhost:8080/api/analytics/cards_graph?employeeId=${employeeId}`;
  console.log("📊 API CALL: getMetricsForAdmin", { employeeId, url });
  try {
    const response = await axios.get(url);
    console.log("📊 API RESPONSE: Full response object:", response);
    console.log("📊 API RESPONSE: response.data:", response.data);
    console.log("📊 API RESPONSE: response.data type:", typeof response.data);
    console.log("📊 API RESPONSE: Is response.data an array?", Array.isArray(response.data));
    console.log("📊 API RESPONSE: response.data keys:", response.data ? Object.keys(response.data) : "null");
   
    const data = response.data;
   
    // Log the structure in detail
    if (data && typeof data === 'object') {
      console.log("📊 API RESPONSE: data.metricCards:", data.metricCards);
      console.log("📊 API RESPONSE: metricCards is array?", Array.isArray(data.metricCards));
      if (Array.isArray(data.metricCards)) {
        console.log("📊 API RESPONSE: metricCards length:", data.metricCards.length);
        console.log("📊 API RESPONSE: First card:", data.metricCards[0]);
      }
    }
   
    return data;
  } catch (error) {
    console.error("📊 API ERROR: getMetricsForAdmin failed", error);
    console.error("📊 API ERROR: error.response?.data:", error.response?.data);
    throw error;
  }
};

const getMetricsForEmployee = async (empId) => {
  if (!empId) return null;
  const { data } = await axios.get(`http://localhost:8080/api/analytics/${empId}`);
  return data;
};

// ----------------------
// 📈 Graph Data APIs (for Accordions)
// ----------------------
const getGraphDataForAdmin = async (employeeId) => {
  if (!employeeId) {
    console.warn("⚠️ getGraphDataForAdmin: employeeId is required");
    return null;
  }
  const url = `http://localhost:8080/api/analytics/cards_graph?employeeId=${employeeId}`;
  console.log("📈 API CALL: getGraphDataForAdmin", { employeeId, url });
  const { data } = await axios.get(url);
  console.log("📈 API RESPONSE: getGraphDataForAdmin data:", data);
  return data;
};

const getGraphDataForEmployee = async (empId) => {
  if (!empId) return null;
  const { data } = await axios.get(`http://localhost:8080/api/analytics/${empId}`);
  return data;
};

// ----------------------
// 📊 Analytics for Selected Zone/Campus/DGM
// ----------------------
const getAnalyticsForZone = async (zoneId) => {
  console.log("🔵 API CALL: getAnalyticsForZone with zoneId:", zoneId);
  if (!zoneId) return null;
  const { data } = await axios.get(`http://localhost:8080/api/analytics/zone/${zoneId}`);
  console.log("🔵 API RESPONSE: getAnalyticsForZone data:", data);
  return data;
};

const getAnalyticsForCampus = async (campusId) => {
  console.log("🟢 API CALL: getAnalyticsForCampus with campusId:", campusId);
  if (!campusId) return null;
  const { data } = await axios.get(`http://localhost:8080/api/analytics/campus/${campusId}`);
  console.log("🟢 API RESPONSE: getAnalyticsForCampus data:", data);
  return data;
};

// ----------------------
// 📊 Flexible Graph API (supports zoneId, campusId, amount - all optional)
// ----------------------
const buildFlexibleGraphUrl = (zoneId, campusId, amount) => {
  const baseUrl = "http://localhost:8080/api/analytics/flexible-graph";
  const params = new URLSearchParams();
 
  // Add parameters only if they exist and are valid (not null, undefined, or empty)
  // Only pass the parameter that's actually selected (zoneId OR campusId, not both)
 
  // Validate and convert parameters - ensure they're not null/undefined/empty
  // Note: amount can be 0, which is a valid value
  const hasZoneId = zoneId != null && zoneId !== "" && zoneId !== undefined;
  const hasCampusId = campusId != null && campusId !== "" && campusId !== undefined;
  const hasAmount = amount != null && amount !== "" && amount !== undefined; // Allow 0 as valid amount
 
  // Only add zoneId if we have it AND don't have campusId
  if (hasZoneId && !hasCampusId) {
    params.append("zoneId", String(zoneId));
  }
 
  // Only add campusId if we have it (prioritize campusId if both exist)
  if (hasCampusId) {
    params.append("campusId", String(campusId));
  }
 
  // Add amount if we have it
  if (hasAmount) {
    params.append("amount", String(amount));
  }
 
  // Build final URL
  const queryString = params.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
 
  console.log("🔗 Built URL:", finalUrl);
  console.log("🔗 Parameters:", { zoneId, campusId, amount, hasZoneId, hasCampusId, hasAmount });
  return finalUrl;
};

const getFlexibleGraph = async (zoneId, campusId, amount) => {
  console.log("🟣 API CALL: getFlexibleGraph with:", {
    zoneId,
    zoneIdType: typeof zoneId,
    campusId,
    campusIdType: typeof campusId,
    amount,
    amountType: typeof amount
  });
 
  const url = buildFlexibleGraphUrl(zoneId, campusId, amount);
  console.log("🟣 API URL:", url);
  console.log("🟣 Final URL being called:", url);
 
  try {
    const { data } = await axios.get(url);
    console.log("🟣 API RESPONSE: getFlexibleGraph data:", data);
    return data;
  } catch (error) {
    console.error("🟣 API ERROR: getFlexibleGraph failed");
    console.error("🟣 Error URL:", url);
    console.error("🟣 Error details:", error.response?.data || error.message);
    throw error;
  }
};

// ----------------------
// ⚙️ React Query Hooks (accept options)
// ----------------------

// ✅ Admin
export const useGetAllZones = (options = {}) =>
  useQuery({
    queryKey: ["Get All Zones"],
    queryFn: getAllZones,
    ...options,
  });

export const useGetAllDgms = (options = {}) =>
  useQuery({
    queryKey: ["Get All DGMs"],
    queryFn: getAllDgms,
    ...options,
  });

export const useGetAllCampuses = (options = {}) =>
  useQuery({
    queryKey: ["Get All Campuses"],
    queryFn: getAllCampuses,
    ...options,
  });

// ✅ Zonal Accountant & DGM
export const useGetDgmsForZonalAccountant = (empId, options = {}) =>
  useQuery({
    queryKey: ["Get DGMs for Zonal Accountant", empId],
    queryFn: () => getDgmsForZonalAccountant(empId),
    enabled: !!empId && (options.enabled ?? true),
    ...options,
  });

export const useGetCampuesForZonalAccountant = (empId, options = {}) =>
  useQuery({
    queryKey: ["Get Campuses for Zonal Accountant", empId],
    queryFn: () => getCampusesForZonalAccountant(empId),
    enabled: !!empId && (options.enabled ?? true),
    ...options,
  });

export const useGetCampuesForDgmEmpId = (empId, options = {}) =>
  useQuery({
    queryKey: ["Get Campuses for DGM", empId],
    queryFn: () => getCampusesByDgmEmpId(empId),
    enabled: !!empId && (options.enabled ?? true),
    ...options,
  });

// ✅ Metrics
export const useGetMetricsForAdmin = (employeeId, options = {}) =>
  useQuery({
    queryKey: ["Get Metrics for Admin", employeeId],
    queryFn: () => getMetricsForAdmin(employeeId),
    enabled: !!employeeId && (options.enabled ?? true),
    ...options,
  });

export const useGetMetricsForEmployee = (empId, options = {}) =>
  useQuery({
    queryKey: ["Get Metrics for Employee", empId],
    queryFn: () => getMetricsForEmployee(empId),
    enabled: !!empId && (options.enabled ?? true),
    ...options,
  });

// ✅ Graph Data (for Accordions)
export const useGetGraphDataForAdmin = (employeeId, options = {}) =>
  useQuery({
    queryKey: ["Get Graph Data for Admin", employeeId],
    queryFn: () => getGraphDataForAdmin(employeeId),
    enabled: !!employeeId && (options.enabled ?? true),
    ...options,
  });

export const useGetGraphDataForEmployee = (empId, options = {}) =>
  useQuery({
    queryKey: ["Get Graph Data for Employee", empId],
    queryFn: () => getGraphDataForEmployee(empId),
    enabled: !!empId && (options.enabled ?? true),
    ...options,
  });

// ✅ Analytics for Selected Zone/Campus/DGM
export const useGetAnalyticsForZone = (zoneId, options = {}) =>
  useQuery({
    queryKey: ["Get Analytics for Zone", zoneId],
    queryFn: () => getAnalyticsForZone(zoneId),
    enabled: !!zoneId && (options.enabled ?? true),
    ...options,
  });

export const useGetAnalyticsForCampus = (campusId, options = {}) =>
  useQuery({
    queryKey: ["Get Analytics for Campus", campusId],
    queryFn: () => getAnalyticsForCampus(campusId),
    enabled: !!campusId && (options.enabled ?? true),
    ...options,
  });

// ✅ Flexible Graph (supports zoneId, campusId, amount - all optional)
export const useGetFlexibleGraph = (zoneId, campusId, amount, options = {}) => {
  // Validate that at least one parameter is provided
  // Note: amount can be 0, which is a valid value
  const hasValidParams =
    (zoneId != null && zoneId !== "" && zoneId !== undefined) ||
    (campusId != null && campusId !== "" && campusId !== undefined) ||
    (amount != null && amount !== "" && amount !== undefined); // Allow 0 as valid amount
 
  return useQuery({
    queryKey: ["Get Flexible Graph", zoneId, campusId, amount],
    queryFn: () => getFlexibleGraph(zoneId, campusId, amount),
    enabled: hasValidParams && (options.enabled ?? true),
    ...options,
  });
};

// ✅ Get All Amounts (for Application Price filter)
export const useGetAllAmounts = (empId, academicYearId = 26, options = {}) =>
  useQuery({
    queryKey: ["Get All Amounts", empId, academicYearId],
    queryFn: () => getAllAmounts(empId, academicYearId),
    enabled: !!empId && (options.enabled ?? true),
    ...options,
  });