// import React, { useEffect, useState, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Formik, Form, ErrorMessage, useFormikContext } from "formik";
// import * as Yup from "yup";
// import Inputbox from "../../../widgets/Inputbox/InputBox";
// import Dropdown from "../../../widgets/Dropdown/Dropdown";
// import Button from "../../../widgets/Button/Button";
// import { ReactComponent as TrendingUpIcon } from "../../../assets/application-status/Trending up.svg";
// import Asterisk from "../../../assets/application-status/Asterisk";
// import SuccessPage from "../ConformationPage/SuccessPage";
// import styles from "./Damaged.module.css";
// import {
//   getProEmployees,
//   getZones,
//   getDgmEmployees,
//   getStatuses,
//   submitApplicationStatus,
//   getCampusesByZoneId,
//   fetchApplicationDetails,
// } from "../../../queries/application-status/apis";

// // Component to handle fetching application details
// const FetchApplicationDetails = ({
//   applicationNo,
//   setFetchError,
//   dropdownOptions,
//   setZoneId,
//   setSelectedCampusId,
//   setSelectedStatusId,
//   isOptionsLoaded,
//   setPendingDgmName,
// }) => {
//   const { setFieldValue } = useFormikContext();

//   useEffect(() => {
//     const fetchApplicationDetailsData = async () => {
//       if (applicationNo && isOptionsLoaded) {
//         try {
//           const data = await fetchApplicationDetails(applicationNo);

//           // Map API response to form fields, handling status mapping
//           setFieldValue("zoneName", data.zoneName || "");
//           setFieldValue("campusName", data.campusName || "");
//           setFieldValue("proName", data.proName || "");
//           setFieldValue("dgmName", data.dgmEmpName || ""); // Fixed: use dgmEmpName instead of dgmName
//           const normalizedStatus = data.status?.toLowerCase() || "available";
//           const mappedStatus = normalizedStatus === "left" || normalizedStatus === "confirmed" ? "AVAILABLE" : normalizedStatus.toUpperCase();
//           setFieldValue("status", mappedStatus);
//           setFieldValue("reason", data.reason || "");
//           setFieldValue("applicationNo", applicationNo);

//           // Store pending DGM name for later processing
//           if (data.dgmEmpName) { // Fixed: use dgmEmpName instead of dgmName
//             setPendingDgmName(data.dgmEmpName);
//           }

//           // Set IDs based on labels
//           const zoneId = findIdByLabel(dropdownOptions.zoneName, data.zoneName, "zoneName");
//           const campusId = findIdByLabel(dropdownOptions.campusName, data.campusName, "campusName");
//           const proId = findIdByLabel(dropdownOptions.proName, data.proName, "proName");
//           const dgmId = findIdByLabel(dropdownOptions.dgmName, data.dgmEmpName, "dgmName"); // Fixed: use dgmEmpName
//           const statusId = findIdByLabel(dropdownOptions.status, mappedStatus, "status");

//           setFieldValue("zoneId", zoneId || "");
//           setFieldValue("campusId", campusId || "");
//           setFieldValue("proId", proId || "");
//           setFieldValue("dgmEmpId", dgmId || "");
//           setFieldValue("statusId", statusId || "");

//           setZoneId(zoneId || "");
//           setSelectedCampusId(campusId || "");
//           setSelectedStatusId(statusId || "");

//           setFetchError(false);
//         } catch (err) {
//           console.error("Failed to fetch application details:", err);
//           setFetchError(true);
//         }
//       } else if (!applicationNo) {
//         setFieldValue("zoneName", "");
//         setFieldValue("campusName", "");
//         setFieldValue("proName", "");
//         setFieldValue("dgmName", "");
//         setFieldValue("status", "");
//         setFieldValue("reason", "");
//         setFieldValue("zoneId", "");
//         setFieldValue("campusId", "");
//         setFieldValue("proId", "");
//         setFieldValue("dgmEmpId", "");
//         setFieldValue("statusId", "");
//         setZoneId("");
//         setSelectedCampusId("");
//         setSelectedStatusId(null);
//         setPendingDgmName("");
//         setFetchError(false);
//       }
//     };

//     fetchApplicationDetailsData();
//   }, [
//     applicationNo,
//     isOptionsLoaded,
//     setFieldValue,
//     setFetchError,
//     dropdownOptions.zoneName,
//     dropdownOptions.campusName,
//     dropdownOptions.proName,
//     dropdownOptions.dgmName,
//     dropdownOptions.status,
//     setZoneId,
//     setSelectedCampusId,
//     setSelectedStatusId,
//   ]);

//   return null;
// };

// /* -------------------------------------------
//    Small helper: normalize strings for matching
// -------------------------------------------- */
// const normalizeString = (str) =>
//   str
//     ?.trim()
//     .toLowerCase()
//     .replace(/\s+/g, " ")
//     .replace(/[^a-z0-9\s]/g, "") || "";

// const findIdByLabel = (options, label, fieldName) => {
//   if (!Array.isArray(options) || !options.length || !label) {
//     console.warn(`No valid label or options for ${fieldName}:`, { label, options });
//     return null;
//   }
//   const normalizedLabel = normalizeString(label);
//   const match = options.find((opt) => normalizeString(opt.label) === normalizedLabel);
//   if (!match) {
//     console.warn(
//       `No exact match for ${fieldName} label: "${label}" (normalized: "${normalizedLabel}") in options:`,
//       options.map((opt) => opt.label)
//     );
//     return null;
//   }
//   return match.value || null;
// };

// const Damaged = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [dropdownOptions, setDropdownOptions] = useState({
//     zoneName: [],
//     campusName: [],
//     proName: [],
//     dgmName: [],
//     status: [],
//   });

//   const [loadingStates, setLoadingStates] = useState({
//     zones: true,
//     campuses: false,
//     statuses: true,
//     proEmployees: false,
//     dgmEmployees: true,
//   });

//   const [zoneId, setZoneId] = useState("");
//   const [selectedCampusId, setSelectedCampusId] = useState("");
//   const [error, setError] = useState(null);
//   const [selectedStatusId, setSelectedStatusId] = useState(null);
//   const [fetchError, setFetchError] = useState(false);
//   const [applicationNo, setApplicationNo] = useState(location.state?.applicationNo || location.state?.initialValues?.applicationNo || "");
//   const [isOptionsLoaded, setIsOptionsLoaded] = useState(false);
//   const [pendingDgmName, setPendingDgmName] = useState("");
//   const [formikRef, setFormikRef] = useState(null);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [submittedData, setSubmittedData] = useState(null);

//   // Debug effect to monitor application number changes
//   useEffect(() => {
//     // Monitor application number changes
//   }, [applicationNo, location.state]);

//   const reverseStatusMap = {
//     damaged: "DAMAGED",
//     withpro: "AVAILABLE",
//     "not confirmed": "UNSOLD",
//     "with pro": "AVAILABLE",
//     with_pro: "AVAILABLE",
//     available: "AVAILABLE",
//     unsold: "UNSOLD",
//     "not sold": "UNSOLD",
//     notsold: "UNSOLD",
//     "un sold": "UNSOLD",
//     approved: "CONFIRMED",
//     broken: "DAMAGED",
//     "": "UNKNOWN",
//   };

//   const handleZoneChange = useCallback(async (zoneName, setFieldValue) => {
//     const zoneIdLocal = findIdByLabel(dropdownOptions.zoneName, zoneName, "zoneName");
//     if (zoneIdLocal) {
//       setZoneId(zoneIdLocal);
//       setFieldValue("zoneId", zoneIdLocal);
//     }
//   }, [dropdownOptions.zoneName, setZoneId]);

//   const handleCampusChange = useCallback(async (campusName, setFieldValue) => {
//     if (!campusName) {
//       setDropdownOptions((prev) => ({ ...prev, proName: [] }));
//       setFieldValue("proName", "");
//       setFieldValue("proId", "");
//       setLoadingStates((p) => ({ ...p, proEmployees: false }));
//       return;
//     }

//     try {
//       setLoadingStates((p) => ({ ...p, proEmployees: true }));

//       const campusId = findIdByLabel(dropdownOptions.campusName, campusName, "campusName");

//       if (campusId) {
//         setSelectedCampusId(campusId);
//         setFieldValue("campusId", campusId);

//         const proEmployees = await getProEmployees(campusId);
//         const mappedProEmployees = (proEmployees || []).map((pro) => ({
//           id: pro.id || pro.proId || null,
//           label: pro.name || pro.proName || pro.label || "Unknown PRO",
//           value: pro.id || pro.proId || null,
//         }));

//         if (mappedProEmployees.length === 0) {
//           setError("No PRO employees found for the selected campus.");
//         } else {
//           setError(null);
//         }

//         setDropdownOptions((prev) => ({ ...prev, proName: mappedProEmployees }));
//         setFieldValue("proName", "");
//         setFieldValue("proId", "");
//         setLoadingStates((p) => ({ ...p, proEmployees: false }));
//       } else {
//         setLoadingStates((p) => ({ ...p, proEmployees: false }));
//         setError("Invalid campus selected. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error fetching PRO employees by campus ID:", err);
//       setError("Failed to load PRO employees. Please select a different campus or try again.");
//       setDropdownOptions((prev) => ({ ...prev, proName: [] }));
//       setFieldValue("proName", "");
//       setFieldValue("proId", "");
//       setLoadingStates((p) => ({ ...p, proEmployees: false }));
//     }
//   }, [dropdownOptions.campusName, setDropdownOptions, setLoadingStates, setError, setSelectedCampusId]);

//   const initialValues = {
//     applicationNo: applicationNo,
//     zoneName: location.state?.initialValues?.zoneName || "",
//     zoneId: location.state?.initialValues?.zoneId || "",
//     campusName: location.state?.initialValues?.campusName || "",
//     campusId: location.state?.initialValues?.campusId || "",
//     proName: location.state?.initialValues?.proName || "",
//     proId: location.state?.initialValues?.proId || "",
//     dgmName: location.state?.initialValues?.dgmName || "",
//     dgmEmpId: location.state?.initialValues?.dgmEmpId || "",
//     status: location.state?.initialValues?.status || "",
//     statusId: location.state?.initialValues?.statusId || "",
//     reason: location.state?.initialValues?.reason || "",
//   };

//   const validationSchema = Yup.object().shape({
//     applicationNo: Yup.string().required("Application No is required"),
//     zoneName: Yup.string().required("Zone Name is required"),
//     campusName: Yup.string().required("Campus Name is required"),
//     proName: Yup.string().required("PRO Name is required"),
//     dgmName: Yup.string().required("DGM Name is required"),
//     status: Yup.string().required("Status is required"),
//     reason: Yup.string().when("status", {
//       is: "DAMAGED",
//       then: (schema) => schema.required("Reason is required when status is Damaged"),
//       otherwise: (schema) => schema.notRequired(),
//     }),
//   });

//   useEffect(() => {
//     const fetchInitialDropdownOptions = async () => {
//       const apiCalls = [
//         { key: "zones", call: () => getZones() },
//         { key: "statuses", call: () => getStatuses() },
//       ];

//       const results = await Promise.all(apiCalls.map(({ key, call }) => call()));
//       results.forEach((data, index) => {
//         const { key } = apiCalls[index];
//         let mappedData = [];

//         if (key === "zones") {
//           mappedData = Array.isArray(data)
//             ? data.map((zone) => ({
//                 label: zone.zoneName?.trim() || "Unknown Zone",
//                 value: zone.zoneId,
//               }))
//             : [];
//           setDropdownOptions((prev) => ({
//             ...prev,
//             zoneName: mappedData.filter((opt) => opt.label && opt.value),
//           }));
//         } else if (key === "statuses") {
//           mappedData = Array.isArray(data)
//             ? data.map((s) => {
//                 const raw = (s.status || s.status_type || s.name || "").toLowerCase();
//                 const statusName = reverseStatusMap[raw] || (s.status || s.status_type || s.name || "").toUpperCase();
//                 if (statusName === "LEFT" || statusName === "CONFIRMED") return null;
//                 return { label: statusName, value: s.status_id || s.id || null };
//               })
//               .filter((opt) => opt !== null)
//             : [];
//           setDropdownOptions((prev) => ({
//             ...prev,
//             status: mappedData.filter((opt) => opt.label && opt.value),
//           }));
//         }

//         setLoadingStates((prev) => ({ ...prev, [key]: false }));
//       });
//       setIsOptionsLoaded(true); // Mark options as loaded after initial fetches
//     };

//     fetchInitialDropdownOptions();
//   }, []);

//   useEffect(() => {
//     const fetchCampuses = async () => {
//       if (!zoneId) {
//         setDropdownOptions((prev) => ({ ...prev, campusName: [] }));
//         setLoadingStates((prev) => ({ ...prev, campuses: false }));
//         return;
//       }

//       try {
//         setLoadingStates((prev) => ({ ...prev, campuses: true }));
//         const campuses = await getCampusesByZoneId(zoneId);
//         const mappedCampuses = (Array.isArray(campuses) ? campuses : [])
//           .map((campus) => ({
//             id: campus.id || campus.campusId,
//             label: campus.name || campus.campusName || campus.label || "",
//             value: campus.id || campus.campusId || null,
//           }))
//           .filter((c) => c.label && c.value);

//         if (mappedCampuses.length === 0) {
//           setError("No campuses found for the selected zone.");
//         } else {
//           setError(null);
//         }

//         setDropdownOptions((prev) => ({ ...prev, campusName: mappedCampuses }));
//         setLoadingStates((prev) => ({ ...prev, campuses: false }));
//       } catch (err) {
//         console.error("Error fetching campuses by Zone ID:", err);
//         setError("Failed to load campuses. Please try again.");
//         setDropdownOptions((prev) => ({ ...prev, campusName: [] }));
//         setLoadingStates((prev) => ({ ...prev, campuses: false }));
//       }
//     };

//     fetchCampuses();
//   }, [zoneId, setDropdownOptions, setLoadingStates, setError]);

//   useEffect(() => {
//     const fetchDgmEmployees = async () => {
//       if (!zoneId) {
//         setDropdownOptions((prev) => ({ ...prev, dgmName: [] }));
//         setLoadingStates((prev) => ({ ...prev, dgmEmployees: false }));
//         return;
//       }

//       try {
//         setLoadingStates((prev) => ({ ...prev, dgmEmployees: true }));
//         const dgmEmployees = await getDgmEmployees(zoneId);

//         const newDgmOptions = Array.isArray(dgmEmployees)
//           ? dgmEmployees.map((emp) => ({
//               label: emp.name?.trim() || "Unknown DGM",
//               value: emp.empId || emp.id || null,
//             }))
//           : [];

//         if (newDgmOptions.length === 0) {
//           setError("No DGM employees found for the selected zone. Please try another zone.");
//         } else {
//           setError(null);
//         }

//         setDropdownOptions((prev) => ({ ...prev, dgmName: newDgmOptions }));
//         setLoadingStates((prev) => ({ ...prev, dgmEmployees: false }));
//       } catch (err) {
//         console.error("Error fetching DGM employees:", err);
//         setError("Failed to load DGM employees. Please select a different zone or try again.");
//         setDropdownOptions((prev) => ({ ...prev, dgmName: [] }));
//         setLoadingStates((prev) => ({ ...prev, dgmEmployees: false }));
//       }
//     };

//     fetchDgmEmployees();
//   }, [zoneId, setDropdownOptions, setLoadingStates, setError]);

//   // Effect to handle DGM name autopopulation after DGM options are loaded
//   useEffect(() => {
//     const handleDgmAutopopulation = () => {
//       if (pendingDgmName && dropdownOptions.dgmName.length > 0 && formikRef) {
//         // Find the DGM ID and set it
//         const dgmId = findIdByLabel(dropdownOptions.dgmName, pendingDgmName, "dgmName");
        
//         if (dgmId) {
//           // Use Formik's setFieldValue to set both the name and ID
//           formikRef.setFieldValue("dgmName", pendingDgmName);
//           formikRef.setFieldValue("dgmEmpId", dgmId);
          
//           // Clear the pending DGM name after processing
//           setPendingDgmName("");
//         }
//       }
//     };

//     handleDgmAutopopulation();
//   }, [dropdownOptions.dgmName, pendingDgmName, setPendingDgmName, formikRef]);

//   useEffect(() => {
//     const fetchProEmployees = async () => {
//       if (!selectedCampusId) {
//         setDropdownOptions((prev) => ({ ...prev, proName: [] }));
//         setLoadingStates((prev) => ({ ...prev, proEmployees: false }));
//         return;
//       }

//       try {
//         setLoadingStates((prev) => ({ ...prev, proEmployees: true }));

//         const proEmployees = await getProEmployees(selectedCampusId);
//         const newProOptions = Array.isArray(proEmployees)
//           ? proEmployees.map((emp) => ({
//               label: emp.name?.trim() || "Unknown PRO",
//               value: emp.empId || emp.id || null,
//             }))
//           : [];

//         if (newProOptions.length === 0) {
//           setError("No PRO employees found for the selected campus. Please try another campus.");
//         } else {
//           setError(null);
//         }

//         setDropdownOptions((prev) => ({ ...prev, proName: newProOptions }));
//         setLoadingStates((prev) => ({ ...prev, proEmployees: false }));
//       } catch (err) {
//         console.error("Error fetching PRO employees:", err);
//         setError("Failed to load PRO employees. Please select a different campus or try again.");
//         setDropdownOptions((prev) => ({ ...prev, proName: [] }));
//         setLoadingStates((prev) => ({ ...prev, proEmployees: false }));
//       }
//     };

//     fetchProEmployees();
//   }, [selectedCampusId, setDropdownOptions, setLoadingStates, setError]);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     const updatedValues = {
//       applicationNo: parseInt(values.applicationNo, 10) || 0,
//       statusId:
//         selectedStatusId ||
//         findIdByLabel(dropdownOptions.status, values.status, "status") ||
//         null,
//       reason: values.reason,
//       campusId:
//         values.campusId ||
//         findIdByLabel(dropdownOptions.campusName, values.campusName, "campusName") ||
//         null,
//       proId:
//         values.proId ||
//         findIdByLabel(dropdownOptions.proName, values.proName, "proName") ||
//         null,
//       zoneId:
//         values.zoneId ||
//         findIdByLabel(dropdownOptions.zoneName, values.zoneName, "zoneName") ||
//         null,
//       dgmEmpId:
//         values.dgmEmpId ||
//         findIdByLabel(dropdownOptions.dgmName, values.dgmName, "dgmName") ||
//         null,
//     };

//     const missingIds = [];
//     if (!updatedValues.statusId || isNaN(updatedValues.statusId)) missingIds.push("statusId");
//     if (!updatedValues.campusId || isNaN(updatedValues.campusId)) missingIds.push("campusId");
//     if (!updatedValues.proId) missingIds.push("proId");
//     if (!updatedValues.zoneId || isNaN(updatedValues.zoneId)) missingIds.push("zoneId");
//     if (!updatedValues.dgmEmpId) missingIds.push("dgmEmpId");

//     if (missingIds.length > 0) {
//       alert(
//         `Error: The following required IDs are missing or invalid: ${missingIds.join(
//           ", "
//         )}. Please check your selections.`
//       );
//       setSubmitting(false);
//       return;
//     }

//     try {
//       const response = await submitApplicationStatus(updatedValues);
      
//       // Store submitted data for success page
//       setSubmittedData({
//         applicationNo: values.applicationNo,
//         zoneName: values.zoneName,
//         campusName: values.campusName,
//         proName: values.proName,
//         dgmName: values.dgmName,
//         status: values.status,
//         reason: values.reason
//       });
      
//       // Show success page
//       setShowSuccess(true);
//     } catch (err) {
//       console.error("Error submitting form:", err);
//       alert("Error submitting form: " + (err.response?.data || err.message));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const fields = [
//     [
//       { name: "applicationNo", label: "Application No", type: "input", required: true },
//       { name: "zoneName", label: "Zone Name", type: "select", options: dropdownOptions.zoneName.map((opt) => opt.label), required: true },
//       { name: "dgmName", label: "DGM Name", type: "select", options: dropdownOptions.dgmName.map((opt) => opt.label), required: true },
    
//     ],
//     [
//       { name: "campusName", label: "Campus Name", type: "select", options: dropdownOptions.campusName.map((opt) => opt.label), required: true },
//       { name: "proName", label: "PRO Name", type: "select", options: dropdownOptions.proName.map((opt) => opt.label), required: true },
     
//       { name: "status", label: "Select Status of Application", type: "select", options: dropdownOptions.status.map((opt) => opt.label), required: true },
//     ],
//     [
//       { name: "reason", label: "Enter The Reason", type: "textarea", className: styles.Damaged_damaged_Text_Area, required: false },
//     ],
//   ];

//   if (error && dropdownOptions.zoneName.length === 0) {
//     return <div style={{ color: "red" }}>{error}</div>;
//   }

//   // Render Success Page if form was submitted successfully
//   if (showSuccess && submittedData) {
//     // Determine if we should show reverse order
//     // If status is "AVAILABLE" or "WITH PRO", show reverse order (Red star first, Blue star second)
//     const shouldReverseOrder = submittedData.status === "AVAILABLE" || submittedData.status === "WITH PRO";
    
//     return (
//       <SuccessPage
//         applicationNo={submittedData.applicationNo}
//         studentName={submittedData.proName} // Using PRO name as student name
//         amount="" // No amount for damaged status
//         campus={submittedData.campusName}
//         zone={submittedData.zoneName}
//         onBack={() => navigate("/scopes/application/status")}
//         statusType="damaged"
//         reverseOrder={shouldReverseOrder}
//       />
//     );
//   }

//   return (
//     <div className={styles.Damaged_damaged_Page_Wrapper}>
//       <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
//         {({ values, handleChange, handleBlur, setFieldValue, errors, touched, submitForm, isSubmitting, resetForm }) => {
//           // Set the formik ref for DGM autopopulation
//           if (!formikRef) {
//             setFormikRef({ setFieldValue });
//           }
          
//           // Debug log for form values
//           return (
//             <Form className={styles.Damaged_damaged_Form_Wrapper}>
//             <FetchApplicationDetails
//               applicationNo={applicationNo}
//               setFetchError={setFetchError}
//               dropdownOptions={dropdownOptions}
//               setZoneId={setZoneId}
//               setSelectedCampusId={setSelectedCampusId}
//               setSelectedStatusId={setSelectedStatusId}
//               isOptionsLoaded={isOptionsLoaded}
//               setPendingDgmName={setPendingDgmName}
//             />
//             {fields.map((row, rowIndex) => (
//               <div key={rowIndex} className={styles.Damaged_damaged_Field_Row}>
//                 {row.map((field) => (
//                   <div key={field.name} className={styles.Damaged_damaged_Field_Column}>
//                     {field.type === "input" && (
//                       <>
//                         <Inputbox
//                           label={field.label}
//                           id={field.name}
//                           name={field.name}
//                           placeholder={`Enter ${field.label}`}
//                           value={values[field.name] || ""}
//                           onChange={(e) => {
//                             const newValue = e.target.value;
//                             if (field.name === "applicationNo" && newValue !== applicationNo) {
//                               resetForm({ values: { ...initialValues, applicationNo: newValue } });
//                               setApplicationNo(newValue);
//                               setFetchError(false);
//                             } else {
//                               setFieldValue(field.name, newValue);
//                             }
//                           }}
//                           onBlur={handleBlur}
//                           error={touched[field.name] && errors[field.name]}
//                           required={field.required}
//                         />
//                         <ErrorMessage name={field.name} component="div" style={{ color: "red", fontSize: "12px" }} />
//                         {field.name === "applicationNo" && fetchError && (
//                           <div style={{ color: "red", fontSize: "12px" }}>
//                             Failed to fetch details. Please enter manually or re-enter Application No.
//                           </div>
//                         )}
//                       </>
//                     )}

//                     {field.type === "select" && (
//                       <>
//                         <Dropdown
//                           dropdownname={field.label}
//                           name={field.name}
//                           results={field.options}
//                           value={values[field.name] || ""}
//                           disabled={
//                             field.name === "zoneName"
//                               ? loadingStates.zones
//                               : field.name === "campusName"
//                               ? loadingStates.campuses
//                               : field.name === "proName"
//                               ? loadingStates.proEmployees
//                               : field.name === "dgmName"
//                               ? loadingStates.dgmEmployees
//                               : field.name === "status"
//                               ? loadingStates.statuses
//                               : false
//                           }
//                           loading={
//                             field.name === "zoneName"
//                               ? loadingStates.zones
//                               : field.name === "campusName"
//                               ? loadingStates.campuses
//                               : field.name === "proName"
//                               ? loadingStates.proEmployees
//                               : field.name === "dgmName"
//                               ? loadingStates.dgmEmployees
//                               : field.name === "status"
//                               ? loadingStates.statuses
//                               : false
//                           }
//                           onChange={(e) => {
//                             const selectedValue = e.target.value;
//                             setFieldValue(field.name, selectedValue);

//                             if (field.name === "zoneName") {
//                               const id = findIdByLabel(dropdownOptions.zoneName, selectedValue, "zoneName");
//                               setFieldValue("zoneId", id || "");
//                               setZoneId(id || "");
//                             } else if (field.name === "campusName") {
//                               const id = findIdByLabel(dropdownOptions.campusName, selectedValue, "campusName");
//                               setFieldValue("campusId", id || "");
//                               setSelectedCampusId(id || "");
//                             } else if (field.name === "proName") {
//                               const id = findIdByLabel(dropdownOptions.proName, selectedValue, "proName");
//                               setFieldValue("proId", id || "");
//                             } else if (field.name === "dgmName") {
//                               const id = findIdByLabel(dropdownOptions.dgmName, selectedValue, "dgmName");
//                               setFieldValue("dgmEmpId", id || "");
//                             } else if (field.name === "status") {
//                               const id = findIdByLabel(dropdownOptions.status, selectedValue, "status");
//                               setFieldValue("statusId", id || "");
//                               setSelectedStatusId(id || null);
//                             }
//                           }}
//                           onBlur={handleBlur}
//                           required={field.required}
//                         />
//                         <ErrorMessage name={field.name} component="div" style={{ color: "red", fontSize: "12px" }} />
//                         {field.name === "campusName" && error && dropdownOptions.campusName.length === 0 && (
//                           <div style={{ color: "red", fontSize: "12px" }}>{error}</div>
//                         )}
//                       </>
//                     )}

//                     {field.type === "textarea" && (
//                       <div className={styles.Damaged_damaged_textarea_container}>
//                         <label className={styles.Damaged_damaged_Label}>
//                           {field.label}
//                           {field.required && values.status === "DAMAGED" && <Asterisk style={{ marginLeft: "4px" }} />}
//                         </label>
//                         <textarea
//                           name={field.name}
//                           className={field.className || styles.Damaged_damaged_Input}
//                           value={values[field.name] || ""}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           placeholder={`Enter ${field.label}`}
//                           rows={4}
//                         />
//                         <ErrorMessage name={field.name} component="div" style={{ color: "red", fontSize: "12px" }} />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ))}

//             <Button
//               type="submit"
//               onClick={submitForm}
//               variant="primary"
//               buttonname="Submit"
//               righticon={<TrendingUpIcon />}
//               className={styles.Damaged_damaged_Submit_Button}
//               disabled={isSubmitting}
//             />
//           </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// };

// export default Damaged;