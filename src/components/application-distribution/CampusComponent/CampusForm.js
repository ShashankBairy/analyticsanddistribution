import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";

import {
  useGetAllDistricts,
  useGetCitiesByDistrict,
  useGetProsByCampus,
  useGetAcademicYears,
  useGetMobileNo,
  useGetCampuesByCityWithCategory,
  useGetAllFeeAmounts,
  useGetApplicationSeriesForEmpId,
  useGetSchoolDgmCityDistrictId,
} from "../../../queries/application-distribution/dropdownqueries";

// ---------- HELPERS ----------
const asArray = (v) => (Array.isArray(v) ? v : []);

const yearLabel = (y) => y?.academicYear ?? "";
const yearId = (y) => y?.acdcYearId ?? null;

const districtLabel = (d) => d?.districtName ?? "";
const districtId = (d) => d?.districtId ?? null;

const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;

const campusLabel = (c) => c?.name ?? "";
const campusId = (c) => c?.id ?? null;

const empLabel = (e) => e?.name ?? "";
const empId = (e) => e?.id ?? null;


// =====================================================================
//                           CAMPUS FORM
// =====================================================================
const CampusForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
}) => {

  // ---------------- SELECTED KEYS ----------------
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);

  const employeeId = localStorage.getItem("empId");
  const category = localStorage.getItem("category");

  // ---------------- INITIAL FORM VALUES ----------------
  const seedInitialValues = {
    ...initialValues,
    academicYear: initialValues?.academicYear || "2025-26",
    campaignDistrictName: initialValues?.campaignDistrictName || "",
    cityName: initialValues?.cityName || "",
  };

  const didSeedRef = useRef(false);

  // ---------------- API CALLS ----------------
  const { data: yearsRaw = [] } = useGetAcademicYears();
  const { data: districtsRaw = [] } = useGetAllDistricts();
  const { data: citiesRaw = [] } = useGetCitiesByDistrict(selectedDistrictId);
  const { data: campusesRaw = [] } =
    useGetCampuesByCityWithCategory(category, selectedCityId);

  const { data: employeesRaw = [] } = useGetProsByCampus(selectedCampusId);
  const { data: mobileNo } = useGetMobileNo(issuedToId);

  // SCHOOL AUTOFILL API
  const { data: empDetails } = useGetSchoolDgmCityDistrictId(
    employeeId,
    category
  );

  const { data: applicationFee = [] } =
    useGetAllFeeAmounts(employeeId, selectedAcademicYearId);

  const { data: applicationSeries = [] } =
    useGetApplicationSeriesForEmpId(
      employeeId,
      selectedAcademicYearId,
      selectedFee,
      false
    );


  // ---------------- NORMALIZATION ----------------
  const years = asArray(yearsRaw);
  const districts = asArray(districtsRaw);
  const cities = asArray(citiesRaw);
  const campuses = asArray(campusesRaw);
  const employees = asArray(employeesRaw);

  // ---------------- LABEL ARRAYS ----------------
  const academicYearNames = years.map(yearLabel);
  const districtNames = districts.map(districtLabel);
  const cityNames = cities.map(cityLabel);
  const campusNames = campuses.map(campusLabel);
  const issuedToNames = employees.map(empLabel);

  // ---------------- MAPPINGS ----------------
  const yearMap = new Map(years.map((y) => [yearLabel(y), yearId(y)]));
  const districtMap = new Map(
    districts.map((d) => [districtLabel(d), districtId(d)])
  );
  const cityMap = new Map(cities.map((c) => [cityLabel(c), cityId(c)]));
  const campusMap = new Map(campuses.map((c) => [campusLabel(c), campusId(c)]));
  const empMap = new Map(employees.map((e) => [empLabel(e), empId(e)]));

  // =====================================================================
  //     🚀 AUTO POPULATE FOR SCHOOL (district + city + form values)
  // =====================================================================
  useEffect(() => {
    if (category !== "SCHOOL") return;
    if (!empDetails?.districtId || !empDetails?.cityId) return;

    const distId = empDetails.districtId;
    const cId = empDetails.cityId;

    setSelectedDistrictId(distId);
    setSelectedCityId(cId);

  }, [empDetails, category]);

  // =====================================================================
  //            PATCH FORM VALUES AFTER OPTIONS LOAD
  // =====================================================================
  useEffect(() => {
    if (category !== "SCHOOL") return;
    if (!empDetails?.districtName || !empDetails?.cityName) return;
    if (!districtNames.length || !cityNames.length) return;

    seedInitialValues.campaignDistrictName = empDetails.districtName;
    seedInitialValues.cityName = empDetails.cityName;

  }, [districtNames, cityNames, empDetails, category]);

  // =====================================================================
  //            DEFAULT ACADEMIC YEAR = "2025-26"
  // =====================================================================
  useEffect(() => {
    if (didSeedRef.current) return;
    if (!years.length) return;

    const def = years.find((y) => yearLabel(y) === "2025-26");

    if (def) {
      setSelectedAcademicYearId(yearId(def));
      didSeedRef.current = true;
    }
  }, [years]);

  // =====================================================================
  //                 RESET LOGIC
  // =====================================================================
  const handleValuesChange = (values) => {

    if (yearMap.has(values.academicYear)) {
      const id = yearMap.get(values.academicYear);
      if (id !== selectedAcademicYearId) {
        setSelectedAcademicYearId(id);
        setSelectedFee(null);
      }
    }

    if (districtMap.has(values.campaignDistrictName)) {
      const id = districtMap.get(values.campaignDistrictName);
      if (id !== selectedDistrictId) {
        setSelectedDistrictId(id);
        setSelectedCityId(null);
        setSelectedCampusId(null);
      }
    }

    if (cityMap.has(values.cityName)) {
      const id = cityMap.get(values.cityName);
      if (id !== selectedCityId) {
        setSelectedCityId(id);
        setSelectedCampusId(null);
      }
    }

    if (campusMap.has(values.campusName)) {
      const id = campusMap.get(values.campusName);
      if (id !== selectedCampusId) {
        setSelectedCampusId(id);
      }
    }

    if (empMap.has(values.issuedTo)) {
      const id = empMap.get(values.issuedTo);
      setIssuedToId(id);
    }
  };

  const seriesObj = useMemo(() => {
     if (!selectedSeries) return null;
 
     return (
       applicationSeries.find((s) => s.displaySeries === selectedSeries) || null
     );
   }, [selectedSeries, applicationSeries]);

  // =====================================================================
  //                  BACKEND VALUES
  // =====================================================================
  const backendValues = useMemo(() => {
    const obj = {};

    if (mobileNo != null) obj.mobileNumber = String(mobileNo);

    if (seriesObj) {
      obj.applicationSeries = seriesObj.displaySeries;
      obj.applicationCount = seriesObj.availableCount;
      obj.availableAppNoFrom = seriesObj.masterStartNo;
      obj.availableAppNoTo = seriesObj.masterEndNo;
      obj.applicationNoFrom = seriesObj.startNo;
    }

    if (selectedAcademicYearId) obj.academicYearId = selectedAcademicYearId;
    if (selectedDistrictId) obj.campaignDistrictId = selectedDistrictId;
    if (selectedCityId) obj.cityId = selectedCityId;
    if (selectedCampusId) obj.campusId = selectedCampusId;

    if (issuedToId) {
      obj.issuedToEmpId = issuedToId;
      obj.issuedToId = issuedToId;
    }

    return obj;
  }, [
    mobileNo,
    seriesObj,
    selectedAcademicYearId,
    selectedDistrictId,
    selectedCityId,
    selectedCampusId,
    issuedToId,
    applicationFee,
    applicationSeries,
  ]);

  // =====================================================================
  //                  OPTIONS FOR FORM
  // =====================================================================
  const dynamicOptions = {
    academicYear: academicYearNames,
    campaignDistrictName: districtNames,
    cityName: cityNames,
    campusName: campusNames,
    issuedTo: issuedToNames,

        applicationFee: Array.isArray(applicationFee)
  ? applicationFee.map((f) => String(f))
  : [],

    applicationSeries: Array.isArray(applicationSeries)
      ? applicationSeries.map((s) => s.displaySeries)
      : [],
  };

  return (
    <DistributeForm
      formType="Campus"
      initialValues={seedInitialValues}
      onSubmit={onSubmit}
      setIsInsertClicked={setIsInsertClicked}
      dynamicOptions={dynamicOptions}
      backendValues={backendValues}
      onValuesChange={handleValuesChange}
      onApplicationFeeSelect={(fee) => setSelectedFee(fee)}
      onSeriesSelect={(series) => setSelectedSeries(series)}
      applicationSeriesList={applicationSeries}
      isUpdate={isUpdate}
      editId={editId}
    />
  );
};

export default CampusForm;
