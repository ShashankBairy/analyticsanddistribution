// import { Button as MUIButton } from "@mui/material";
// import { useEffect, useState } from "react";
// import * as Yup from "yup";
// import Button from "../../../widgets/Button/Button";
// import Dropdown from "../../../widgets/Dropdown/Dropdown";
// import InputBox from "../../../widgets/Inputbox/InputBox";
// import Snackbar from "../../../widgets/Snackbar/Snackbar";
// import { ReactComponent as BackArrow } from "../../../assets/application-status/Backarrow.svg";
// import { ReactComponent as PhoneIcon } from "../../../assets/application-status/PhoneIcon.svg";
// import SkipIcon from "../../../assets/application-status/SkipIcon.svg";
// import { ReactComponent as TrendingUpIcon } from "../../../assets/application-status/Trending up.svg";
// import apiService from "../../../queries/application-status/SaleFormapis";
// import styles from "./ConcessionInfoSection.module.css";

// // Dynamic concession field mapping based on joining class
// const getConcessionFieldMapping = (joiningClassName) => {
//   const classLower = joiningClassName?.toLowerCase() || '';
  
//   console.log("🔍 Mapping function called with:", { joiningClassName, classLower });
  
//   // Nursery to 10th standard mapping
//   if (classLower.includes('nursery') || classLower.includes('lkg') || classLower.includes('ukg') || 
//       classLower.includes('1st') || classLower.includes('2nd') || classLower.includes('3rd') || 
//       classLower.includes('4th') || classLower.includes('5th') || classLower.includes('6th') || 
//       classLower.includes('7th') || classLower.includes('8th') || classLower.includes('9th') || 
//       classLower.includes('10th')) {
    
//     // For nursery to 10th: Show Nursery, LKG, UKG
//     if (classLower.includes('nursery')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: 'Nursery Concession', show: true },
//           { name: 'yearConcession2nd', label: 'LKG Concession', show: true },
//           { name: 'yearConcession3rd', label: 'UKG Concession', show: true }
//         ]
//       };
//     }
//     // For LKG to 10th: Show LKG, UKG, 1st
//     else if (classLower.includes('lkg')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: 'LKG Concession', show: true },
//           { name: 'yearConcession2nd', label: 'UKG Concession', show: true },
//           { name: 'yearConcession3rd', label: '1st Concession', show: true }
//         ]
//       };
//     }
//     // For UKG to 10th: Show UKG, 1st, 2nd
//     else if (classLower.includes('ukg')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: 'UKG Concession', show: true },
//           { name: 'yearConcession2nd', label: '1st Concession', show: true },
//           { name: 'yearConcession3rd', label: '2nd Concession', show: true }
//         ]
//       };
//     }
//     // For 1st to 10th: Show 1st, 2nd, 3rd
//     else if (classLower.includes('1st')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '1st Concession', show: true },
//           { name: 'yearConcession2nd', label: '2nd Concession', show: true },
//           { name: 'yearConcession3rd', label: '3rd Concession', show: true }
//         ]
//       };
//     }
//     // For 2nd to 10th: Show 2nd, 3rd, 4th
//     else if (classLower.includes('2nd') || classLower.includes('2nd class')) {
//       console.log("✅ Matched 2nd class condition");
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '2nd Concession', show: true },
//           { name: 'yearConcession2nd', label: '3rd Concession', show: true },
//           { name: 'yearConcession3rd', label: '4th Concession', show: true }
//         ]
//       };
//     }
//     // For 3rd to 10th: Show 3rd, 4th, 5th
//     else if (classLower.includes('3rd')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '3rd Concession', show: true },
//           { name: 'yearConcession2nd', label: '4th Concession', show: true },
//           { name: 'yearConcession3rd', label: '5th Concession', show: true }
//         ]
//       };
//     }
//     // For 4th to 10th: Show 4th, 5th, 6th
//     else if (classLower.includes('4th')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '4th Concession', show: true },
//           { name: 'yearConcession2nd', label: '5th Concession', show: true },
//           { name: 'yearConcession3rd', label: '6th Concession', show: true }
//         ]
//       };
//     }
//     // For 5th to 10th: Show 5th, 6th, 7th
//     else if (classLower.includes('5th')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '5th Concession', show: true },
//           { name: 'yearConcession2nd', label: '6th Concession', show: true },
//           { name: 'yearConcession3rd', label: '7th Concession', show: true }
//         ]
//       };
//     }
//     // For 6th to 10th: Show 6th, 7th, 8th
//     else if (classLower.includes('6th')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '6th Concession', show: true },
//           { name: 'yearConcession2nd', label: '7th Concession', show: true },
//           { name: 'yearConcession3rd', label: '8th Concession', show: true }
//         ]
//       };
//     }
//     // For 7th to 10th: Show 7th, 8th, 9th
//     else if (classLower.includes('7th')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '7th Concession', show: true },
//           { name: 'yearConcession2nd', label: '8th Concession', show: true },
//           { name: 'yearConcession3rd', label: '9th Concession', show: true }
//         ]
//       };
//     }
//     // For 8th to 10th: Show 8th, 9th, 10th
//     else if (classLower.includes('8th')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '8th Concession', show: true },
//           { name: 'yearConcession2nd', label: '9th Concession', show: true },
//           { name: 'yearConcession3rd', label: '10th Concession', show: true }
//         ]
//       };
//     }
//     // For 9th to 10th: Show 9th, 10th, 11th
//     else if (classLower.includes('9th') || classLower.includes('9th class')) {
//       console.log("✅ Matched 9th class condition");
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '9th Concession', show: true },
//           { name: 'yearConcession2nd', label: '10th Concession', show: true },
//           { name: 'yearConcession3rd', label: '11th Concession', show: true }
//         ]
//       };
//     }
//     // For 10th: Show 10th, 11th, 12th
//     else if (classLower.includes('10th')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '10th Concession', show: true },
//           { name: 'yearConcession2nd', label: '11th Concession', show: true },
//           { name: 'yearConcession3rd', label: '12th Concession', show: true }
//         ]
//       };
//     }
//   }
  
//   // Inter/Intermediate mapping
//   if (classLower.includes('inter') || classLower.includes('intermediate') || 
//       classLower.includes('11th') || classLower.includes('12th') ||
//       classLower.includes('inter1') || classLower.includes('inter2')) {
//     return {
//       fields: [
//         { name: 'yearConcession1st', label: '1st Year Concession', show: true },
//         { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
//         { name: 'yearConcession3rd', label: '3rd Year Concession', show: false } // Hide 3rd year for inter
//       ]
//     };
//   }
  
//   // Degree mapping
//   if (classLower.includes('degree1') || classLower.includes('degree2') || classLower.includes('degree3')) {
//     return {
//       fields: [
//         { name: 'yearConcession1st', label: '1st Year Concession', show: true },
//         { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
//         { name: 'yearConcession3rd', label: '3rd Year Concession', show: true }
//       ]
//     };
//   }
  
//   // PG mapping
//   if (classLower.includes('pg1') || classLower.includes('pg2')) {
//     return {
//       fields: [
//         { name: 'yearConcession1st', label: '1st Year Concession', show: true },
//         { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
//         { name: 'yearConcession3rd', label: '3rd Year Concession', show: false } // Hide 3rd year for PG
//       ]
//     };
//   }
  
//   // IIT Foundation mapping
//   if (classLower.includes('iit foundation')) {
//     return {
//       fields: [
//         { name: 'yearConcession1st', label: '1st Year Concession', show: true },
//         { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
//         { name: 'yearConcession3rd', label: '3rd Year Concession', show: true }
//       ]
//     };
//   }
  
//   // Pre Nursery and Pre Primary mapping
//   if (classLower.includes('pre nursery') || classLower.includes('pre primary')) {
//     return {
//       fields: [
//         { name: 'yearConcession1st', label: 'Pre Nursery Concession', show: true },
//         { name: 'yearConcession2nd', label: 'Pre Primary 1 Concession', show: true },
//         { name: 'yearConcession3rd', label: 'Pre Primary 2 Concession', show: true }
//       ]
//     };
//   }
  
//   // Default fallback
//   console.log("⚠️ Using default fallback for:", { joiningClassName, classLower });
//   return {
//     fields: [
//       { name: 'yearConcession1st', label: '1st Year Concession', show: true },
//       { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
//       { name: 'yearConcession3rd', label: '3rd Year Concession', show: true }
//     ]
//   };
// };
 
// // Validation schema for ConcessionInfoSection (base schema without mobileNumber validation)
// const baseValidationSchema = Yup.object().shape({
//   yearConcession1st: Yup.string()
//     .matches(/^\d*$/, "Amount must be numeric")
//     .test('total-concession-limit', 'Total concession cannot exceed 100% of orientation fee', function(value) {
//       const { parent } = this;
//       const orientationFee = parent.OrientationFee;
     
//       if (!orientationFee) return true; // Allow if orientation fee is not set
     
//       const concession1st = parseFloat(value) || 0;
//       const concession2nd = parseFloat(parent.yearConcession2nd) || 0;
//       const concession3rd = parseFloat(parent.yearConcession3rd) || 0;
//       const totalConcession = concession1st + concession2nd + concession3rd;
//       const orientationFeeValue = parseFloat(orientationFee) || 0;
     
//       return totalConcession <= orientationFeeValue;
//     })
//     .notRequired(),
//   yearConcession2nd: Yup.string()
//     .matches(/^\d*$/, "Amount must be numeric")
//     .test('total-concession-limit', 'Total concession cannot exceed 100% of orientation fee', function(value) {
//       const { parent } = this;
//       const orientationFee = parent.OrientationFee;
     
//       if (!orientationFee) return true; // Allow if orientation fee is not set
     
//       const concession1st = parseFloat(parent.yearConcession1st) || 0;
//       const concession2nd = parseFloat(value) || 0;
//       const concession3rd = parseFloat(parent.yearConcession3rd) || 0;
//       const totalConcession = concession1st + concession2nd + concession3rd;
//       const orientationFeeValue = parseFloat(orientationFee) || 0;
     
//       return totalConcession <= orientationFeeValue;
//     })
//     .notRequired(),
//   yearConcession3rd: Yup.string()
//     .matches(/^\d*$/, "Amount must be numeric")
//     .test('total-concession-limit', 'Total concession cannot exceed 100% of orientation fee', function(value) {
//       const { parent } = this;
//       const orientationFee = parent.OrientationFee;
     
//       if (!orientationFee) return true; // Allow if orientation fee is not set
     
//       const concession1st = parseFloat(parent.yearConcession1st) || 0;
//       const concession2nd = parseFloat(parent.yearConcession2nd) || 0;
//       const concession3rd = parseFloat(value) || 0;
//       const totalConcession = concession1st + concession2nd + concession3rd;
//       const orientationFeeValue = parseFloat(orientationFee) || 0;
     
//       return totalConcession <= orientationFeeValue;
//     })
//     .notRequired(),
//   givenBy: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
//     is: (c1, c2, c3) => {
//       const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
//       console.log("GivenBy validation check:", { c1, c2, c3, hasConcession });
//       return hasConcession;
//     },
//     then: (schema) => schema.required("Given By is required when concession is applied"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   givenById: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
//     is: (c1, c2, c3) => {
//       const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
//       return hasConcession;
//     },
//     then: (schema) => schema.required("Given By is required when concession is applied"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   authorizedBy: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
//     is: (c1, c2, c3) => {
//       const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
//       console.log("AuthorizedBy validation check:", { c1, c2, c3, hasConcession });
//       return hasConcession;
//     },
//     then: (schema) => schema.required("Authorized By is required when concession is applied"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   authorizedById: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
//     is: (c1, c2, c3) => {
//       const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
//       return hasConcession;
//     },
//     then: (schema) => schema.required("Authorized By is required when concession is applied"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   reason: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
//     is: (c1, c2, c3) => {
//       const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
//       console.log("Reason validation check:", { c1, c2, c3, hasConcession });
//       return hasConcession;
//     },
//     then: (schema) => schema.required("Reason is required when concession is applied"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   concessionReasonId: Yup.string().when(["yearConcession1st", "yearConcession2nd", "yearConcession3rd"], {
//     is: (c1, c2, c3) => {
//       const hasConcession = [c1, c2, c3].some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
//       return hasConcession;
//     },
//     then: (schema) => schema.required("Reason is required when concession is applied"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   additionalConcession: Yup.boolean(),
//   concessionAmount: Yup.string()
//     .matches(/^\d*$/, "Amount must be numeric")
//     .when("additionalConcession", {
//       is: true,
//       then: (schema) => schema.required("Concession Amount is required when additional concession is selected"),
//     }),
//   concessionWrittenBy: Yup.string().when("additionalConcession", {
//     is: true,
//     then: (schema) => schema.required("Concession Written By is required when additional concession is selected"),
//   }),
//   concessionWrittenById: Yup.string().when("additionalConcession", {
//     is: true,
//     then: (schema) => schema.required("Concession Written By is required when additional concession is selected"),
//   }),
//   additionalReason: Yup.string().when("additionalConcession", {
//     is: true,
//     then: (schema) => schema.required("Reason is required when additional concession is selected"),
//   }),
// });
 
// // Custom validation function to handle mobileNumber conditionally
// const customValidate = (values, showMobileNumber) => {
//   const errors = {};
//   if (showMobileNumber) {
//     if (!values.mobileNumber) {
//       errors.mobileNumber = "Mobile Number is required";
//     } else if (!/^\d{10}$/.test(values.mobileNumber)) {
//       errors.mobileNumber = "Mobile Number must be exactly 10 digits";
//     }
//   }
//   return errors;
// };
 
// const ConcessionInfoSection = ({
//   handleNext,
//   handleBack,
//   setCouponDetails,
//   onCouponSubmit,
//   handleChange,
//   setFieldValue,
//   setFieldTouched,
//   setActiveStep,
//   values,
//   errors,
//   touched,
//   validateForm,
// }) => {
//   const [reasonOptions, setReasonOptions] = useState([]);
//   const [employeeOptions, setEmployeeOptions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingStates, setLoadingStates] = useState({
//     reasons: true,
//     employees: true,
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'error'
//   });

//   // Function to show snackbar messages
//   const showSnackbar = (message, severity = 'error') => {
//     setSnackbar({
//       open: true,
//       message,
//       severity
//     });
//   };

//   // Function to close snackbar
//   const closeSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const [error, setError] = useState(null);
//   const [showMobileNumber, setShowMobileNumber] = useState(false);
//   const [persistentErrors, setPersistentErrors] = useState({});
//   const [previousJoiningClass, setPreviousJoiningClass] = useState(null);
 
//   // Helper function to check if total concession exceeds orientation fee
//   const getConcessionTotalError = () => {
//     const orientationFee = values.OrientationFee;
//     if (!orientationFee) return null;
   
//     const concession1st = parseFloat(values.yearConcession1st) || 0;
//     const concession2nd = parseFloat(values.yearConcession2nd) || 0;
//     const concession3rd = parseFloat(values.yearConcession3rd) || 0;
//     const totalConcession = concession1st + concession2nd + concession3rd;
//     const orientationFeeValue = parseFloat(orientationFee) || 0;
   
//     if (totalConcession > orientationFeeValue) {
//       return `Total concession cannot exceed 100% of orientation fee (Max: ${orientationFeeValue})`;
//     }
   
//     return null;
//   };
 
//   // Helper function to get maximum allowed concession amount
//   const getMaxConcessionAmount = () => {
//     const orientationFee = values.OrientationFee;
//     if (!orientationFee) return null;
   
//     const orientationFeeValue = parseFloat(orientationFee) || 0;
//     return orientationFeeValue;
//   };
 
//   // Helper function to determine if a field should show an error
//   const shouldShowError = (fieldName) => {
//     // Special handling for concession fields - show error if total exceeds limit
//     if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd"].includes(fieldName)) {
//       return getConcessionTotalError() !== null || (touched[fieldName] && errors[fieldName]) || persistentErrors[fieldName];
//     }
   
//     return (touched[fieldName] && errors[fieldName]) || persistentErrors[fieldName];
//   };
 
//   // Helper function to get field error message
//   const getFieldError = (fieldName) => {
//     // Special handling for concession fields - return custom error message
//     if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd"].includes(fieldName)) {
//       const customError = getConcessionTotalError();
//       if (customError) {
//         return customError;
//       }
//     }
   
//     return errors[fieldName] || persistentErrors[fieldName];
//   };
 
//   useEffect(() => {
//     const fetchData = async () => {
//       console.log("🔄 Starting to fetch concession dropdown options from API...");
     
//       try {
//         // Fetch both APIs in parallel
//         const [authorizedByData, concessionReasonData] = await Promise.all([
//           apiService.fetchAuthorizedByAll(),
//           apiService.fetchConcessionReasonAll(),
//         ]);
 
//         console.log("Authorized by data:", authorizedByData);
//         console.log("Concession reason data:", concessionReasonData);
 
//         // Process authorized by data (for givenBy, authorizedBy, concessionWrittenBy)
//         let authorizedByArray = [];
//         if (Array.isArray(authorizedByData)) {
//           authorizedByArray = authorizedByData;
//         } else if (authorizedByData && typeof authorizedByData === 'object') {
//           authorizedByArray = [authorizedByData];
//         }
 
//         const processedAuthorizedBy = authorizedByArray
//           .filter((item) => item && item.id != null && item.name)
//           .map((item) => ({
//             value: item.id?.toString() || "",
//             label: item.name || "",
//           }));
 
//         // Process concession reason data
//         let concessionReasonArray = [];
//         if (Array.isArray(concessionReasonData)) {
//           concessionReasonArray = concessionReasonData;
//         } else if (concessionReasonData && typeof concessionReasonData === 'object') {
//           concessionReasonArray = [concessionReasonData];
//         }
 
//         const processedConcessionReasons = concessionReasonArray
//           .filter((item) => item && item.id != null && item.name)
//           .map((item) => ({
//             value: item.id?.toString() || "",
//             label: item.name || "",
//           }));
 
//         // Set the options
//         setEmployeeOptions(processedAuthorizedBy);
//         setReasonOptions(processedConcessionReasons);
 
//         // Update loading states
//         setLoadingStates({
//           reasons: false,
//           employees: false,
//         });
 
//         console.log("✅ Loaded authorized by:", processedAuthorizedBy);
//         console.log("✅ Loaded concession reasons:", processedConcessionReasons);
//       } catch (error) {
//         console.error("❌ Error fetching concession data:", error);
//         setLoadingStates({
//           reasons: false,
//           employees: false,
//         });
//       }
//     };
   
//     fetchData();
//   }, []);
 
//   // Trigger validation when concession amounts change
//   useEffect(() => {
//     const hasConcession = [values.yearConcession1st, values.yearConcession2nd, values.yearConcession3rd]
//       .some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
 
//     if (hasConcession) {
//       // Set persistent errors for all required fields when concession is entered
//       setPersistentErrors({
//         givenBy: "Given By is required when concession is applied",
//         givenById: "Given By is required when concession is applied",
//         authorizedBy: "Authorized By is required when concession is applied",
//         authorizedById: "Authorized By is required when concession is applied",
//         reason: "Reason is required when concession is applied",
//         concessionReasonId: "Reason is required when concession is applied"
//       });
     
//       // Mark all concession-related fields as touched to show validation errors
//       setFieldTouched("givenBy", true);
//       setFieldTouched("givenById", true);
//       setFieldTouched("authorizedBy", true);
//       setFieldTouched("authorizedById", true);
//       setFieldTouched("reason", true);
//       setFieldTouched("concessionReasonId", true);
//     } else {
//       // Clear all concession-related fields when no concession amount is entered
//       console.log("🧹 useEffect: Clearing all concession fields as no concession amount is entered");
//       setFieldValue("givenBy", "");
//       setFieldValue("givenById", "");
//       setFieldValue("authorizedBy", "");
//       setFieldValue("authorizedById", "");
//       setFieldValue("reason", "");
//       setFieldValue("concessionReasonId", "");
//       setFieldValue("concessionWrittenBy", "");
//       setFieldValue("concessionWrittenById", "");
//       setFieldValue("additionalReason", "");
//       setFieldValue("concessionAmount", "");
//       setFieldValue("additionalConcession", false);
     
//       // Clear touched state and persistent errors for these fields
//       setFieldTouched("givenBy", false);
//       setFieldTouched("givenById", false);
//       setFieldTouched("authorizedBy", false);
//       setFieldTouched("authorizedById", false);
//       setFieldTouched("reason", false);
//       setFieldTouched("concessionReasonId", false);
//       setFieldTouched("concessionWrittenBy", false);
//       setFieldTouched("concessionWrittenById", false);
//       setFieldTouched("additionalReason", false);
//       setFieldTouched("concessionAmount", false);
//       setFieldTouched("additionalConcession", false);
     
//       // Clear persistent errors
//       setPersistentErrors({});
//     }
//   }, [values.yearConcession1st, values.yearConcession2nd, values.yearConcession3rd, setFieldTouched, setFieldValue]);

//   // Get dynamic concession field mapping based on joining class
//   const joiningClassName = values.joiningClassName || values.joiningClass || values.joinInto;
  
//   // Try to get the actual class name if the value is an ID
//   const getActualClassName = (value) => {
//     if (!value) return value;
    
//     // If it's already a string name, return it
//     if (typeof value === 'string' && !/^\d+$/.test(value)) {
//       return value;
//     }
    
//     // If it's a number or ID, map it to the actual class name
//     console.log("🔍 Joining class value appears to be an ID:", value);
    
//     // Complete ID to class name mapping from database
//     const idToClassNameMap = {
//       '1': 'INTER1',
//       '2': 'INTER2',
//       '3': 'SHORT_TERM',
//       '4': 'OYP',
//       '5': 'TYP',
//       '6': 'LONG_TERM',
//       '7': 'DEGREE1',
//       '8': 'DEGREE2',
//       '9': 'DEGREE3',
//       '10': 'NON_PROGRAM',
//       '11': 'IIT FOUNDATION 8TH',
//       '12': 'IIT FOUNDATION 9TH',
//       '13': 'IIT FOUNDATION 10TH',
//       '14': 'PG1',
//       '15': 'PG2',
//       '16': 'TYP2',
//       '17': '6TH CLASS',
//       '18': '7TH CLASS',
//       '19': '8TH CLASS',
//       '20': '9TH CLASS',
//       '21': '10TH CLASS',
//       '22': '5TH CLASS',
//       '23': '4TH CLASS',
//       '24': '3RD CLASS',
//       '25': '2ND CLASS',
//       '26': '1ST CLASS',
//       '27': 'NURSERY',
//       '28': 'LKG',
//       '29': 'UKG',
//       '32': 'PRE NURSERY',
//       '33': 'PRE PRIMARY 1',
//       '34': 'PRE PRIMARY 2',
//       '35': '11TH CLASS',
//       '36': '12TH CLASS',
//     };
    
//     const actualClassName = idToClassNameMap[value] || value;
//     console.log("🔍 Mapped ID to class name:", value, "→", actualClassName);
//     return actualClassName;
//   };
  
//   const actualClassName = getActualClassName(joiningClassName);
//   const concessionMapping = getConcessionFieldMapping(actualClassName);
  
//   // Test the mapping function with some common values
//   console.log("🧪 Testing mapping function:");
//   console.log("  - Nursery:", getConcessionFieldMapping("Nursery"));
//   console.log("  - 1st:", getConcessionFieldMapping("1st"));
//   console.log("  - 9th:", getConcessionFieldMapping("9th"));
//   console.log("  - 9TH CLASS:", getConcessionFieldMapping("9TH CLASS"));
//   console.log("  - Inter:", getConcessionFieldMapping("Inter"));
//   console.log("  - Current value:", actualClassName, "→", concessionMapping);

//   // Clear concession fields when joining class changes
//   useEffect(() => {
//     if (joiningClassName && joiningClassName !== previousJoiningClass) {
//       console.log("🔄 Joining class changed from", previousJoiningClass, "to", joiningClassName);
//       setPreviousJoiningClass(joiningClassName);
      
//       // Clear concession fields
//       setFieldValue("yearConcession1st", "");
//       setFieldValue("yearConcession2nd", "");
//       setFieldValue("yearConcession3rd", "");
//       setFieldTouched("yearConcession1st", false);
//       setFieldTouched("yearConcession2nd", false);
//       setFieldTouched("yearConcession3rd", false);
      
//       // Force component re-render by updating state
//       setPersistentErrors(prev => ({ ...prev, _forceUpdate: Date.now() }));
//     }
//   }, [joiningClassName, previousJoiningClass, setFieldValue, setFieldTouched]);
  
//   // Debug log to see the dynamic mapping
//   console.log("🎯 Dynamic Concession Mapping:", {
//     joiningClassName,
//     actualClassName,
//     concessionMapping,
//     fields: concessionMapping.fields,
//     allValues: values,
//     joiningClassNameFromValues: values.joiningClassName,
//     availableKeys: Object.keys(values),
//     hasJoiningClassName: 'joiningClassName' in values,
//     joiningClassNameValue: values.joiningClassName
//   });
  
//   // Create dynamic flatfields based on joining class
//   const getDynamicFlatfields = () => {
//     const baseFields = [
//       { label: "Mobile Number", name: "mobileNumber", placeholder: "Enter Mobile Number", required: true },
//     ];
    
//     // Add dynamic concession fields based on joining class
//     if (concessionMapping && concessionMapping.fields) {
//       concessionMapping.fields.forEach((field) => {
//         if (field.show) {
//           baseFields.push({
//             label: field.label,
//             name: field.name,
//             placeholder: `Enter ${field.label}`,
//           });
//         }
//       });
//     } else {
//       // Fallback to default fields if no mapping is available
//       console.log("⚠️ No concession mapping available, using default fields");
//       baseFields.push(
//         { label: "1st Year Concession", name: "yearConcession1st", placeholder: "Enter 1st Year Concession" },
//         { label: "2nd Year Concession", name: "yearConcession2nd", placeholder: "Enter 2nd Year Concession" },
//         { label: "3rd Year Concession", name: "yearConcession3rd", placeholder: "Enter 3rd Year Concession" }
//       );
//     }
    
//     // Add other fields
//     baseFields.push(
//       { label: "Given By", name: "givenBy", type: "select", options: employeeOptions, required: true },
//       { label: "Description", name: "description", placeholder: "Enter Description" },
//       { label: "Authorized By", name: "authorizedBy", type: "select", options: employeeOptions, required: true },
//       { label: "Reason", name: "reason", type: "select", options: reasonOptions, required: true },
//       { label: "Concession Amount", name: "concessionAmount", placeholder: "Enter Concession amount" },
//       { label: "Concession Written By", name: "concessionWrittenBy", type: "select", options: employeeOptions },
//       { label: "Reason", name: "additionalReason", placeholder: "Enter Reason" }
//     );
    
//     return baseFields;
//   };
  
//   const flatfields = getDynamicFlatfields();
  
//   // Debug the flatfields array
//   console.log("🔍 Flatfields array:", flatfields.map(f => ({ name: f.name, label: f.label, show: f.show })));
 
//   // Helper function to capitalize text
//   const capitalizeText = (text) => {
//     if (!text) return text;
//     return text
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(' ');
//   };

//   const handleSectionChange = (e) => {
//     const { name, value } = e.target;
//     let finalValue = value;
//     if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd", "concessionAmount"].includes(name)) {
//       finalValue = value.replace(/\D/g, '');
//     } else if (["description", "additionalReason"].includes(name)) {
//       finalValue = value.replace(/[^a-zA-Z\s\.\-]/g, '');
//       // Apply capitalization to text fields
//       finalValue = capitalizeText(finalValue);
//     } else if (name === "mobileNumber") {
//       finalValue = value.replace(/\D/g, '').slice(0, 10);
//     }
//     setFieldValue(name, finalValue);
//     setFieldTouched(name, true);
   
//     // Handle concession amount changes
//     if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd"].includes(name)) {
//       // Get all concession amounts including the current change
//       const allConcessionAmounts = [
//         name === "yearConcession1st" ? finalValue : values.yearConcession1st,
//         name === "yearConcession2nd" ? finalValue : values.yearConcession2nd,
//         name === "yearConcession3rd" ? finalValue : values.yearConcession3rd
//       ];
     
//       const hasConcession = allConcessionAmounts.some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
     
//       // Real-time validation for concession total
//       const orientationFee = values.OrientationFee;
//       if (hasConcession && orientationFee) {
//         const totalConcession = allConcessionAmounts.reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
//         const orientationFeeValue = parseFloat(orientationFee) || 0;
       
//         console.log(`🔍 Concession validation:`, {
//           totalConcession,
//           orientationFeeValue,
//           exceeds: totalConcession > orientationFeeValue
//         });
       
//         if (totalConcession > orientationFeeValue) {
//           console.log(`⚠️ Total concession (${totalConcession}) exceeds orientation fee (${orientationFeeValue})`);
//         }
//       }
     
//       if (hasConcession) {
//         // Only mark fields as touched to show validation errors, don't clear them
//         setFieldTouched("givenBy", true);
//         setFieldTouched("givenById", true);
//         setFieldTouched("authorizedBy", true);
//         setFieldTouched("authorizedById", true);
//         setFieldTouched("reason", true);
//         setFieldTouched("concessionReasonId", true);
//       } else {
//         // Clear all concession-related fields when no concession amount is entered
//         console.log("🧹 Clearing all concession fields as no concession amount is entered");
//         setFieldValue("givenBy", "");
//         setFieldValue("givenById", "");
//         setFieldValue("authorizedBy", "");
//         setFieldValue("authorizedById", "");
//         setFieldValue("reason", "");
//         setFieldValue("concessionReasonId", "");
//         setFieldValue("concessionWrittenBy", "");
//         setFieldValue("concessionWrittenById", "");
//         setFieldValue("additionalReason", "");
//         setFieldValue("concessionAmount", "");
//         setFieldValue("additionalConcession", false);
       
//         // Clear touched state for these fields
//         setFieldTouched("givenBy", false);
//         setFieldTouched("givenById", false);
//         setFieldTouched("authorizedBy", false);
//         setFieldTouched("authorizedById", false);
//         setFieldTouched("reason", false);
//         setFieldTouched("concessionReasonId", false);
//         setFieldTouched("concessionWrittenBy", false);
//         setFieldTouched("concessionWrittenById", false);
//         setFieldTouched("additionalReason", false);
//         setFieldTouched("concessionAmount", false);
//         setFieldTouched("additionalConcession", false);
//       }
//     }
   
//     // Show mobileNumber row when typing in coupon field
//     if (name === "coupon" && finalValue.trim() !== "") {
//       setShowMobileNumber(true);
//     }
//   };
 
//   const handleEmployeeChange = (name) => (e) => {
//     const selectedLabel = e.target.value;
//     const selectedEmployee = employeeOptions.find((opt) => opt.label === selectedLabel);
//     console.log(`🎯 handleEmployeeChange for ${name}:`, { selectedLabel, selectedEmployee });
   
//     setFieldValue(name, selectedLabel || '');
//     setFieldValue(`${name}Id`, selectedEmployee ? String(selectedEmployee.value) : '');
//     setFieldTouched(name, true);
//     setFieldTouched(`${name}Id`, true);
   
//     // Clear persistent error only for this specific field
//     if (selectedLabel && selectedLabel.trim() !== '') {
//       setPersistentErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         delete newErrors[`${name}Id`];
//         console.log(`✅ Cleared persistent errors for ${name} and ${name}Id`);
//         return newErrors;
//       });
//     }
//   };
 
//   const handleReasonChange = (e) => {
//     const selectedLabel = e.target.value;
//     const selectedReason = reasonOptions.find((opt) => opt.label === selectedLabel);
//     console.log(`🎯 handleReasonChange:`, { selectedLabel, selectedReason });
   
//     setFieldValue("reason", selectedLabel || '');
//     setFieldValue("concessionReasonId", selectedReason ? String(selectedReason.value) : '');
//     setFieldTouched("reason", true);
//     setFieldTouched("concessionReasonId", true);
   
//     // Clear persistent error only for this specific field
//     if (selectedLabel && selectedLabel.trim() !== '') {
//       setPersistentErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors["reason"];
//         delete newErrors["concessionReasonId"];
//         console.log(`✅ Cleared persistent errors for reason and concessionReasonId`);
//         return newErrors;
//       });
//     }
//   };
 
//   const handleApplyCoupon = () => {
//     setCouponDetails({ mobile: values.mobileNumber || "", code: values.coupon || "" });
//     onCouponSubmit();
//   };
 
//   const handleSubmit = async () => {
//     console.log("=== Validation Debug ===");
//     console.log("Current values:", values);
//     console.log("Concession amounts:", {
//       yearConcession1st: values.yearConcession1st,
//       yearConcession2nd: values.yearConcession2nd,
//       yearConcession3rd: values.yearConcession3rd
//     });
//     console.log("Dropdown values:", {
//       givenBy: values.givenBy,
//       givenById: values.givenById,
//       authorizedBy: values.authorizedBy,
//       authorizedById: values.authorizedById,
//       reason: values.reason,
//       concessionReasonId: values.concessionReasonId
//     });
   
//     // Log complete form data object
//     console.log("🚀 ===== CONCESSION - FINAL SUBMITTING OBJECT =====");
//     console.log("📋 Complete Form Data:", JSON.stringify(values, null, 2));
//     console.log("📊 Form Data Summary:", {
//       totalFields: Object.keys(values).length,
//       filledFields: Object.keys(values).filter(key => values[key] !== "" && values[key] != null).length,
//       emptyFields: Object.keys(values).filter(key => values[key] === "" || values[key] == null).length,
//       formValues: values
//     });
//     console.log("🔍 Field-by-Field Data:");
//     Object.entries(values).forEach(([key, value]) => {
//       console.log(`  ${key}:`, value);
//     });
//     console.log("🚀 ===== END CONCESSION OBJECT =====");
   
//     const errors = await validateForm();
//     console.log("Validation errors:", errors);
   
//     const touchedFields = Object.keys(errors).reduce((acc, field) => {
//       acc[field] = true;
//       return acc;
//     }, {});
//     setFieldTouched(touchedFields);
   
//     if (Object.keys(errors).length === 0) {
//       handleNext();
//     } else {
//       console.log("Validation failed, errors:", errors);
//     }
//   };
 
//   // Form is now always rendered, dropdowns load in background
//   if (error) {
//     return <div className={styles.Concession_Info_Section_error}>{error}</div>;
//   }
 
//   return (
//     <div key={`concession-${joiningClassName || 'default'}`} className={styles.Concession_Info_Section_concessionsContainer}>
//       <div className={styles.Concession_Info_Section_applyCoupon}>
//         <div>
//           <div className={styles.Concession_Info_Section_applyCouponLabel}>
//             <span className={styles.Concession_Info_Section_applyCouponLabelName}>Apply Coupon</span>
//             <div className={styles.Concession_Info_Section_line}></div>
//           </div>
//           <div className={styles.Concession_Info_Section_couponSection}>
//             <InputBox
//               name="coupon"
//               placeholder="Enter Coupon"
//               className={styles.Concession_Info_Section_couponInput}
//               onChange={handleSectionChange}
//               value={values.coupon || ""}
//             />
//             <MUIButton
//               variant="contained"
//               className={styles.Concession_Info_Section_applyBtn}
//               onClick={handleApplyCoupon}
//             >
//               Apply Coupon
//             </MUIButton>
//           </div>
//         </div>
//       </div>
//       <div className={styles.Concession_Info_Section_concessionsFields}>
//         {showMobileNumber && (
//           <>
//             <div className={styles.Concession_Info_Section_concessionInput}>
//               <div className={styles.ConcessioninputWithIconWrapper}>
//                 <InputBox
//                   label={flatfields[0]?.label || "Mobile Number"}
//                   name={flatfields[0]?.name || "mobileNumber"}
//                   placeholder={flatfields[0]?.placeholder || "Enter Mobile Number"}
//                   value={values[flatfields[0]?.name] || ""}
//                   required={flatfields[0]?.required || false}
//                   onChange={handleSectionChange}
//                 />
//                 <PhoneIcon className={styles.ConcessioninputWithIcon} />
//               </div>
//               {touched[flatfields[0]?.name] && errors[flatfields[0]?.name] && (
//                 <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[0]?.name]}</div>
//               )}
//             </div>
//             <div className={styles.Concession_Info_Section_emptyField}></div>
//             <div className={styles.Concession_Info_Section_emptyField}></div>
//           </>
//         )}
//         {flatfields.slice(1, 8).map((field, index) => {
//           // Check if this field should be shown based on concession mapping
//           const shouldShowField = () => {
//             if (field.name === 'yearConcession1st' || field.name === 'yearConcession2nd' || field.name === 'yearConcession3rd') {
//               const fieldMapping = concessionMapping.fields.find(f => f.name === field.name);
//               return fieldMapping ? fieldMapping.show : true;
//             }
//             return true; // Show all other fields
//           };
          
//           if (!shouldShowField()) {
//             return null; // Don't render this field
//           }
          
//           return (
//             <div
//               key={index + 1}
//               className={styles.Concession_Info_Section_concessionInput}
//             >
//               {field.type === "select" ? (
//                 <Dropdown
//                   dropdownname={field.label}
//                   name={field.name}
//                   results={field.options?.map((opt) => opt.label) || []}
//                   value={values[field.name] || ""}
//                 onChange={field.name.includes("givenBy") || field.name.includes("authorizedBy")
//                   ? handleEmployeeChange(field.name)
//                   : field.name === "reason"
//                   ? handleReasonChange
//                   : handleSectionChange}
//                 required={field.required}
//                 disabled={field.name === "reason" ? loadingStates.reasons : loadingStates.employees}
//                 loading={field.name === "reason" ? loadingStates.reasons : loadingStates.employees}
//               />
//             ) : (
//               <InputBox
//                 label={field.label}
//                 name={field.name}
//                 placeholder={field.placeholder}
//                 value={values[field.name] || ""}
//                 required={field.required}
//                 onChange={handleSectionChange}
//               />
//             )}
//             {shouldShowError(field.name) || (touched[field.name] && (errors[field.name] || errors[`${field.name}Id`])) || persistentErrors[field.name] || persistentErrors[`${field.name}Id`] ? (
//               <div className={styles.Concession_Info_Section_concessionError}>
//                 {getFieldError(field.name) || errors[field.name] || errors[`${field.name}Id`] || persistentErrors[field.name] || persistentErrors[`${field.name}Id`]}
//               </div>
//             ) : null}
//           </div>
//           );
//         })}
//         <div className={styles.Concession_Info_Section_emptyField}></div>
//         <div className={styles.Concession_Info_Section_emptyField}></div>
//         <div className={styles.Concession_Info_Section_extraConcession}>
//           <label className={styles.ConcessionInfoSection_squareCheckbox}>
//             <input
//               type="checkbox"
//               name="additionalConcession"
//               checked={values.additionalConcession || false}
//               onChange={(e) => setFieldValue("additionalConcession", e.target.checked)}
//             />
//             <span className={styles.ConcessionInfoSection_checkmark}></span>
//             Additional Concession Written on Application
//           </label>
//           <div className={styles.line}></div>
//         </div>
//         {values.additionalConcession && (
//           <>
//             <div className={styles.Concession_Info_Section_concessionInput}>
//               <InputBox
//                 label={flatfields[8]?.label || "Concession Amount"}
//                 name={flatfields[8]?.name || "concessionAmount"}
//                 placeholder={flatfields[8]?.placeholder || "Enter Concession Amount"}
//                 value={values[flatfields[8]?.name] || ""}
//                 required={true}
//                 onChange={handleSectionChange}
//               />
//               {touched[flatfields[8]?.name] && errors[flatfields[8]?.name] && (
//                 <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[8]?.name]}</div>
//               )}
//             </div>
//             <div className={styles.Concession_Info_Section_concessionInput}>
//               <Dropdown
//                 dropdownname={flatfields[9]?.label || "Concession Written By"}
//                 name={flatfields[9]?.name || "concessionWrittenBy"}
//                 results={flatfields[9]?.options?.map((opt) => opt.label) || []}
//                 value={values[flatfields[9]?.name] || ""}
//                 onChange={handleEmployeeChange(flatfields[9]?.name || "concessionWrittenBy")}
//                 required={true}
//                 disabled={loadingStates.employees}
//                 loading={loadingStates.employees}
//               />
//               {(touched[flatfields[9]?.name] && (errors[flatfields[9]?.name] || errors[`${flatfields[9]?.name}Id`])) || persistentErrors[flatfields[9]?.name] || persistentErrors[`${flatfields[9]?.name}Id`] ? (
//                 <div className={styles.Concession_Info_Section_concessionError}>
//                   {errors[flatfields[9]?.name] || errors[`${flatfields[9]?.name}Id`] || persistentErrors[flatfields[9]?.name] || persistentErrors[`${flatfields[9]?.name}Id`]}
//                 </div>
//               ) : null}
//             </div>
//             <div className={styles.Concession_Info_Section_concessionInput}>
//               <InputBox
//                 label={flatfields[10]?.label || "Additional Reason"}
//                 name={flatfields[10]?.name || "additionalReason"}
//                 placeholder={flatfields[10]?.placeholder || "Enter Additional Reason"}
//                 value={values[flatfields[10]?.name] || ""}
//                 required={true}
//                 onChange={handleSectionChange}
//               />
//               {touched[flatfields[10]?.name] && errors[flatfields[10]?.name] && (
//                 <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[10]?.name]}</div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//       <div className={styles.Concession_Info_Section_buttonRow}>
//         <Button
//           type="button"
//           variant="secondary"
//           buttonname="Back"
//           lefticon={<BackArrow />}
//           onClick={handleBack}
//           width={"100%"}
//         />
//         <Button
//           type="button"
//           variant="primary"
//           buttonname="Proceed To Add Address"
//           righticon={<TrendingUpIcon />}
//           onClick={handleSubmit}
//         />
//       </div>
//       <a
//         href="#"
//         className={styles.concessionLinkButton}
//         onClick={async (e) => {
//           e.preventDefault();
         
//           // Log complete form data object for skip to payments
//           console.log("🚀 ===== CONCESSION SKIP TO PAYMENTS - FINAL SUBMITTING OBJECT =====");
//           console.log("📋 Complete Form Data:", JSON.stringify(values, null, 2));
//           console.log("📊 Form Data Summary:", {
//             totalFields: Object.keys(values).length,
//             filledFields: Object.keys(values).filter(key => values[key] !== "" && values[key] != null).length,
//             emptyFields: Object.keys(values).filter(key => values[key] === "" || values[key] == null).length,
//             formValues: values
//           });
//           console.log("🔍 Field-by-Field Data:");
//           Object.entries(values).forEach(([key, value]) => {
//             console.log(`  ${key}:`, value);
//           });
//           console.log("🚀 ===== END CONCESSION SKIP TO PAYMENTS OBJECT =====");
         
//           const errors = await validateForm();
//           const touchedFields = Object.keys(errors).reduce((acc, field) => {
//             acc[field] = true;
//             return acc;
//           }, {});
//           setFieldTouched(touchedFields);
//           if (Object.keys(errors).length === 0) {
//             setActiveStep && setActiveStep(3);
//           } else {
//             const errorMessage = "Please correct the following errors before proceeding to payments:\n" +
//               Object.entries(errors)
//                 .map(([field, error]) => `${field}: ${error}`)
//                 .join("\n");
//             showSnackbar(errorMessage, 'error');
//           }
//         }}
//       >
//         <figure style={{ margin: 0, display: "flex", alignItems: "center" }}>
//           <img src={SkipIcon} alt="Skip" style={{ width: 24, height: 24 }} />
//         </figure>
//         Skip all and proceed to payments
//       </a>
//       <Snackbar
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={closeSnackbar}
//         position="bottom-center"
//       />
//     </div>
//   );
// };
 
// // Create the final validation schema that combines base schema with custom validation
// const concessionValidationSchema = baseValidationSchema;
 
// ConcessionInfoSection.validationSchema = concessionValidationSchema;
 
// export default ConcessionInfoSection;


