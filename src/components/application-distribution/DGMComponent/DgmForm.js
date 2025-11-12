import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";
import {
  useGetAcademicYears,
  useGetCities,
  useGetZoneByCity,
  useGetCampusByZone,
  useGetMobileNo,
  useGetDgmsByCampus,
  useGetRangeByEmpId,
  useGetRangeAvailAndApp,
} from "../../../queries/application-distribution/dropdownqueries";

// ---------- Label / ID helpers ----------
const yearLabel = (y) => y?.academicYear ?? y?.name ?? String(y?.year ?? y?.id ?? "");
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;
const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;
const zoneLabel = (z) => z?.zoneName ?? z?.name ?? "";
const zoneId = (z) => z?.zoneId ?? z?.id ?? null;
const campusLabel = (cm) => cm?.name ?? null;
const campusId = (cm) => cm?.id ?? null;
const empLabel = (e) => e?.name ?? null;
const empId = (e) => e?.id ?? null;
const asArray = (v) => (Array.isArray(v) ? v : []);

// ---------- DGM Form ----------
const DgmForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
}) => {
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);

  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues?.academicYear || "2025-26",
  });

  const didSeedRef = useRef({ year: false });

  // ---------- API hooks ----------
  const { data: yearsRaw = [] } = useGetAcademicYears();
  const { data: citiesRaw = [] } = useGetCities();
  const { data: zonesRaw = [] } = useGetZoneByCity(selectedCityId);
  const { data: campusesRaw = [] } = useGetCampusByZone(selectedZoneId);
  const { data: mobileNo } = useGetMobileNo(issuedToId);
  const { data: employess = [] } = useGetDgmsByCampus(selectedCampusId);

  const employeeId = localStorage.getItem("empId");

  // ---------- Primary API ----------
  const {
    data: appNumberRange,
    error: appNumberRangeError,
    isLoading,
  } = useGetRangeByEmpId(employeeId, selectedAcademicYearId);

  // ---------- Fallback API ----------
  const shouldUseFallback =
    appNumberRangeError?.response?.status === 404 ||
    appNumberRangeError?.status === 404;

  const {
    data: fallbackAppRange,
    error: fallbackError,
    isLoading: fallbackLoading,
  } = useGetRangeAvailAndApp(selectedAcademicYearId, selectedCityId, null, {
    enabled: shouldUseFallback && !!selectedAcademicYearId,
  });

  // ---------- Normalize whichever API responds ----------
  const effectiveAppNumberRange = useMemo(() => {
    // ✅ Normalize Fallback API structure
    if (shouldUseFallback && fallbackAppRange?.data) {
      const { nextAvailableNumber, overallAppFrom, overallAppTo } = fallbackAppRange.data;

      return {
        data: {
          appStartNo: overallAppFrom ?? 0,
          appEndNo: overallAppTo ?? 0,
          appFrom: nextAvailableNumber ?? 0,
          appBalanceTrkId: 0, // default since fallback has no track ID
        },
        source: "fallback",
      };
    }

    // ✅ Normal Primary API
    if (appNumberRange?.data) {
      const { appStartNo, appEndNo, appFrom, appBalanceTrkId } = appNumberRange.data;
      return {
        data: {
          appStartNo,
          appEndNo,
          appFrom,
          appBalanceTrkId,
        },
        source: "primary",
      };
    }

    return null;
  }, [shouldUseFallback, fallbackAppRange, appNumberRange]);

  // ---------- Debug which source is used ----------
  useEffect(() => {
    if (effectiveAppNumberRange?.source === "fallback") {
      console.warn("⚠️ Using fallback range-info API (appBalanceTrkId=0)");
    } else if (effectiveAppNumberRange?.source === "primary") {
      console.log("✅ Using primary range-by-emp API");
    }
  }, [effectiveAppNumberRange]);

  // ---------- Normalize Arrays ----------
  const yearsData = useMemo(() => asArray(yearsRaw), [yearsRaw]);
  const citiesData = useMemo(() => asArray(citiesRaw), [citiesRaw]);
  const zonesData = useMemo(() => asArray(zonesRaw), [zonesRaw]);
  const campusesData = useMemo(() => asArray(campusesRaw), [campusesRaw]);
  const employeeData = useMemo(() => asArray(employess), [employess]);

  // ---------- Dropdown Options ----------
  const academicYearNames = useMemo(() => {
    const allowedYears = ["2026-27", "2025-26", "2024-25"];
    const apiYears = yearsData.map(yearLabel).filter(Boolean);
    return allowedYears
      .filter((year) => apiYears.includes(year))
      .sort((a, b) => parseInt(b.split("-")[0]) - parseInt(a.split("-")[0]));
  }, [yearsData]);

  const cityNames = useMemo(() => citiesData.map(cityLabel).filter(Boolean), [citiesData]);
  const zoneNames = useMemo(() => zonesData.map(zoneLabel).filter(Boolean), [zonesData]);
  const issuedToNames = useMemo(() => employeeData.map(empLabel).filter(Boolean), [employeeData]);

  // ---------- Reverse Maps ----------
  const academicYearNameToId = useMemo(
    () => new Map(yearsData.map((y) => [yearLabel(y), yearId(y)])),
    [yearsData]
  );
  const cityNameToId = useMemo(
    () => new Map(citiesData.map((c) => [cityLabel(c), cityId(c)])),
    [citiesData]
  );
  const zoneNameToId = useMemo(
    () => new Map(zonesData.map((z) => [zoneLabel(z), zoneId(z)])),
    [zonesData]
  );
  const campusNameToId = useMemo(
    () => new Map(campusesData.map((cm) => [campusLabel(cm), campusId(cm)])),
    [campusesData]
  );
  const empNameToId = useMemo(
    () => new Map(employeeData.map((e) => [empLabel(e), empId(e)])),
    [employeeData]
  );

  // ---------- Default Academic Year ----------
  useEffect(() => {
    if (didSeedRef.current.year) return;
    if (!yearsData.length) return;
    const defaultYear = yearsData.find((y) => yearLabel(y) === "2025-26");
    if (defaultYear) {
      setSelectedAcademicYearId(yearId(defaultYear));
      didSeedRef.current.year = true;
    }
  }, [yearsData]);

  // ---------- Handle Range Data ----------
  useEffect(() => {
    if (isUpdate) return;
    if (effectiveAppNumberRange?.data) {
      const { appStartNo, appFrom, appEndNo, appBalanceTrkId } =
        effectiveAppNumberRange.data;
      console.log("Application From-To:", { appStartNo, appFrom, appEndNo, appBalanceTrkId });
      setSeedInitialValues((prev) => ({
        ...prev,
        availableAppNoFrom: String(appStartNo),
        availableAppNoTo: String(appEndNo),
        applicationNoFrom: String(appFrom),
      }));
    }
  }, [effectiveAppNumberRange, isUpdate]);

  // ---------- Handle Form Value Changes ----------
  const handleValuesChange = (values) => {
    if (values.academicYear && academicYearNameToId.has(values.academicYear)) {
      const ayId = academicYearNameToId.get(values.academicYear);
      if (ayId !== selectedAcademicYearId) setSelectedAcademicYearId(ayId);
    }
    if (values.cityName && cityNameToId.has(values.cityName)) {
      const newCityId = cityNameToId.get(values.cityName);
      if (newCityId !== selectedCityId) {
        setSelectedCityId(newCityId);
        setSelectedZoneId(null);
        setSelectedCampusId(null);
        setIssuedToId(null);
      }
    }
    if (values.zoneName && zoneNameToId.has(values.zoneName)) {
      const newZoneId = zoneNameToId.get(values.zoneName);
      if (newZoneId !== selectedZoneId) {
        setSelectedZoneId(newZoneId);
        setSelectedCampusId(null);
        setIssuedToId(null);
      }
    }
    if (values.campusName && campusNameToId.has(values.campusName)) {
      const cmId = campusNameToId.get(values.campusName);
      if (cmId !== selectedCampusId) {
        setSelectedCampusId(cmId);
        setIssuedToId(null);
      }
    }
    if (values.issuedTo && empNameToId.has(values.issuedTo)) {
      const emp = empNameToId.get(values.issuedTo);
      if (emp !== issuedToId) setIssuedToId(emp);
    }
  };

  // ---------- Backend Values ----------
  const backendValues = useMemo(() => {
    const obj = {};
    if (mobileNo != null) obj.mobileNumber = String(mobileNo);
    if (effectiveAppNumberRange?.data) {
      const { appStartNo, appFrom, appEndNo, appBalanceTrkId } =
        effectiveAppNumberRange.data;
      obj.selectedBalanceTrackId = Number(appBalanceTrkId);
      if (!isUpdate) {
        obj.availableAppNoFrom = String(appStartNo);
        obj.availableAppNoTo = String(appEndNo);
        obj.applicationNoFrom = String(appFrom);
      }
    }
    if (selectedAcademicYearId != null) obj.academicYearId = Number(selectedAcademicYearId);
    if (selectedCityId != null) obj.cityId = Number(selectedCityId);
    if (selectedZoneId != null) obj.zoneId = Number(selectedZoneId);
    if (selectedCampusId != null) obj.campusId = Number(selectedCampusId);
    if (issuedToId != null) {
      obj.issuedToEmpId = Number(issuedToId);
      obj.issuedToId = Number(issuedToId);
    }
    console.log("Computed backendValues:", obj);
    return obj;
  }, [
    mobileNo,
    effectiveAppNumberRange,
    selectedAcademicYearId,
    selectedCityId,
    selectedZoneId,
    selectedCampusId,
    issuedToId,
    isUpdate,
  ]);

  // ---------- Dynamic Dropdowns ----------
  const dynamicOptions = useMemo(
    () => ({
      academicYear: academicYearNames,
      cityName: cityNames,
      zoneName: zoneNames,
      campusName: campusesData.map(campusLabel).filter(Boolean),
      issuedTo: issuedToNames,
    }),
    [academicYearNames, cityNames, zoneNames, campusesData, issuedToNames]
  );

  // ---------- Render ----------
  return (
    <DistributeForm
      formType="DGM"
      initialValues={seedInitialValues}
      onSubmit={onSubmit}
      setIsInsertClicked={setIsInsertClicked}
      dynamicOptions={dynamicOptions}
      backendValues={backendValues}
      onValuesChange={handleValuesChange}
      isUpdate={isUpdate}
      editId={editId}
      skipAppNoPatch={isUpdate}
    />
  );
};

export default DgmForm;
