import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";

import {
  useGetAllDistricts,
  useGetCitiesByDistrict,
  useGetProsByCampus,
  useGetAcademicYears,
  useGetMobileNo,
  useGetCampusByCityId,
  useGetAllFeeAmounts,
  useGetApplicationSeriesForEmpId,
} from "../../../queries/application-distribution/dropdownqueries";

// ---------------- LABEL / ID HELPERS ----------------
const asArray = (v) => (Array.isArray(v) ? v : []);

const yearLabel = (y) => y?.academicYear ?? y?.name ?? "";
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;

const districtLabel = (d) => d?.districtName ?? d?.name ?? "";
const districtId = (d) => d?.districtId ?? d?.id ?? null;

const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;

const campusLabel = (c) => c?.name ?? "";
const campusId = (c) => c?.id ?? null;

const empLabel = (e) => e?.name ?? "";
const empId = (e) => e?.id ?? null;

// ----------------------------------------------------------
//                     CAMPUS FORM UPDATED
// ----------------------------------------------------------
const CampusForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
}) => {
  // ---------------- SELECTED VALUES ----------------
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);

  // Initial Values
  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues?.academicYear || "2025-26",
  });

  const didSeedRef = useRef(false);
  const employeeId = localStorage.getItem("empId");

  // ---------------- API CALLS ----------------
  const { data: yearsRaw = [] } = useGetAcademicYears();
  const { data: districtsRaw = [] } = useGetAllDistricts();
  const { data: citiesRaw = [] } = useGetCitiesByDistrict(selectedDistrictId);
  const { data: campusesRaw = [] } = useGetCampusByCityId(selectedCityId);
  const { data: employeesRaw = [] } = useGetProsByCampus(selectedCampusId);
  const { data: mobileNo } = useGetMobileNo(issuedToId);

  // Application Fee API
  const { data: applicationFee = [] } = useGetAllFeeAmounts(
    employeeId,
    selectedAcademicYearId
  );

  // APPLICATION SERIES API (🔥 Primary API)
  const { data: applicationSeries = [] } =
    useGetApplicationSeriesForEmpId(
      employeeId,
      selectedAcademicYearId,
      selectedFee,
      false,
    );

  const seriesObj = applicationSeries?.[0];

  // ---------------- NORMALIZE ARRAYS ----------------
  const years = asArray(yearsRaw);
  const districts = asArray(districtsRaw);
  const cities = asArray(citiesRaw);
  const campuses = asArray(campusesRaw);
  const employees = asArray(employeesRaw);

  // ---------------- DROPDOWN OPTIONS ----------------
  const academicYearNames = years.map(yearLabel);
  const districtNames = districts.map(districtLabel);
  const cityNames = cities.map(cityLabel);
  const campusNames = campuses.map(campusLabel);
  const issuedToNames = employees.map(empLabel);

  // ---------------- REVERSE MAPPINGS ----------------
  const yearMap = new Map(years.map((y) => [yearLabel(y), yearId(y)]));
  const districtMap = new Map(districts.map((d) => [districtLabel(d), districtId(d)]));
  const cityMap = new Map(cities.map((c) => [cityLabel(c), cityId(c)]));
  const campusMap = new Map(campuses.map((c) => [campusLabel(c), campusId(c)]));
  const empMap = new Map(employees.map((e) => [empLabel(e), empId(e)]));

  // ---------------- DEFAULT ACADEMIC YEAR ----------------
  useEffect(() => {
    if (didSeedRef.current) return;
    if (!years.length) return;

    const defaultYear = years.find((y) => yearLabel(y) === "2025-26");
    if (defaultYear) {
      setSelectedAcademicYearId(yearId(defaultYear));
      didSeedRef.current = true;
    }
  }, [years]);

  // ---------------- RESET LOGIC ----------------
  const handleValuesChange = (values) => {
    if (values.academicYear && yearMap.has(values.academicYear)) {
      const id = yearMap.get(values.academicYear);
      if (id !== selectedAcademicYearId) {
        setSelectedAcademicYearId(id);
        setSelectedFee(null);
      }
    }

    if (values.campaignDistrictName && districtMap.has(values.campaignDistrictName)) {
      const id = districtMap.get(values.campaignDistrictName);
      if (id !== selectedDistrictId) {
        setSelectedDistrictId(id);
        setSelectedCityId(null);
        setSelectedCampusId(null);
        setIssuedToId(null);
        setSelectedFee(null);
      }
    }

    if (values.cityName && cityMap.has(values.cityName)) {
      const id = cityMap.get(values.cityName);
      if (id !== selectedCityId) {
        setSelectedCityId(id);
        setSelectedCampusId(null);
        setIssuedToId(null);
        setSelectedFee(null);
      }
    }

    if (values.campusName && campusMap.has(values.campusName)) {
      const id = campusMap.get(values.campusName);
      if (id !== selectedCampusId) {
        setSelectedCampusId(id);
        setIssuedToId(null);
        setSelectedFee(null);
      }
    }

    if (values.issuedTo && empMap.has(values.issuedTo)) {
      const id = empMap.get(values.issuedTo);
      if (id !== issuedToId) setIssuedToId(id);
    }
  };

  // ---------------- BACKEND VALUES ----------------
  const backendValues = useMemo(() => {
    const obj = {};

    if (mobileNo != null) obj.mobileNumber = String(mobileNo);

    // SERIES VALUES
    if (seriesObj) {
      obj.applicationSeries = seriesObj.displaySeries;
      obj.applicationCount = seriesObj.availableCount ;
      obj.availableAppNoFrom = seriesObj.masterStartNo ;
      obj.availableAppNoTo = seriesObj.masterEndNo ;
      obj.applicationNoFrom = seriesObj.startNo ;
    }

    if (selectedAcademicYearId != null)
      obj.academicYearId = selectedAcademicYearId;

    if (selectedDistrictId != null)
      obj.campaignDistrictId = selectedDistrictId;

    if (selectedCityId != null) obj.cityId = selectedCityId;

    if (selectedCampusId != null) obj.campusId = selectedCampusId;

    if (issuedToId != null) {
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
  ]);

  // ---------------- DYNAMIC OPTIONS ----------------
  const dynamicOptions = {
    academicYear: academicYearNames,
    campaignDistrictName: districtNames,
    cityName: cityNames,
    campusName: campusNames,
    issuedTo: issuedToNames,
    applicationFee: applicationFee.map(String),
    applicationSeries: applicationSeries.map((s) => s.displaySeries),
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
      isUpdate={isUpdate}
      editId={editId}
    />
  );
};

export default CampusForm;
