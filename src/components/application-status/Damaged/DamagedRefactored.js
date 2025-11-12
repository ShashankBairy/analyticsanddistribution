import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../../widgets/Button/Button";
import ProgressHeader from "../../../widgets/ProgressHeader/ProgressHeader";
import { ReactComponent as TrendingUpIcon } from "../../../assets/application-status/Trending up.svg";
import styles from "./Damaged.module.css";

// Custom hooks
import { useDropdownData } from "./hooks/useDropdownData";
import { useFormSubmission } from "./hooks/useFormSubmission";

// Components
import ApplicationDetailsFetcher from "./components/ApplicationDetailsFetcher";
import FormRow from "./components/FormRow";
import SuccessPageWrapper from "./components/SuccessPageWrapper";

// Utils
import { findIdByLabel } from "./utils/formUtils";
import axios from "axios";

/**
 * Refactored Damaged form component
 * Broken down into smaller, manageable pieces for better maintainability
 */
const DamagedRefactored = () => {
  const location = useLocation();

  const campusName = localStorage.getItem("campusName");

  const applicationStatus = async(appNo, campusName)=>{
    const response = await axios.get(`http://localhost:8080/api/applications/by_campus/damaged_details`,{
      params:appNo,campusName 
    });
    console.log("Response of application: ", response);
    return response.data;
  }
  
  // State management
  const [zoneId, setZoneId] = useState("");
  const [selectedCampusId, setSelectedCampusId] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [applicationNo, setApplicationNo] = useState(
    location.state?.applicationNo || location.state?.initialValues?.applicationNo || ""
  );
  const [pendingDgmName, setPendingDgmName] = useState("");
  const [formikRef, setFormikRef] = useState(null);

  // Custom hooks
  const {
    dropdownOptions,
    loadingStates,
    error,
    isOptionsLoaded,
    fetchCampuses,
    fetchDgmEmployees,
    fetchProEmployees,
    setError,
  } = useDropdownData();



  // Debug dropdown options
  console.log("Current dropdown options:", dropdownOptions);
  console.log("Campus options specifically:", dropdownOptions.campusName);
  console.log("Zone options specifically:", dropdownOptions.zoneName);
  console.log("First few zone options:", dropdownOptions.zoneName.slice(0, 3));
  console.log("All zone options expanded:", dropdownOptions.zoneName);
  console.log("Zone options structure:", dropdownOptions.zoneName.map(zone => ({ label: zone.label, value: zone.value })));

  const {
    showSuccess,
    submittedData,
    handleSubmit,
    handleBackToStatus,
  } = useFormSubmission();

  // Initial values for the form
  const initialValues = {
    applicationNo: applicationNo,
    zoneName: location.state?.initialValues?.zoneName || "",
    zoneId: location.state?.initialValues?.zoneId || "",
    campusName: location.state?.initialValues?.campusName || "",
    campusId: location.state?.initialValues?.campusId || "",
    proName: location.state?.initialValues?.proName || "",
    proId: location.state?.initialValues?.proId || "",
    dgmName: location.state?.initialValues?.dgmName || "",
    dgmEmpId: location.state?.initialValues?.dgmEmpId || "",
    status: location.state?.initialValues?.status || "",
    statusId: location.state?.initialValues?.statusId || "",
    reason: location.state?.initialValues?.reason || "",
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    applicationNo: Yup.string().required("Application No is required"),
    zoneName: Yup.string().required("Zone Name is required"),
    campusName: Yup.string().required("Campus Name is required"),
    proName: Yup.string().required("PRO Name is required"),
    dgmName: Yup.string().required("DGM Name is required"),
    status: Yup.string().required("Status is required"),
    reason: Yup.string().when("status", {
      is: "DAMAGED",
      then: (schema) => schema.required("Reason is required when status is Damaged"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  // Field configuration
  const fields = [
    [
      { name: "applicationNo", label: "Application No", type: "input", required: true },
      { name: "zoneName", label: "Zone Name", type: "select", options: dropdownOptions.zoneName.map((opt) => opt.label), required: true },
      { name: "dgmName", label: "DGM Name", type: "select", options: dropdownOptions.dgmName.map((opt) => opt.label), required: true },
    ],
    [
      { name: "campusName", label: "Campus Name", type: "select", options: dropdownOptions.campusName.map((opt) => opt.label), required: true },
      { name: "proName", label: "PRO Name", type: "select", options: dropdownOptions.proName.map((opt) => opt.label), required: true },
      { name: "status", label: "Select Status of Application", type: "select", options: dropdownOptions.status.map((opt) => opt.label), required: true },
    ],
    [
      { name: "reason", label: "Enter The Reason", type: "textarea", className: styles.Damaged_damaged_Text_Area, required: false },
    ],
  ];

  // Event handlers
  const handleZoneChange = useCallback(async (zoneName, setFieldValue) => {
    console.log("handleZoneChange called with zoneName:", zoneName);
    console.log("Available zone options:", dropdownOptions.zoneName);
    
    const zoneIdLocal = findIdByLabel(dropdownOptions.zoneName, zoneName, "zoneName");
    console.log("Found zoneId:", zoneIdLocal);
    
    if (zoneIdLocal) {
      setZoneId(zoneIdLocal);
      setFieldValue("zoneId", zoneIdLocal);
      console.log("Calling fetchCampuses with zoneId:", zoneIdLocal);
      await fetchCampuses(zoneIdLocal);
      await fetchDgmEmployees(zoneIdLocal);
    } else {
      console.log("No zoneId found for zoneName:", zoneName);
    }
  }, [dropdownOptions.zoneName, fetchCampuses, fetchDgmEmployees]);

  const handleCampusChange = useCallback(async (campusName, setFieldValue) => {
    if (!campusName) {
      setFieldValue("proName", "");
      setFieldValue("proId", "");
      return;
    }

    const campusId = findIdByLabel(dropdownOptions.campusName, campusName, "campusName");
    if (campusId) {
      setSelectedCampusId(campusId);
      setFieldValue("campusId", campusId);
      await fetchProEmployees(campusId);
    }
  }, [dropdownOptions.campusName, fetchProEmployees]);

  const handleProChange = useCallback((proName, setFieldValue) => {
    const proId = findIdByLabel(dropdownOptions.proName, proName, "proName");
    setFieldValue("proId", proId || "");
  }, [dropdownOptions.proName]);

  const handleDgmChange = useCallback((dgmName, setFieldValue) => {
    const dgmId = findIdByLabel(dropdownOptions.dgmName, dgmName, "dgmName");
    setFieldValue("dgmEmpId", dgmId || "");
  }, [dropdownOptions.dgmName]);

  const handleStatusChange = useCallback((status, setFieldValue) => {
    const statusId = findIdByLabel(dropdownOptions.status, status, "status");
    setFieldValue("statusId", statusId || "");
    setSelectedStatusId(statusId || null);
  }, [dropdownOptions.status]);

  // Effect to handle DGM name autopopulation after DGM options are loaded
  useEffect(() => {
    const handleDgmAutopopulation = () => {
      if (pendingDgmName && dropdownOptions.dgmName.length > 0 && formikRef) {
        const dgmId = findIdByLabel(dropdownOptions.dgmName, pendingDgmName, "dgmName");
        
        if (dgmId) {
          formikRef.setFieldValue("dgmName", pendingDgmName);
          formikRef.setFieldValue("dgmEmpId", dgmId);
          setPendingDgmName("");
        }
      }
    };

    handleDgmAutopopulation();
  }, [dropdownOptions.dgmName, pendingDgmName, formikRef]);

  // Show error if zones failed to load
  if (error && dropdownOptions.zoneName.length === 0) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  // Show success page if form was submitted successfully
  if (showSuccess && submittedData) {
    return (
      <SuccessPageWrapper
        submittedData={submittedData}
        onBack={handleBackToStatus}
      />
    );
  }

  return (
    <div className={styles.Damaged_damaged_Page_Wrapper}>
      {/* Application Damage Header - Always visible */}
      <div className={styles.Damaged_Header_Wrapper}>
        <h1 className={styles.Damaged_Header_Title}>Application Damage</h1>
        <ProgressHeader step={0} totalSteps={2} />
      </div>
      
      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={(values, actions) => handleSubmit(values, dropdownOptions, actions)}
      >
        {({ values, handleChange, handleBlur, setFieldValue, errors, touched, submitForm, isSubmitting, resetForm }) => {
          // Set the formik ref for DGM autopopulation
          if (!formikRef) {
            setFormikRef({ setFieldValue });
          }

          return (
            <Form className={styles.Damaged_damaged_Form_Wrapper}>
              
              <ApplicationDetailsFetcher
                applicationNo={applicationNo}
                isOptionsLoaded={isOptionsLoaded}
                dropdownOptions={dropdownOptions}
                setZoneId={setZoneId}
                setSelectedCampusId={setSelectedCampusId}
                setSelectedStatusId={setSelectedStatusId}
                setPendingDgmName={setPendingDgmName}
              />
              
              {fields.map((row, rowIndex) => (
                <FormRow
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  dropdownOptions={dropdownOptions}
                  loadingStates={loadingStates}
                  error={error}
                  fetchError={false} // This would need to be passed from ApplicationDetailsFetcher
                  applicationNo={applicationNo}
                  setApplicationNo={setApplicationNo}
                  resetForm={resetForm}
                  initialValues={initialValues}
                  onZoneChange={(zoneName) => handleZoneChange(zoneName, setFieldValue)}
                  onCampusChange={(campusName) => handleCampusChange(campusName, setFieldValue)}
                  onProChange={(proName) => handleProChange(proName, setFieldValue)}
                  onDgmChange={(dgmName) => handleDgmChange(dgmName, setFieldValue)}
                  onStatusChange={(status) => handleStatusChange(status, setFieldValue)}
                />
              ))}

              <Button
                type="submit"
                onClick={submitForm}
                variant="primary"
                buttonname="Submit"
                righticon={<TrendingUpIcon />}
                className={styles.Damaged_damaged_Submit_Button}
                disabled={isSubmitting}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default DamagedRefactored;
