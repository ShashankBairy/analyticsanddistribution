import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ANALYTICS_GET_ADMIN = "http://localhost:8080/api/applications";
const DISTRIBUTION_GETS = "http://localhost:8080/distribution/gets";

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
