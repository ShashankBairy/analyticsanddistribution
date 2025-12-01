import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";

import {
  useGetStateName,
  useGetCityByStateId,
  useGetZoneByCity,
  useGetAcademicYears,
  useGetEmployeesByZone,
  useGetMobileNo,
  useGetAllFeeAmounts,
  useGetApplicationSeriesForEmpId,
} from "../../../queries/application-distribution/dropdownqueries";

// ---------- LABEL/ID HELPERS ----------
const stateLabel = (s) => s?.stateName ?? s?.name ?? "";
const stateId = (s) => s?.stateId ?? s?.id ?? null;

const yearLabel = (y) =>
  y?.academicYear ?? y?.name ?? String(y?.year ?? y?.id ?? "");
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;

const cityLabel = (c) => c?.cityName ?? c?.name ?? "";
const cityId = (c) => c?.cityId ?? c?.id ?? null;

const zoneLabel = (z) => z?.zoneName ?? z?.name ?? "";
const zoneId = (z) => z?.zoneId ?? z?.id ?? null;

// Employee Name
const empLabel = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(" ").trim() ||
  e?.employeeName ||
  e?.name ||
  "";
const empId = (e) => e?.empId ?? e?.employeeId ?? e?.id ?? null;

const asArray = (v) => (Array.isArray(v) ? v : []);

// ---------------------------------------------------------------------------
//                       ZONE FORM COMPONENT
// ---------------------------------------------------------------------------
const ZoneForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
}) => {
  // ---------------------  SELECTED VALUES -------------------------
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [issuedToEmpId, setIssuedToEmpId] = useState(null);

  const [selectApplicationFee, setSelectedApplicationFee] = useState(null);

  const [customAcademicYear, setCustomAcademicYear] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  // --------------------- INITIAL FORM VALUES -------------------------
  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues.academicYear || "2025-26",
  });

  // --------------------- BASIC DROPDOWNS ----------------------------
  const { data: statesRaw = [] } = useGetStateName();
  const { data: yearsRaw = [] } = useGetAcademicYears();

  const { data: citiesRaw = [] } = useGetCityByStateId(selectedStateId);
  const { data: zonesRaw = [] } = useGetZoneByCity(selectedCityId);
  const { data: employeesRaw = [] } = useGetEmployeesByZone(selectedZoneId);

  const { data: mobileNo } = useGetMobileNo(issuedToEmpId);

  const employeeId = localStorage.getItem("empId");

  // -------------------- APPLICATION FEE ----------------------------
  const { data: applicationFee = [] } = useGetAllFeeAmounts(
    employeeId,
    selectedAcademicYearId
  );

  // -------------------- APPLICATION SERIES -------------------------
  const { data: applicationSeries = [] } = useGetApplicationSeriesForEmpId(
    employeeId,
    selectedAcademicYearId,
    selectApplicationFee,
    false
  );

  console.log("Application Fee:", applicationFee.data);
  console.log("Application Fee Selected:", selectApplicationFee);
  console.log("Application Series:", applicationSeries);

  // --------------------- NORMALIZE ARRAYS --------------------------
  const statesData = useMemo(() => asArray(statesRaw), [statesRaw]);
  const yearsData = useMemo(() => asArray(yearsRaw), [yearsRaw]);
  const citiesData = useMemo(() => asArray(citiesRaw), [citiesRaw]);
  const zonesData = useMemo(() => asArray(zonesRaw), [zonesRaw]);
  const employeesData = useMemo(() => asArray(employeesRaw), [employeesRaw]);

  // ---------------------- BUILD OPTIONS ----------------------------
  const stateNames = useMemo(
    () => statesData.map(stateLabel).filter(Boolean),
    [statesData]
  );

  const academicYearNames = useMemo(() => {
    const allowed = ["2026-27", "2025-26", "2024-25"];
    const apiYears = yearsData.map(yearLabel).filter(Boolean);

    const filtered = allowed
      .filter((y) => apiYears.includes(y))
      .sort((a, b) => Number(b.split("-")[0]) - Number(a.split("-")[0]));

    if (customAcademicYear && !filtered.includes(customAcademicYear)) {
      return [customAcademicYear, ...filtered];
    }

    return filtered;
  }, [yearsData, customAcademicYear]);

  const academicYearSearchOptions = useMemo(
    () => yearsData.map(yearLabel),
    [yearsData]
  );

  const cityNames = citiesData.map(cityLabel);
  const zoneNames = zonesData.map(zoneLabel);
  const issuedToNames = employeesData.map(empLabel);

  // -------------------- LABEL → ID MAPS ---------------------------
  const stateNameToId = useMemo(() => {
    const m = new Map();
    statesData.forEach((s) => m.set(stateLabel(s), stateId(s)));
    return m;
  }, [statesData]);

  const yearNameToId = useMemo(() => {
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

  // -----------------------------------------------------------------------
  //      WHEN PARENT DROPDOWN CHANGES → RESET CHILD DROPDOWNS
  // -----------------------------------------------------------------------
  const handleValuesChange = (values) => {
    // Academic Year
    if (values.academicYear) {
      if (yearNameToId.has(values.academicYear)) {
        const id = yearNameToId.get(values.academicYear);
        if (id !== selectedAcademicYearId) {
          setSelectedAcademicYearId(id);
          setSelectedApplicationFee(null); // reset fee
        }
      } else {
        setCustomAcademicYear(values.academicYear);
        setSelectedAcademicYearId(null);
        setSelectedApplicationFee(null);
      }
    }

    // ---------------- STATE → RESET CITY, ZONE, EMPLOYEE ----------------
    if (values.stateName && stateNameToId.has(values.stateName)) {
      const id = stateNameToId.get(values.stateName);
      if (id !== selectedStateId) {
        setSelectedStateId(id);

        setSelectedCityId(null);
        setSelectedZoneId(null);
        setIssuedToEmpId(null);
        setSelectedApplicationFee(null);
      }
    }

    // ---------------- CITY → RESET ZONE, EMPLOYEE ----------------
    if (values.cityName && cityNameToId.has(values.cityName)) {
      const id = cityNameToId.get(values.cityName);
      if (id !== selectedCityId) {
        setSelectedCityId(id);

        setSelectedZoneId(null);
        setIssuedToEmpId(null);
        setSelectedApplicationFee(null);
      }
    }

    // ---------------- ZONE → RESET EMPLOYEE ----------------
    if (values.zoneName && zoneNameToId.has(values.zoneName)) {
      const id = zoneNameToId.get(values.zoneName);
      if (id !== selectedZoneId) {
        setSelectedZoneId(id);

        setIssuedToEmpId(null);
        setSelectedApplicationFee(null);
      }
    }

    // ---------------- EMPLOYEE SELECTED ----------------
    if (values.issuedTo && empNameToId.has(values.issuedTo)) {
      const id = empNameToId.get(values.issuedTo);
      if (id !== issuedToEmpId) {
        setIssuedToEmpId(id);
      }
    }
  };

  const seriesObj = useMemo(() => {
  if (!selectedSeries) return null;

  const found = applicationSeries.find(
    (s) => s.displaySeries === selectedSeries
  );

  return found || null;
}, [selectedSeries, applicationSeries]);

  const backendValues = useMemo(() => {
    const obj = {};

    if (mobileNo != null) obj.mobileNumber = String(mobileNo);

    if (issuedToEmpId != null) obj.issuedToEmpId = Number(issuedToEmpId);
    if (selectedAcademicYearId != null)
      obj.academicYearId = Number(selectedAcademicYearId);
    if (selectedStateId != null) obj.stateId = Number(selectedStateId);
    if (selectedCityId != null) obj.cityId = Number(selectedCityId);
    if (selectedZoneId != null) obj.zoneId = Number(selectedZoneId);
    if (selectApplicationFee != null)
      obj.applicationFee = Number(selectApplicationFee);

    // ----------------- APPLICATION SERIES → SET FORM VALUES -----------------
      if (seriesObj) {
    obj.applicationSeries      = seriesObj.displaySeries;
    obj.applicationCount       = seriesObj.availableCount;
    obj.availableAppNoFrom     = seriesObj.masterStartNo;
    obj.availableAppNoTo       = seriesObj.masterEndNo;
    obj.applicationNoFrom      = seriesObj.startNo;
  }

    return obj;
  }, [
    mobileNo,
    seriesObj,
    issuedToEmpId,
    selectedAcademicYearId,
    selectedStateId,
    selectedCityId,
    selectedZoneId,
    selectApplicationFee,
  ]);

  // ---------------------------------------------------------------------
  //                 DYNAMIC OPTIONS FOR UI
  // ---------------------------------------------------------------------
  const dynamicOptions = useMemo(
    () => ({
      academicYear: academicYearNames,
      stateName: stateNames,
      cityName: cityNames,
      zoneName: zoneNames,
      issuedTo: issuedToNames,
          applicationFee: Array.isArray(applicationFee)
  ? applicationFee.map((f) => String(f))
  : [],

      // FIX: applicationSeries default fallback
      applicationSeries: Array.isArray(applicationSeries)
        ? applicationSeries.map((s) => s.displaySeries)
        : [],
    }),
    [
      academicYearNames,
      stateNames,
      cityNames,
      zoneNames,
      issuedToNames,
      applicationFee,
      applicationSeries,
    ]
  );

  return (
    <DistributeForm
      formType="Zone"
      initialValues={seedInitialValues}
      onSubmit={onSubmit}
      setIsInsertClicked={setIsInsertClicked}
      dynamicOptions={dynamicOptions}
      backendValues={backendValues}
      searchOptions={{ academicYear: academicYearSearchOptions }}
      onValuesChange={handleValuesChange}
      onApplicationFeeSelect={(fee) => setSelectedApplicationFee(fee)}
      onSeriesSelect={(series) => setSelectedSeries(series)}
      applicationSeriesList={applicationSeries}
      isUpdate={isUpdate}
      editId={editId}
    />
  );
};

export default ZoneForm;
