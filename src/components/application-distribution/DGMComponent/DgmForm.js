import React, { useMemo, useState, useEffect, useRef } from "react";
import DistributeForm from "../DistributeForm";

import {
  useGetAcademicYears,
  useGetCities,
  useGetZoneByCity,
  useGetCampusByZone,
  useGetMobileNo,
  useGetDgmsByCampus,
  useGetAllFeeAmounts,
  useGetApplicationSeriesForEmpId,
  useGetDgmWithZonalAccountant,
} from "../../../queries/application-distribution/dropdownqueries";

// ---------------- LABEL / ID HELPERS ----------------
const yearLabel = (y) => y?.academicYear ?? y?.name ?? "";
const yearId = (y) => y?.acdcYearId ?? y?.id ?? null;

const cityLabel = (c) => c?.name ?? "";
const cityId = (c) => c?.id ?? null;

const zoneLabel = (z) => z?.zoneName ?? "";
const zoneId = (z) => z?.zoneId ?? z?.id ?? null;

const campusLabel = (c) => c?.name ?? "";
const campusId = (c) => c?.id ?? null;

const empLabel = (e) => e?.name ?? "";
const empId = (e) => e?.id ?? null;

const asArray = (v) => (Array.isArray(v) ? v : []);

// ----------------------------------------------------------
//                          DGM FORM
// ----------------------------------------------------------
const DgmForm = ({
  initialValues = {},
  onSubmit,
  setIsInsertClicked,
  isUpdate = false,
  editId,
}) => {

  // ---------------- SELECTED VALUES ----------------
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState(null);
  const [issuedToId, setIssuedToId] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
   const [selectedSeries, setSelectedSeries] = useState(null);

  // ---------------- INITIAL FORM VALUES ----------------
  const [seedInitialValues, setSeedInitialValues] = useState({
    ...initialValues,
    academicYear: initialValues?.academicYear || "2025-26",
  });

  const didSeedRef = useRef(false);
  const employeeId = localStorage.getItem("empId");
  const category = localStorage.getItem("category");

  // ---------------- API CALLS ----------------
  const { data: yearsRaw = [] } = useGetAcademicYears();
  const { data: citiesRaw = [] } = useGetCities();
  const { data: zonesRaw = [] } = useGetZoneByCity(selectedCityId);
  const { data: campusRaw = [] } = useGetDgmWithZonalAccountant(selectedZoneId,category);
  const { data: employeesRaw = [] } = useGetDgmsByCampus(selectedCampusId);
  const { data: mobileNo } = useGetMobileNo(issuedToId);

  // Application Fee
  const { data: applicationFee = [] } = useGetAllFeeAmounts(
    employeeId,
    selectedAcademicYearId
  );

  // APPLICATION SERIES (PRIMARY API)
  const { data: applicationSeries = [] } =
    useGetApplicationSeriesForEmpId(
      employeeId,
      selectedAcademicYearId,
      selectedFee,
      false
    );

  // ---------------- NORMALIZE ARRAYS ----------------
  const years = asArray(yearsRaw);
  const cities = asArray(citiesRaw);
  const zones = asArray(zonesRaw);
  const campuses = asArray(campusRaw);
  const employees = asArray(employeesRaw);

  // ---------------- OPTIONS FOR UI ----------------
  const academicYearNames = years.map(yearLabel);
  const cityNames = cities.map(cityLabel);
  const zoneNames = zones.map(zoneLabel);
  const campusNames = campuses.map(campusLabel);
  const issuedToNames = employees.map(empLabel);

  // ---------------- REVERSE MAPPINGS ----------------
  const yearMap = new Map(years.map((y) => [yearLabel(y), yearId(y)]));
  const cityMap = new Map(cities.map((c) => [cityLabel(c), cityId(c)]));
  const zoneMap = new Map(zones.map((z) => [zoneLabel(z), zoneId(z)]));
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

  // ---------------- RESET ON CHANGE ----------------
  const handleValuesChange = (values) => {
    if (values.academicYear && yearMap.has(values.academicYear)) {
      const id = yearMap.get(values.academicYear);
      if (id !== selectedAcademicYearId) {
        setSelectedAcademicYearId(id);
        setSelectedFee(null);
      }
    }

    if (values.cityName && cityMap.has(values.cityName)) {
      const id = cityMap.get(values.cityName);

      if (id !== selectedCityId) {
        setSelectedCityId(id);
        setSelectedZoneId(null);
        setSelectedCampusId(null);
        setIssuedToId(null);
        setSelectedFee(null);
      }
    }

    if (values.zoneName && zoneMap.has(values.zoneName)) {
      const id = zoneMap.get(values.zoneName);

      if (id !== selectedZoneId) {
        setSelectedZoneId(id);
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

   // ---------------- SELECTED SERIES OBJECT ----------------
  const seriesObj = useMemo(() => {
    if (!selectedSeries) return null;

    return (
      applicationSeries.find((s) => s.displaySeries === selectedSeries) || null
    );
  }, [selectedSeries, applicationSeries]);

  // ---------------- BACKEND VALUES (MATCHES ZoneForm) ----------------
  const backendValues = useMemo(() => {
    const obj = {};

    if (mobileNo != null) obj.mobileNumber = String(mobileNo);

    if (seriesObj) {
      obj.applicationSeries = seriesObj.displaySeries ;
      obj.applicationCount = seriesObj.availableCount ;
      obj.availableAppNoFrom = seriesObj.masterStartNo ;
      obj.availableAppNoTo = seriesObj.masterEndNo ;
      obj.applicationNoFrom = seriesObj.startNo ;
    }

    if (selectedAcademicYearId != null) obj.academicYearId = selectedAcademicYearId;
    if (selectedCityId != null) obj.cityId = selectedCityId;
    if (selectedZoneId != null) obj.zoneId = selectedZoneId;
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
    selectedCityId,
    selectedZoneId,
    selectedCampusId,
    issuedToId,
    applicationFee,
    applicationSeries,
  ]);

  // ---------------- DYNAMIC OPTIONS ----------------
  const dynamicOptions = {
  academicYear: academicYearNames,
  cityName: cityNames,
  zoneName: zoneNames,
  campusName: campusNames,
  issuedTo: issuedToNames,

  // FIX: applicationFee.data instead of applicationFee
    applicationFee: Array.isArray(applicationFee)
  ? applicationFee.map((f) => String(f))
  : [],

  // FIX: applicationSeries default fallback
  applicationSeries: Array.isArray(applicationSeries)
    ? applicationSeries.map((s) => s.displaySeries)
    : [],
};

  return (
    <DistributeForm
      formType="DGM"
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

export default DgmForm;
