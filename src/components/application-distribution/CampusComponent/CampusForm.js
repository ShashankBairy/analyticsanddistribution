import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";
import {
  useGetAllDistricts,
  useGetCitiesByDistrict,
  useCampaignByCityId,
  useCampusbyCampaignId,
  useGetProsByCampus,
  useGetAcademicYears,
  useGetMobileNo,
  useGetRangeByEmpId,
  useGetCampusByCityId,
  useGetRangeAvailAndApp,
} from "../../../queries/application-distribution/dropdownqueries";

// ---------- Utility helpers ----------
const asArray = (v) => (Array.isArray(v) ? v : []);

const yearLabel = (y) => y?.academicYear ?? y?.name ?? String(y?.year ?? y?.id ?? "");
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;
const campaignDistrictLabel = (d) => d?.districtName ?? d?.name ?? "";
const campaignDistrictId = (d) => d?.districtId ?? d?.id ?? null;
const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;
const campusLabel = (cm) => cm?.name ?? null;
const campusId = (cm) => cm?.id ?? null;
const empLabel = (e) => e?.name ?? null;
const empId = (e) => e?.id ?? null;

// ---------- CampusForm Component ----------
const CampusForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
}) => {
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [selectedCampaignDistrictId, setSelectedCampaignDistrictId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);

  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues?.academicYear || "2025-26",
  });

  const didSeedRef = useRef({ year: false });

  // ---------- API Hooks ----------
  const { data: yearsRaw = [] } = useGetAcademicYears();
  const { data: campaignDistrictsRaw = [] } = useGetAllDistricts();
  const { data: citiesRaw = [] } = useGetCitiesByDistrict(selectedCampaignDistrictId);
  const { data: campusesRaw = [] } = useGetCampusByCityId(selectedCityId);
  const { data: employeesRaw = [] } = useGetProsByCampus(selectedCampusId);
  const { data: mobileNo } = useGetMobileNo(issuedToId);

  const employeeId = localStorage.getItem("empId");

  // ---------- Primary Range API ----------
  const {
    data: appNumberRange,
    error: appNumberRangeError,
    isLoading,
  } = useGetRangeByEmpId(employeeId, selectedAcademicYearId);

  // ---------- Fallback Range API ----------
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

  // ---------- Normalize both APIs ----------
  const effectiveAppNumberRange = useMemo(() => {
    // Fallback API normalization
    if (shouldUseFallback && fallbackAppRange?.data) {
      const { nextAvailableNumber, overallAppFrom, overallAppTo } = fallbackAppRange.data;
      return {
        data: {
          appStartNo: overallAppFrom ?? 0,
          appEndNo: overallAppTo ?? 0,
          appFrom: nextAvailableNumber ?? 0,
          appBalanceTrkId: 0, // fallback has no balance track ID
        },
        source: "fallback",
      };
    }

    // Primary API normalization
    if (appNumberRange?.data) {
      const { appStartNo, appEndNo, appFrom, appBalanceTrkId } = appNumberRange.data;
      return {
        data: { appStartNo, appEndNo, appFrom, appBalanceTrkId },
        source: "primary",
      };
    }

    return null;
  }, [shouldUseFallback, fallbackAppRange, appNumberRange]);

  // ---------- Debug which API is used ----------
  useEffect(() => {
    if (effectiveAppNumberRange?.source === "fallback") {
      console.warn("⚠️ Using fallback range-info API (appBalanceTrkId=0)");
    } else if (effectiveAppNumberRange?.source === "primary") {
      console.log("✅ Using primary range-by-emp API");
    }
  }, [effectiveAppNumberRange]);

  // ---------- Normalize Arrays ----------
  const yearsData = useMemo(() => asArray(yearsRaw), [yearsRaw]);
  const campaignDistrictsData = useMemo(() => asArray(campaignDistrictsRaw), [campaignDistrictsRaw]);
  const citiesData = useMemo(() => asArray(citiesRaw), [citiesRaw]);
  const campusesData = useMemo(() => asArray(campusesRaw), [campusesRaw]);
  const employeeData = useMemo(() => asArray(employeesRaw), [employeesRaw]);

  // ---------- Dropdowns ----------
  const academicYearNames = useMemo(() => {
    const allowedYears = [
       "2026-27",
      "2025-26",
      "2024-25",
    ];
    const apiYears = yearsData.map(yearLabel).filter(Boolean);
    return allowedYears
      .filter((year) => apiYears.includes(year))
      .sort((a, b) => parseInt(b.split("-")[0]) - parseInt(a.split("-")[0]));
  }, [yearsData]);

  const campaignDistrictNames = useMemo(
    () => campaignDistrictsData.map(campaignDistrictLabel).filter(Boolean),
    [campaignDistrictsData]
  );
  const cityNames = useMemo(() => citiesData.map(cityLabel).filter(Boolean), [citiesData]);
  const campusNames = useMemo(() => campusesData.map(campusLabel).filter(Boolean), [campusesData]);
  const issuedToNames = useMemo(() => employeeData.map(empLabel).filter(Boolean), [employeeData]);

  // ---------- Reverse Maps ----------
  const academicYearNameToId = useMemo(
    () => new Map(yearsData.map((y) => [yearLabel(y), yearId(y)])),
    [yearsData]
  );
  const campaignDistrictNameToId = useMemo(
    () => new Map(campaignDistrictsData.map((d) => [campaignDistrictLabel(d), campaignDistrictId(d)])),
    [campaignDistrictsData]
  );
  const cityNameToId = useMemo(() => new Map(citiesData.map((c) => [cityLabel(c), cityId(c)])), [citiesData]);
  const campusNameToId = useMemo(() => new Map(campusesData.map((cm) => [campusLabel(cm), campusId(cm)])), [campusesData]);
  const empNameToId = useMemo(() => new Map(employeeData.map((e) => [empLabel(e), empId(e)])), [employeeData]);

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

  // ---------- Seed Range Data ----------
  useEffect(() => {
    if (isUpdate) return;
    if (effectiveAppNumberRange?.data) {
      const { appStartNo, appFrom, appEndNo, appBalanceTrkId } = effectiveAppNumberRange.data;
      setSeedInitialValues((prev) => ({
        ...prev,
        availableAppNoFrom: String(appStartNo),
        availableAppNoTo: String(appEndNo),
        applicationNoFrom: String(appFrom),
      }));
    }
  }, [effectiveAppNumberRange, isUpdate]);

  // ---------- Handle Dropdown Changes ----------
  const handleValuesChange = (values) => {
    if (values.academicYear && academicYearNameToId.has(values.academicYear)) {
      const ayId = academicYearNameToId.get(values.academicYear);
      if (ayId !== selectedAcademicYearId) setSelectedAcademicYearId(ayId);
    }

    if (values.campaignDistrictName && campaignDistrictNameToId.has(values.campaignDistrictName)) {
      const newDistrictId = campaignDistrictNameToId.get(values.campaignDistrictName);
      if (newDistrictId !== selectedCampaignDistrictId) {
        setSelectedCampaignDistrictId(newDistrictId);
        setSelectedCityId(null);
        setSelectedCampusId(null);
        setIssuedToId(null);
      }
    }

    if (values.cityName && cityNameToId.has(values.cityName)) {
      const newCityId = cityNameToId.get(values.cityName);
      if (newCityId !== selectedCityId) {
        setSelectedCityId(newCityId);
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
      const { appStartNo, appFrom, appEndNo, appBalanceTrkId } = effectiveAppNumberRange.data;
      obj.selectedBalanceTrackId = Number(appBalanceTrkId);
      if (!isUpdate) {
        obj.availableAppNoFrom = String(appStartNo);
        obj.availableAppNoTo = String(appEndNo);
        obj.applicationNoFrom = String(appFrom);
      }
    }
    if (selectedAcademicYearId != null) obj.academicYearId = Number(selectedAcademicYearId);
    if (selectedCampaignDistrictId != null) obj.campaignDistrictId = Number(selectedCampaignDistrictId);
    if (selectedCityId != null) obj.cityId = Number(selectedCityId);
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
    selectedCampaignDistrictId,
    selectedCityId,
    selectedCampusId,
    issuedToId,
    isUpdate,
  ]);

  // ---------- Dropdown Options ----------
  const dynamicOptions = useMemo(
    () => ({
      academicYear: academicYearNames,
      campaignDistrictName: campaignDistrictNames,
      cityName: cityNames,
      campusName: campusNames,
      issuedTo: issuedToNames,
    }),
    [academicYearNames, campaignDistrictNames, cityNames, campusNames, issuedToNames]
  );

  // ---------- Render ----------
  return (
    <DistributeForm
      formType="Campus"
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

export default CampusForm;
