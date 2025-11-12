import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";
import {
  useGetStateName,
  useGetCityByStateId,
  useGetZoneByCity,
  useGetAcademicYears,
  useGetEmployeesByZone,
  useGetMobileNo,
  useGetNextAppliNo,
  useZoneApplicationNoFromTo,
  useGetAppNumberRange,
  useGetRangeAvailAndApp,
} from "../../../queries/application-distribution/dropdownqueries";
// label/id helpers for your backend shapes
const stateLabel = (s) => s?.stateName ?? s?.name ?? "";
const stateId = (s) => s?.stateId ?? s?.id ?? null;
const yearLabel = (y) =>
  y?.academicYear ?? y?.name ?? String(y?.year ?? y?.id ?? "");
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;
const cityLabel = (c) => c?.cityName ?? c?.name ?? "";
const cityId = (c) => c?.cityId ?? c?.id ?? null;
const zoneLabel = (z) => z?.zoneName ?? z?.name ?? "";
const zoneId = (z) => z?.zoneId ?? z?.id ?? null;
// Employee: { emp_id, first_name, last_name, primary_mobile_no }
const empLabel = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(" ").trim() ||
  e?.employeeName ||
  e?.name ||
  "";
const empId = (e) => e?.empId ?? e?.employeeId ?? e?.id ?? null;
const asArray = (v) => (Array.isArray(v) ? v : []);
// ZoneForm Component
const ZoneForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
}) => {
  // IDs that drive dependent queries
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [issuedToEmpId, setIssuedToEmpId] = useState(null); // Use issuedToEmpId instead of selectedEmployeeId
  // Store custom academic year input
  const [customAcademicYear, setCustomAcademicYear] = useState(null);
  // Seed for Formik (we set once; do not mutate after seeding)
  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues.academicYear || "2025-26", // Set default academicYear
  });
  // one-time seeding guards
  const didSeedRef = useRef({ year: false, state: false });
  // Base lookups
  const { data: statesRaw = [] } = useGetStateName();
  const { data: yearsRaw = [] } = useGetAcademicYears();
  // Dependents
  const { data: citiesRaw = [] } = useGetCityByStateId(selectedStateId);
  const { data: zonesRaw = [] } = useGetZoneByCity(selectedCityId);
  const { data: employeesRaw = [] } = useGetEmployeesByZone(selectedZoneId);
  console.log("Employee of Zone: ", employeesRaw);
  // Mobile number for selected employee
  const { data: mobileNo } = useGetMobileNo(issuedToEmpId); // Use issuedToEmpId instead of selectedEmployeeId

  // const employeeId = localStorage.getItem("empId");

  // Application number range from API (only for inserts)
  const {
    data: appNumberRange,
    error,
    isLoading,
  } = useGetRangeAvailAndApp(selectedAcademicYearId,null,selectedStateId);
  console.log("Fetched App Number Range:", appNumberRange?.data);
  useEffect(() => {
    // Only set app number range for inserts, not updates
    if(isUpdate) return;
    if (appNumberRange?.data) {
      const { nextAvailableNumber,overallAppFrom, overallAppTo } = appNumberRange.data; // Extract from first item
      console.log("Application From To (Insert): ", {  nextAvailableNumber,overallAppFrom, overallAppTo });
      setSeedInitialValues((prevValues) => {
        console.log("Previous seedInitialValues:", prevValues);
        return {
          ...prevValues,
          availableAppNoFrom: String(overallAppFrom),
          availableAppNoTo: String(overallAppTo),
          applicationNoFrom: String(nextAvailableNumber),
        };
      });
    }
  }, [appNumberRange, isUpdate]);
  // Normalize arrays
  const statesData = useMemo(() => asArray(statesRaw), [statesRaw]);
  const yearsData = useMemo(() => asArray(yearsRaw), [yearsRaw]);
  const citiesData = useMemo(() => asArray(citiesRaw), [citiesRaw]);
  const zonesData = useMemo(() => asArray(zonesRaw), [zonesRaw]);
  const employeesData = useMemo(() => asArray(employeesRaw), [employeesRaw]);
  console.log("Employees Data: ", employeesData);
  // Options (string labels)
  const stateNames = useMemo(
    () => statesData.map(stateLabel).filter(Boolean),
    [statesData]
  );
  const academicYearNames = useMemo(() => {
    const allowedYears = [
       "2026-27",
      "2025-26",
      "2024-25",
    ];
    // Get all academic years from API
    const allApiYears = yearsData.map(yearLabel).filter(Boolean);
    // Filter to show only allowed years initially
    const filteredYears = allowedYears
      .filter((year) => allApiYears.includes(year))
      .sort((a, b) => {
        const yearA = parseInt(a.split("-")[0]);
        const yearB = parseInt(b.split("-")[0]);
        return yearB - yearA; // Descending order
      });
    // Add custom academic year if it exists and is not already in the list
    if (customAcademicYear && !filteredYears.includes(customAcademicYear)) {
      return [customAcademicYear, ...filteredYears];
    }
    return filteredYears;
  }, [yearsData, customAcademicYear]);
  // Pass the full list of API years for searching
  const academicYearSearchOptions = useMemo(() => {
    return yearsData.map(yearLabel).filter(Boolean);
  }, [yearsData]);
  const cityNames = useMemo(
    () => citiesData.map(cityLabel).filter(Boolean),
    [citiesData]
  );
  const zoneNames = useMemo(
    () => zonesData.map(zoneLabel).filter(Boolean),
    [zonesData]
  );
  const issuedToNames = useMemo(
    () => employeesData.map(empLabel).filter(Boolean),
    [employeesData]
  );

  console.log("Issued to names: ", issuedToNames);
  // Reverse maps: label → id
  const stateNameToId = useMemo(() => {
    const m = new Map();
    statesData.forEach((s) => m.set(stateLabel(s), stateId(s)));
    return m;
  }, [statesData]);
  const academicYearNameToId = useMemo(() => {
    const m = new Map();
    yearsData.forEach((y) => m.set(yearLabel(y), yearId(y)));
    return m;
  }, [yearsData]);
  const cityNameToId = useMemo(() => {
    const m = new Map();
    citiesData.forEach((c) => m.set(cityLabel(c), cityId(c)));
    return m;
  }, [citiesData]);
  const zoneNameToId = useMemo(() => {
    const m = new Map();
    zonesData.forEach((z) => m.set(zoneLabel(z), zoneId(z)));
    return m;
  }, [zonesData]);
  const empNameToId = useMemo(() => {
    const m = new Map();
    employeesData.forEach((e) => m.set(empLabel(e), empId(e)));
    return m;
  }, [employeesData]);
  // Reflect user selections from DistributeForm
  const handleValuesChange = (values) => {
    // Academic Year
    if (values.academicYear) {
      if (academicYearNameToId.has(values.academicYear)) {
        const ayId = academicYearNameToId.get(values.academicYear);
        if (ayId !== selectedAcademicYearId) setSelectedAcademicYearId(ayId);
      } else {
        // Handle custom academic year input
        setCustomAcademicYear(values.academicYear);
        setSelectedAcademicYearId(null); // No ID for custom input
      }
    }
    // State
    if (values.stateName && stateNameToId.has(values.stateName)) {
      const stId = stateNameToId.get(values.stateName);
      if (stId !== selectedStateId) {
        setSelectedStateId(stId);
        setSelectedCityId(null);
        setSelectedZoneId(null);
        setIssuedToEmpId(null); // Reset employee ID when state changes
      }
    }
    // City
    if (values.cityName && cityNameToId.has(values.cityName)) {
      const ctId = cityNameToId.get(values.cityName);
      if (ctId !== selectedCityId) {
        setSelectedCityId(ctId);
        setSelectedZoneId(null);
        setIssuedToEmpId(null); // Reset employee ID when city changes
      }
    }
    // Zone
    if (values.zoneName && zoneNameToId.has(values.zoneName)) {
      const znId = zoneNameToId.get(values.zoneName);
      if (znId !== selectedZoneId) {
        setSelectedZoneId(znId);
        setIssuedToEmpId(null); // Reset employee ID when zone changes
      }
    }
    // Employee
    if (values.issuedTo && empNameToId.has(values.issuedTo)) {
      const eid = empNameToId.get(values.issuedTo);
      if (eid !== issuedToEmpId) setIssuedToEmpId(eid); // Set the employee ID
    }
  };
  const backendValues = useMemo(() => {
    const obj = {};
    if (mobileNo != null) obj.mobileNumber = String(mobileNo);
    // Only add application number range to backend values for inserts
    if (!isUpdate && appNumberRange) {
      const {nextAvailableNumber, overallAppFrom, overallAppTo } = appNumberRange.data; // Extract from first item
      obj.availableAppNoFrom = String(overallAppFrom);
      obj.availableAppNoTo = String(overallAppTo);
      // obj.selectedBalanceTrackId = Number(id);
      obj.applicationNoFrom = String(nextAvailableNumber);
    }
    // Include issuedToEmpId in backend values
    if (issuedToEmpId != null) obj.issuedToEmpId = Number(issuedToEmpId);
    // Include academicYearId in backend values
    if (selectedAcademicYearId != null)
      obj.academicYearId = Number(selectedAcademicYearId);
    // Include stateId, cityId, and zoneId in backend values
    if (selectedStateId != null) obj.stateId = Number(selectedStateId);
    if (selectedCityId != null) obj.cityId = Number(selectedCityId);
    if (selectedZoneId != null) obj.zoneId = Number(selectedZoneId);
    return obj;
  }, [
    mobileNo,
    appNumberRange,
    issuedToEmpId,
    selectedAcademicYearId,
    selectedStateId,
    selectedCityId,
    selectedZoneId,
    isUpdate,
  ]);
  const appNoFormMode = isUpdate ? "manual" : (appNumberRange?.data ? "middleware" : "manual");
  // const middlewareAppNoFrom = isUpdate ? undefined : (appNumberRange ? String(appNumberRange) : undefined);
  const dynamicOptions = useMemo(
    () => ({
      academicYear: academicYearNames,
      stateName: stateNames,
      cityName: cityNames,
      zoneName: zoneNames,
      issuedTo: issuedToNames,
    }),
    [academicYearNames, stateNames, cityNames, zoneNames, issuedToNames]
  );
  const searchOptions = useMemo(
    () => ({
      academicYear: academicYearSearchOptions,
    }),
    [academicYearSearchOptions]
  );
  return (
    <DistributeForm
      formType="Zone"
      initialValues={seedInitialValues}
      onSubmit={onSubmit}
      setIsInsertClicked={setIsInsertClicked}
      dynamicOptions={dynamicOptions}
      searchOptions={searchOptions}
      backendValues={backendValues}
      appNoFormMode={appNoFormMode}
      // middlewareAppNoFrom={middlewareAppNoFrom}
      onValuesChange={handleValuesChange}
      isUpdate={isUpdate}
      editId={editId}
      skipAppNoPatch={isUpdate}
    />
  );
};
export default ZoneForm;