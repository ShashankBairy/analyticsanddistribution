// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { Formik, Form } from "formik";
// import ArrowBack from "@mui/icons-material/ArrowBack";
// import StatusSelector from "../../../../widgets/StatusSelector/StatusSelector";
// import ProgressHeader from "../../../../widgets/ProgressHeader/ProgressHeader";
// import StepperTabs from "../../../../widgets/StepperTabs/StepperTabs";
// import GeneralInfoSection from "../../GeneralInfoSection/GeneralInfoSectionClean";
// import { useGeneralInfoForm, generalInfoValidationSchema } from "../../GeneralInfoSection/useGeneralInfoForm";
// import ConcessionInfoSection from "../../Concession/ConcessionInfoSection";
// import AddressInfoSection from "../../AddressInfoSection/AddressInfoSection";
// import PaymentInfoSection from "../../PaymentInfoSection/PaymentInfoSection";
// import ConfirmationHeader from "../../Conformation/ConformationHeader";
// import Damaged from "../../Damaged/Damaged";
// import SuccessPage from "../../ConformationPage/SuccessPage";
// import StatusHeader from "../../Conformation/StatusHeader/StatusHeader";
// import apiService from "../../../../queries/application-status/SaleFormapis";
// import backButton from "../../../../assets/application-status/BakArrow.svg";
// import * as Yup from "yup";
// import styles from "./ApplicationStatusForm.module.css";

// // Helper function to safely parse floats with fallback
// const safeParseFloat = (value, fallback = 0) => {
//   if (!value || value === "" || value === null || value === undefined) return fallback;
//   const parsed = parseFloat(value);
//   return isNaN(parsed) ? fallback : parsed;
// };

// // Helper function to get concession data with correct IDs based on joining class
// const getConcessionData = (formData) => {
//   console.log("🚀🚀🚀 getConcessionData function called! 🚀🚀🚀");
//   console.log("🚀 Form data keys:", Object.keys(formData));
//   console.log("🚀 Form data classId:", formData.classId);
//   console.log("🚀 Form data joiningClassName:", formData.joiningClassName);
//   console.log("🚀 Form data joiningClass:", formData.joiningClass);
//   console.log("🚀 Concession amount fields:", {
//     yearConcession1st: formData.yearConcession1st,
//     yearConcession2nd: formData.yearConcession2nd,
//     yearConcession3rd: formData.yearConcession3rd
//   });
//   console.log("🚀 Concession ID fields:", {
//     concessionTypeId1st: formData.concessionTypeId1st,
//     concessionTypeId2nd: formData.concessionTypeId2nd,
//     concessionTypeId3rd: formData.concessionTypeId3rd,
//     firstYearConcessionId: formData.firstYearConcessionId,
//     secondYearConcessionId: formData.secondYearConcessionId,
//     thirdYearConcessionId: formData.thirdYearConcessionId
//   });
  
//   // Check if form data already has concession type IDs
//   const hasConcessionTypeIds = formData.concessionTypeId1st || formData.concessionTypeId2nd || formData.concessionTypeId3rd;
  
//   if (hasConcessionTypeIds) {
//     console.log("✅ Found concession type IDs in form data, using them directly");
//     const concessions = [];
    
//     if (formData.yearConcession1st && safeParseFloat(formData.yearConcession1st) > 0 && formData.concessionTypeId1st) {
//       concessions.push({
//         concTypeId: parseInt(formData.concessionTypeId1st),
//         amount: safeParseFloat(formData.yearConcession1st)
//       });
//     }
    
//     if (formData.yearConcession2nd && safeParseFloat(formData.yearConcession2nd) > 0 && formData.concessionTypeId2nd) {
//       concessions.push({
//         concTypeId: parseInt(formData.concessionTypeId2nd),
//         amount: safeParseFloat(formData.yearConcession2nd)
//       });
//     }
    
//     if (formData.yearConcession3rd && safeParseFloat(formData.yearConcession3rd) > 0 && formData.concessionTypeId3rd) {
//       concessions.push({
//         concTypeId: parseInt(formData.concessionTypeId3rd),
//         amount: safeParseFloat(formData.yearConcession3rd)
//       });
//     }
    
//     console.log("🎯 Using form data concession type IDs:", concessions);
//     return concessions;
//   }
  
//   // Check for 1st year, 2nd year, 3rd year concession IDs in form data
//   const hasYearConcessionIds = formData.firstYearConcessionId || formData.secondYearConcessionId || formData.thirdYearConcessionId;
  
//   if (hasYearConcessionIds) {
//     console.log("✅ Found year concession IDs in form data, using them directly");
//     const concessions = [];
    
//     if (formData.yearConcession1st && safeParseFloat(formData.yearConcession1st) > 0 && formData.firstYearConcessionId) {
//       concessions.push({
//         concTypeId: parseInt(formData.firstYearConcessionId),
//         amount: safeParseFloat(formData.yearConcession1st)
//       });
//     }
    
//     if (formData.yearConcession2nd && safeParseFloat(formData.yearConcession2nd) > 0 && formData.secondYearConcessionId) {
//       concessions.push({
//         concTypeId: parseInt(formData.secondYearConcessionId),
//         amount: safeParseFloat(formData.yearConcession2nd)
//       });
//     }
    
//     if (formData.yearConcession3rd && safeParseFloat(formData.yearConcession3rd) > 0 && formData.thirdYearConcessionId) {
//       concessions.push({
//         concTypeId: parseInt(formData.thirdYearConcessionId),
//         amount: safeParseFloat(formData.yearConcession3rd)
//       });
//     }
    
//     console.log("🎯 Using year concession IDs from form data:", concessions);
//     return concessions;
//   }
  
//   // Fallback to class-based mapping if no concession type IDs found
//   console.log("⚠️ No concession type IDs found in form data, using class-based mapping");
  
//   // Try different possible field names for the class
//   const joiningClassName = formData.joiningClassName || formData.joiningClass || formData.joinInto || '';
//   const classLower = joiningClassName.toLowerCase();
  
//   // If no class name found, try to map from classId or if joiningClassName is a number
//   let actualClassName = joiningClassName;
  
//   // Check if joiningClassName is a numeric string (like "19")
//   if (joiningClassName && /^\d+$/.test(joiningClassName)) {
//     const classIdToNameMap = {
//        19: '8TH CLASS',
//        18: '7TH CLASS', 
//        17: '6TH CLASS',
//        16: '5TH CLASS',
//        15: '4TH CLASS',
//        14: '3RD CLASS',
//        13: '2ND CLASS',
//        12: '1ST CLASS',
//        11: 'UKG',
//        10: 'LKG',
//        9: 'NURSERY'
//     };
//     actualClassName = classIdToNameMap[parseInt(joiningClassName)] || '';
//     console.log("🔍 Mapped numeric joiningClassName to className:", joiningClassName, "→", actualClassName);
//   }
//   // If no class name found, try to map from classId
//   else if (!actualClassName && formData.classId) {
//     const classIdToNameMap = {
//        19: '8TH CLASS',
//        18: '7TH CLASS', 
//        17: '6TH CLASS',
//        16: '5TH CLASS',
//        15: '4TH CLASS',
//        14: '3RD CLASS',
//        13: '2ND CLASS',
//        12: '1ST CLASS',
//        11: 'UKG',
//        10: 'LKG',
//        9: 'NURSERY'
//     };
//     actualClassName = classIdToNameMap[formData.classId] || '';
//     console.log("🔍 Mapped classId to className:", formData.classId, "→", actualClassName);
//   }
  
//   // Try to use classId directly for mapping first (highest priority)
//   if (formData.classId) {
//     console.log("🔍 Using classId directly for mapping:", formData.classId);
//     console.log("🔍 actualClassName at this point:", actualClassName);
//     console.log("🔍 joiningClassName at this point:", joiningClassName);
//     // Map classId directly to concession type IDs based on your images
//     const classIdToConcessionMap = {
//       17: { ids: [15, 16, 17], labels: ['6th', '7th', '8th'] }, // 6TH CLASS
//       18: { ids: [16, 17, 18], labels: ['7th', '8th', '9th'] }, // 7TH CLASS  
//       19: { ids: [17, 18, 19], labels: ['8th', '9th', '10th'] }, // 8TH CLASS
//       20: { ids: [18, 19, 1], labels: ['9th', '10th', '1st year'] }, // 9TH CLASS
//       21: { ids: [19, 1, 2], labels: ['10th', '1st year', '2nd year'] }, // 10TH CLASS
//       22: { ids: [14, 15, 16], labels: ['5th', '6th', '7th'] }, // 5TH CLASS
//       23: { ids: [13, 14, 15], labels: ['4th', '5th', '6th'] }, // 4TH CLASS
//       24: { ids: [12, 13, 14], labels: ['3rd', '4th', '5th'] }, // 3RD CLASS
//       25: { ids: [11, 12, 13], labels: ['2nd', '3rd', '4th'] }, // 2ND CLASS
//       26: { ids: [10, 11, 12], labels: ['1st', '2nd', '3rd'] }, // 1ST CLASS
//       27: { ids: [7, 8, 9], labels: ['Nursery', 'LKG', 'UKG'] }, // NURSERY
//       28: { ids: [8, 9, 10], labels: ['LKG', 'UKG', '1st'] }, // LKG
//       29: { ids: [9, 10, 11], labels: ['UKG', '1st', '2nd'] } // UKG
//     };
    
//     const mapping = classIdToConcessionMap[formData.classId];
//     if (mapping) {
//       console.log("✅ Found direct classId mapping:", formData.classId, "→", mapping);
//       console.log("🎯 Mapping details:", {
//         classId: formData.classId,
//         ids: mapping.ids,
//         labels: mapping.labels,
//         concTypeIds: mapping.ids
//       });
//       const result = {
//         fields: [
//           { name: 'yearConcession1st', label: mapping.labels[0] + ' Concession', concTypeId: mapping.ids[0] },
//           { name: 'yearConcession2nd', label: mapping.labels[1] + ' Concession', concTypeId: mapping.ids[1] },
//           { name: 'yearConcession3rd', label: mapping.labels[2] + ' Concession', concTypeId: mapping.ids[2] }
//         ]
//       };
//       console.log("🎯 DIRECT CLASSID MAPPING RESULT:", result);
//       console.log("🎯 Returning concTypeIds:", result.fields.map(f => f.concTypeId));
//       return result;
//     } else {
//       console.log("❌ No direct classId mapping found for:", formData.classId);
//     }
//   }
  
//   console.log("🔍 getConcessionData called with:", {
//     joiningClassName,
//     actualClassName,
//     classLower,
//     formDataKeys: Object.keys(formData),
//     yearConcession1st: formData.yearConcession1st,
//     yearConcession2nd: formData.yearConcession2nd,
//     yearConcession3rd: formData.yearConcession3rd,
//     classId: formData.classId,
//     joiningClass: formData.joiningClass,
//     joinInto: formData.joinInto,
//     joiningClassName: formData.joiningClassName
//   });
  
//   // Use actualClassName for the mapping
//   const finalClassName = actualClassName || joiningClassName;
//   const finalClassLower = finalClassName.toLowerCase();
  
//   // Debug: Check all class conditions
//   console.log("🔍 Debugging class conditions:");
//   console.log("  - finalClassName:", `"${finalClassName}"`);
//   console.log("  - finalClassLower:", `"${finalClassLower}"`);
//   console.log("  - includes('6th'):", finalClassLower.includes('6th'));
//   console.log("  - includes('6th class'):", finalClassLower.includes('6th class'));
//   console.log("  - includes('9th'):", finalClassLower.includes('9th'));
//   console.log("  - includes('9th class'):", finalClassLower.includes('9th class'));
//   console.log("  - includes('2nd'):", finalClassLower.includes('2nd'));
//   console.log("  - includes('2nd class'):", finalClassLower.includes('2nd class'));
  
//   // Class ID mapping based on the image provided
//   const classIdMapping = {
//     '1st year': 1, '2nd year': 2, '3rd year': 3,
//     'nursery': 7, 'lkg': 8, 'ukg': 9,
//     '1st class': 10, '2nd class': 11, '3rd class': 12, '4th class': 13, '5th class': 14,
//     '6th class': 15, '7th class': 16, '8th class': 17, '9th class': 18, '10th class': 19
//   };
  
//   // Get concession field mapping based on joining class
//   const getConcessionFieldMapping = (joiningClassName) => {
//     const classLower = joiningClassName?.toLowerCase() || '';
    
//     console.log("🔍 getConcessionFieldMapping called with:", {
//       joiningClassName,
//       classLower,
//       length: joiningClassName?.length
//     });
    
//     // For 6th class: Show 6th, 7th, 8th concessions
//     if (classLower.includes('6th') || classLower.includes('6th class')) {
//       console.log("✅ Matched 6th class condition - returning IDs 16, 17, 18");
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '6th Concession', concTypeId: 15 },
//           { name: 'yearConcession2nd', label: '7th Concession', concTypeId: 16 },
//           { name: 'yearConcession3rd', label: '8th Concession', concTypeId: 17 }
//         ]
//       };
//     }
//     // For 7th class: Show 7th, 8th, 9th concessions
//     else if (classLower.includes('7th') || classLower.includes('7th class')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '7th Concession', concTypeId: 16 },
//           { name: 'yearConcession2nd', label: '8th Concession', concTypeId: 17 },
//           { name: 'yearConcession3rd', label: '9th Concession', concTypeId: 18 }
//         ]
//       };
//     }
//     // For 8th class: Show 8th, 9th, 10th concessions
//     else if (classLower.includes('8th') || classLower.includes('8th class')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '8th Concession', concTypeId: 17 },
//           { name: 'yearConcession2nd', label: '9th Concession', concTypeId: 18 },
//           { name: 'yearConcession3rd', label: '10th Concession', concTypeId: 19 }
//         ]
//       };
//     }
//     // For 9th class: Show 9th, 10th, 1st year concessions
//     else if (classLower.includes('9th') || classLower.includes('9th class')) {
//       console.log("✅ Matched 9th class condition - returning IDs 18, 19, 1");
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '9th Concession', concTypeId: 18 },
//           { name: 'yearConcession2nd', label: '10th Concession', concTypeId: 19 },
//           { name: 'yearConcession3rd', label: '1st Year Concession', concTypeId: 1 }
//         ]
//       };
//     }
//     // For 10th class: Show 10th, 1st year, 2nd year concessions
//     else if (classLower.includes('10th') || classLower.includes('10th class')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '10th Concession', concTypeId: 19 },
//           { name: 'yearConcession2nd', label: '1st Year Concession', concTypeId: 1 },
//           { name: 'yearConcession3rd', label: '2nd Year Concession', concTypeId: 2 }
//         ]
//       };
//     }
//     // For 5th class: Show 5th, 6th, 7th concessions
//     else if (classLower.includes('5th') || classLower.includes('5th class')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '5th Concession', concTypeId: 14 },
//           { name: 'yearConcession2nd', label: '6th Concession', concTypeId: 15 },
//           { name: 'yearConcession3rd', label: '7th Concession', concTypeId: 16 }
//         ]
//       };
//     }
//     // For 4th class: Show 4th, 5th, 6th concessions
//     else if (classLower.includes('4th') || classLower.includes('4th class')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '4th Concession', concTypeId: 13 },
//           { name: 'yearConcession2nd', label: '5th Concession', concTypeId: 14 },
//           { name: 'yearConcession3rd', label: '6th Concession', concTypeId: 15 }
//         ]
//       };
//     }
//     // For 3rd class: Show 3rd, 4th, 5th concessions
//     else if (classLower.includes('3rd') || classLower.includes('3rd class')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '3rd Concession', concTypeId: 12 },
//           { name: 'yearConcession2nd', label: '4th Concession', concTypeId: 13 },
//           { name: 'yearConcession3rd', label: '5th Concession', concTypeId: 14 }
//         ]
//       };
//     }
//     // For 2nd class: Show 2nd, 3rd, 4th concessions
//     else if (classLower.includes('2nd') || classLower.includes('2nd class')) {
//       console.log("✅ Matched 2nd class condition - returning IDs 12, 13, 14");
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '2nd Concession', concTypeId: 11 },
//           { name: 'yearConcession2nd', label: '3rd Concession', concTypeId: 12 },
//           { name: 'yearConcession3rd', label: '4th Concession', concTypeId: 13 }
//         ]
//       };
//     }
//     // For 1st class: Show 1st, 2nd, 3rd concessions
//     else if (classLower.includes('1st') || classLower.includes('1st class')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '1st Concession', concTypeId: 10 },
//           { name: 'yearConcession2nd', label: '2nd Concession', concTypeId: 11 },
//           { name: 'yearConcession3rd', label: '3rd Concession', concTypeId: 12 }
//         ]
//       };
//     }
//     // For UKG: Show UKG, 1st, 2nd concessions
//     else if (classLower.includes('ukg')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: 'UKG Concession', concTypeId: 9 },
//           { name: 'yearConcession2nd', label: '1st Concession', concTypeId: 10 },
//           { name: 'yearConcession3rd', label: '2nd Concession', concTypeId: 11 }
//         ]
//       };
//     }
//     // For LKG: Show LKG, UKG, 1st concessions
//     else if (classLower.includes('lkg')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: 'LKG Concession', concTypeId: 8 },
//           { name: 'yearConcession2nd', label: 'UKG Concession', concTypeId: 9 },
//           { name: 'yearConcession3rd', label: '1st Concession', concTypeId: 10 }
//         ]
//       };
//     }
//     // For Nursery: Show Nursery, LKG, UKG concessions
//     else if (classLower.includes('nursery')) {
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: 'Nursery Concession', concTypeId: 7 },
//           { name: 'yearConcession2nd', label: 'LKG Concession', concTypeId: 8 },
//           { name: 'yearConcession3rd', label: 'UKG Concession', concTypeId: 9 }
//         ]
//       };
//     }
//     // Default fallback for other cases (like degree courses)
//     else {
//       console.log("⚠️ Using default fallback - returning IDs 1, 2, 3");
//       console.log("⚠️ This means no class condition was matched for:", classLower);
//       return {
//         fields: [
//           { name: 'yearConcession1st', label: '1st Year Concession', concTypeId: 1 },
//           { name: 'yearConcession2nd', label: '2nd Year Concession', concTypeId: 2 },
//           { name: 'yearConcession3rd', label: '3rd Year Concession', concTypeId: 3 }
//         ]
//       };
//     }
//   };
  
//   const mapping = getConcessionFieldMapping(finalClassName);
//   const concessions = [];
  
//   console.log("🎯 Selected mapping for class:", finalClassName, "→", mapping);
//   console.log("🎯 Mapping fields:", mapping.fields);
//   console.log("🎯 First field concTypeId:", mapping.fields[0]?.concTypeId);
  
//   // Build concessions array with correct IDs
//   mapping.fields.forEach((field, index) => {
//     const amount = formData[field.name];
//     console.log(`🔍 Processing field ${field.name}:`, {
//       amount,
//       parsedAmount: safeParseFloat(amount),
//       concTypeId: field.concTypeId,
//       label: field.label
//     });
    
//     if (amount && safeParseFloat(amount) > 0) {
//       const concession = {
//         concTypeId: field.concTypeId,
//         amount: safeParseFloat(amount)
//       };
//       concessions.push(concession);
//       console.log("✅ Added concession:", concession);
//     } else {
//       console.log("❌ Skipped concession (no amount or amount <= 0):", field.name, amount);
//     }
//   });
  
//   console.log("🎯 Final generated concessions:", concessions);
//   console.log("🎯 Returning concessions with IDs:", concessions.map(c => c.concTypeId));
//   console.log("🎯 Expected for classId 19 should be: [17, 18, 19]");
//   console.log("🎯 Actual returned IDs:", concessions.map(c => c.concTypeId));
  
//   return concessions;
// };

// const combinedValidationSchema = Yup.object().shape({
//   ...(generalInfoValidationSchema?.fields || {}),
//   ...(ConcessionInfoSection.validationSchema?.fields || {}),
//   ...(AddressInfoSection.validationSchema?.fields || {}),
//   ...(PaymentInfoSection.validationSchema?.fields || {}),
// });

// const ApplicationStatusForm = ({ onBack, initialData = {} }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const locationInitialValues = (location && location.state && location.state.initialValues) ? location.state.initialValues : {};
 
//   // Debug logging for location state
//   console.log("📍 Location state data:", {
//     hasLocation: !!location,
//     hasState: !!(location && location.state),
//     hasInitialValues: !!(location && location.state && location.state.initialValues),
//     locationInitialValues: locationInitialValues
//   });
//   const { applicationNo, status } = useParams();
//   const [activeStep, setActiveStep] = useState(0);
//   const [activeConfirmationStep, setActiveConfirmationStep] = useState(0);
//   const [selectedStatus, setSelectedStatus] = useState(status ? status.charAt(0).toUpperCase() + status.slice(1) : "");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successStatusType, setSuccessStatusType] = useState("sale");
//   const [couponDetails, setCouponDetails] = useState({ mobile: "", code: "" });
//   const [saleData, setSaleData] = useState(null);
//   const [persistentData, setPersistentData] = useState({ campus: "", zone: "" });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [applicationData, setApplicationData] = useState(null);

//   // Set selectedStatus from URL parameter
//   useEffect(() => {
//     if (status) {
//       const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
//       setSelectedStatus(capitalizedStatus);
//       console.log("🔍 Setting selectedStatus from URL:", capitalizedStatus);
//     }
//   }, [status]);

//   const steps = [
//     "General Information",
//     "Concession Information",
//     "Address Information",
//     "Payment Information",
//   ];

//   // Field mapping from current names to Swagger API response names
//   const fieldMapping = {
//     // Basic student information
//     'studentName': 'studentName',
//     'surname': 'surname',
//     'htNo': 'htNo',
//     'aadhaar': 'aadharCardNo',
//     'applicationNo': 'studAdmsNo',
//     'dob': 'dob',
//     'gender': 'genderId',
//     'appType': 'appTypeId',
//     'studentType': 'studentTypeId',
//     'admissionReferredBy': 'admissionReferredBy',
//     'scoreAppNo': 'scoreAppNo',
//     'marks': 'marks',
//     'orientationDate': 'orientationDate',
//     'appSaleDate': 'appSaleDate',
//     'orientationFee': 'orientationFee',
//     'joinedCampus': 'campusId',
//     'course': 'orientationId',
//     'courseBatch': 'orientationBatchId',
//     'courseDates': 'orientationDate',
//     'fee': 'orientationFee',
//     'schoolType': 'preschoolTypeId',
//     'schoolName': 'schoolName',
//     'schoolState': 'preSchoolStateId',
//     'schoolDistrict': 'preSchoolDistrictId',
//     'schoolTypeId': 'schoolTypeId',
//     'preschoolTypeId': 'preschoolTypeId',
//     'religion': 'religionId',
//     'caste': 'casteId',
//     'bloodGroup': 'bloodGroupId',
//     'section': 'sectionId',
//     'quota': 'quotaId',
//     'status': 'statusId',
//     'classId': 'classId',
//     'createdBy': 'createdBy',
//     'dateOfJoin': 'dateOfJoin',
   
//     // Parent information
//     'fatherName': 'parents[0].name',
//     'fatherOccupation': 'parents[0].occupation',
//     'fatherPhoneNumber': 'parents[0].mobileNo',
//     'fatherEmail': 'parents[0].email',
//     'motherName': 'parents[1].name',
//     'motherOccupation': 'parents[1].occupation',
//     'motherPhoneNumber': 'parents[1].mobileNo',
//     'motherEmail': 'parents[1].email',
//     'relationType': 'parents[0].relationTypeId', // Father relation type
   
//     // Address information
//     'doorNo': 'addressDetails.doorNo',
//     'street': 'addressDetails.street',
//     'landmark': 'addressDetails.landmark',
//     'area': 'addressDetails.area',
//     'addressCity': 'addressDetails.cityId',
//     'mandal': 'addressDetails.mandalId',
//     'district': 'addressDetails.districtId',
//     'pincode': 'addressDetails.pincode',
//     'state': 'addressDetails.stateId',
   
//     // Sibling information
//     'siblingInformation': 'siblings',
//     'fullName': 'siblings[].fullName',
//     'schoolName': 'siblings[].schoolName',
//     'classId': 'siblings[].classId',
//     'relationTypeId': 'siblings[].relationTypeId',
//     'genderId': 'siblings[].genderId',
   
//     // Payment information
//     'appFeeAmount': 'paymentDetails.applicationFeeAmount',
//     'appFeeReceiptNo': 'paymentDetails.prePrintedReceiptNo',
//     'appFeePayDate': 'paymentDetails.applicationFeeDate',
//     'concessionAmount': 'paymentDetails.concessionAmount',
//     'payMode': 'paymentDetails.paymentModeId',
//     'chequeDdNo': 'paymentDetails.chequeDdNo',
//     'ifscCode': 'paymentDetails.ifscCode',
//     'chequeDdDate': 'paymentDetails.chequeDdDate',
//     'organizationId': 'paymentDetails.organizationId',
//     'orgBankId': 'paymentDetails.orgBankId',
//     'orgBankBranchId': 'paymentDetails.orgBankBranchId',
   
//     // Concession information
//     'concessionIssuedBy': 'studentConcessionDetails.concessionIssuedBy',
//     'concessionAuthorisedBy': 'studentConcessionDetails.concessionAuthorisedBy',
//     'description': 'studentConcessionDetails.description',
//     'concessionReasonId': 'studentConcessionDetails.concessionReasonId',
//     'yearConcession1st': 'studentConcessionDetails.concessions[0].amount',
//     'yearConcession2nd': 'studentConcessionDetails.concessions[1].amount',
//     'yearConcession3rd': 'studentConcessionDetails.concessions[2].amount',
//     'concessions': 'studentConcessionDetails.concessions',
   
//     // PRO concession
//     'proConcessionAmount': 'proConcessionDetails.concessionAmount',
//     'proReason': 'proConcessionDetails.reason',
//     'proEmployeeId': 'proConcessionDetails.proEmployeeId'
//   };

//   const defaultInitialValues = {
//     siblingInformation: [],
//     status: "",
//     additionalCourseFee: "",
//     scoreAppNo: "",
//     marks: "",
//     camp: "",
//     admissionReferredBy: "",
//     category: 1,
//     htNo: "",
//     aadhaar: "",
//     appType: "",
//     appFee: "",
//     applicationFee: "500",
//     surname: "",
//     studentName: "",
//     fatherName: "",
//     occupation: "",
//     phoneNumber: "",
//     studentType: "",
//     dob: "",
//     gender: "",
//     joinedCampus: "",
//     city: "",
//     joinInto: "",
//     course: "",
//     courseBatch: "",
//     courseDates: "",
//     fee: "",
//     schoolState: "",
//     schoolDistrict: "",
//     schoolType: "",
//     schoolName: "",
//     totalFee: "",
//     yearConcession1st: "",
//     yearConcession2nd: "",
//     yearConcession3rd: "",
//     givenBy: "",
//     givenById: "",
//     description: "",
//     authorizedBy: "",
//     authorizedById: "",
//     reason: "",
//     concessionReasonId: "",
//     concessionWritten: "",
//     couponMobile: "",
//     couponCode: "",
//     doorNo: "",
//     street: "",
//     landmark: "",
//     area: "",
//     addressCity: "",
//     district: "",
//     mandal: "",
//     pincode: "",
//     payMode: 1,
//     paymentDate: null,
//     amount: "",
//     receiptNumber: "",
//     appFeeReceived: false,
//     appFeePayMode: 1,
//     appFeePayDate: null,
//     appFeeAmount: "",
//     appFeeReceiptNo: "",
//     applicationNo: initialData.applicationNo || applicationNo || "257000006",
//     zoneName: "",
//     campusName: "",
//     dgmName: "",
//     quota: "",
//     foodprefrence: "",
//     mobileNumber: "",
//     coupon: "",
//     section: "", // Added section
//     mainDdPayDate: null,
//     mainDdAmount: "",
//     mainDdReceiptNumber: "",
//     mainDdOrganisationName: "",
//     mainDdNumber: "",
//     mainDdCityName: "",
//     mainDdBankName: "",
//     mainDdBranchName: "",
//     mainDdIfscCode: "",
//     mainDdDate: null,
//     mainChequePayDate: null,
//     mainChequeAmount: "",
//     mainChequeReceiptNumber: "",
//     mainChequeOrganisationName: "",
//     mainChequeNumber: "",
//     mainChequeCityName: "",
//     mainChequeBankName: "",
//     mainChequeBranchName: "",
//     mainChequeIfscCode: "",
//     mainChequeDate: null,
//     feeDdPayDate: null,
//     feeDdAmount: "",
//     feeDdReceiptNumber: "",
//     feeDdOrganisationName: "",
//     feeDdNumber: "",
//     feeDdCityName: "",
//     feeDdBankName: "",
//     feeDdBranchName: "",
//     feeDdIfscCode: "",
//     feeDdDate: null,
//     feeChequePayDate: null,
//     feeChequeAmount: "",
//     feeChequeReceiptNumber: "",
//     feeChequeOrganisationName: "",
//     feeChequeNumber: "",
//     feeChequeCityName: "",
//     feeChequeBankName: "",
//     feeChequeBranchName: "",
//     feeChequeIfscCode: "",
//     feeChequeDate: null,
//     // Hidden/system fields
//     // proId: 4095,
//     statusId: 2,
//     createdBy: 2,
//   };

//   // Function to transform form data to Swagger API response structure
//   const transformFormDataToApiFormat = (formData) => {
//     // Helper function to safely parse integers with fallback
//     const safeParseInt = (value, fallback = 0) => {
//       if (!value || value === "" || value === null || value === undefined) return fallback;
//       const parsed = parseInt(value);
//       return isNaN(parsed) ? fallback : parsed;
//     };


//     const apiData = {
//       studAdmsNo: formData.applicationNo || formData.htNo || "",
//       studentName: formData.studentName || formData.firstName || "",
//       surname: formData.surname || "",
//       htNo: formData.htNo || "",
//       apaarNo: formData.aapar || "",
//       dateOfJoin: formData.dateOfJoin || new Date().toISOString().split('T')[0],
//       createdBy: formData.createdBy || 2,
//       aadharCardNo: safeParseInt(formData.aadhaar),
//       dob: formData.dob || "",
//       religionId: safeParseInt(formData.religion) || 1,
//       casteId: safeParseInt(formData.caste) || 1,
//       schoolTypeId: safeParseInt(formData.schoolTypeId) || 1,
//       schoolName: formData.schoolName || "",
//       preSchoolStateId: safeParseInt(formData.schoolState) || 1,
//       preSchoolDistrictId: safeParseInt(formData.schoolDistrict) || 1,
//       preschoolTypeId: safeParseInt(formData.schoolType) || safeParseInt(formData.preschoolTypeId) || safeParseInt(formData.preschoolType) || 1,
//       admissionReferredBy: formData.admissionReferredBy || "",
//       scoreAppNo: formData.scoreAppNo || "",
//       marks: safeParseInt(formData.marks),
//       orientationDate: formData.orientationDates || formData.courseDates || "",
//       appSaleDate: formData.appSaleDate || new Date().toISOString(),
//       orientationFee: safeParseFloat(formData.OrientationFee) || safeParseFloat(formData.orientationFee) || safeParseFloat(formData.fee),
//       genderId: safeParseInt(formData.gender) || 1,
//       appTypeId: safeParseInt(formData.admissionType) || safeParseInt(formData.appType) || 1,
//       studentTypeId: safeParseInt(formData.studentType) || 1,
//       studyTypeId: safeParseInt(formData.batchType) || safeParseInt(formData.studyType) || 1,
//       orientationId: safeParseInt(formData.orientationName) || safeParseInt(formData.course) || 1,
//       sectionId: safeParseInt(formData.section) || 1,
//       quotaId: safeParseInt(formData.quota) || 1,
//       statusId: safeParseInt(formData.status) || 2,
//       classId: safeParseInt(formData.joiningClassName) || safeParseInt(formData.classId) || 1,
//       campusId: safeParseInt(formData.joinedCampus) || 1,
//       orientationBatchId: safeParseInt(formData.orientationBatch) || safeParseInt(formData.courseBatch) || 1,
//       bloodGroupId: safeParseInt(formData.bloodGroup) || 1,
//       parents: [
//         {
//           name: formData.fatherName || "",
//           relationTypeId: 1, // Father relation type ID
//           occupation: formData.fatherOccupation || "",
//           mobileNo: safeParseInt(formData.fatherPhoneNumber),
//           email: formData.fatherEmail || ""
//         },
//         {
//           name: formData.motherName || "",
//           relationTypeId: 2, // Mother relation type ID
//           occupation: formData.motherOccupation || "",
//           mobileNo: safeParseInt(formData.motherPhoneNumber),
//           email: formData.motherEmail || ""
//         }
//       ],
//       addressDetails: {
//         doorNo: formData.doorNo || "",
//         street: formData.street || "",
//         landmark: formData.landmark || "",
//         area: formData.area || "",
//         cityId: safeParseInt(formData.addressCity) || safeParseInt(formData.city) || 1,
//         mandalId: safeParseInt(formData.mandal) || 1,
//         districtId: safeParseInt(formData.district) || 1,
//         pincode: safeParseInt(formData.pincode) || 500001,
//         stateId: safeParseInt(formData.state) || safeParseInt(formData.stateId) || 1,
//         createdBy: formData.createdBy || 2
//       },
//       siblings: (() => {
//         console.log("🔍 Original siblingInformation:", formData.siblingInformation);
//         console.log("🔍 Sibling class values:", formData.siblingInformation?.map((s, i) => ({
//           index: i,
//           class: s.class,
//           classId: s.classId,
//           fullName: s.fullName,
//           relationType: s.relationType,
//           gender: s.gender
//         })));
       
//         // Debug dropdown options availability
//         console.log("🔍 Dropdown options check:", {
//           hasDropdownOptions: !!formData.dropdownOptions,
//           hasAllStudentClasses: !!formData.dropdownOptions?.allStudentClasses,
//           allStudentClassesLength: formData.dropdownOptions?.allStudentClasses?.length || 0,
//           allStudentClasses: formData.dropdownOptions?.allStudentClasses?.slice(0, 3) || [],
//           formDataKeys: Object.keys(formData).filter(key => key.includes('dropdown') || key.includes('Options'))
//         });
       
//         const filteredSiblings = (formData.siblingInformation || [])
//           .filter(sibling => {
//             // Check if sibling object exists and has required fields
//             if (!sibling || typeof sibling !== 'object') {
//               console.log(`🔍 Filtering out invalid sibling object:`, sibling);
//               return false;
//             }
           
//             // Only include siblings that have at least a name filled
//             const hasName = sibling.fullName && sibling.fullName.trim() !== "";
//             console.log(`🔍 Filtering sibling:`, { sibling, hasName });
//             return hasName;
//           });
       
//         console.log("🔍 Filtered siblings:", filteredSiblings);
       
//         const transformedSiblings = filteredSiblings.map((sibling, index) => {
//           // Additional validation to ensure required fields are present
//           if (!sibling.fullName || sibling.fullName.trim() === "") {
//             console.warn(`⚠️ Skipping sibling ${index} - no name provided:`, sibling);
//             return null;
//           }
         
//           // Try to get a valid class ID from dropdown options if sibling.class is not available
//           let classId = safeParseInt(sibling.class) || safeParseInt(sibling.classId);
//           if (!classId && formData.dropdownOptions?.allStudentClasses?.length > 0) {
//             // Use the first available class as fallback instead of hardcoded 1
//             classId = formData.dropdownOptions.allStudentClasses[0].id;
//             console.log(`🔍 Using fallback class ID from dropdown options: ${classId}`);
//           }
//           if (!classId) {
//             classId = 1; // Final fallback
//             console.log(`🔍 Using hardcoded fallback class ID: ${classId}`);
//           }
         
//           const transformedSibling = {
//             fullName: sibling.fullName.trim(),
//             schoolName: sibling.schoolName?.trim() || "",
//             classId: classId,
//             relationTypeId: sibling.relationType || sibling.relationTypeId || 1,
//             genderId: safeParseInt(sibling.gender) || safeParseInt(sibling.genderId) || 1,
//             createdBy: formData.createdBy || 2
//           };
         
//           // Debug logging for class ID
//           console.log(`🔍 Sibling ${index} class mapping:`, {
//             originalClass: sibling.class,
//             originalClassId: sibling.classId,
//             parsedClassId: safeParseInt(sibling.class),
//             finalClassId: transformedSibling.classId,
//             isClassEmpty: !sibling.class || sibling.class === "",
//             isClassIdEmpty: !sibling.classId || sibling.classId === "",
//             classType: typeof sibling.class,
//             classIdType: typeof sibling.classId,
//             siblingObject: sibling
//           });
         
//           // Debug logging for sibling transformation
//           console.log(`🔍 Sibling ${index} transformation:`, {
//             original: sibling,
//             transformed: transformedSibling
//           });
         
//           return transformedSibling;
//         }).filter(sibling => sibling !== null); // Remove any null entries
       
//         console.log("🔍 Final transformed siblings:", transformedSiblings);
       
//         // Final safety check - ensure no empty or invalid siblings are sent
//         const finalSiblings = transformedSiblings.filter(sibling => {
//           const isValid = sibling &&
//                          sibling.fullName &&
//                          sibling.fullName.trim() !== "" &&
//                          sibling.genderId &&
//                          sibling.classId &&
//                          sibling.relationTypeId;
         
//           if (!isValid) {
//             console.warn("🔍 Removing invalid sibling from final array:", sibling);
//           }
         
//           return isValid;
//         });
       
//         console.log("🔍 Final validated siblings:", finalSiblings);
//         console.log("🔍 Final siblings JSON:", JSON.stringify(finalSiblings, null, 2));
       
//         // If no valid siblings, return empty array to avoid sending empty objects
//         if (finalSiblings.length === 0) {
//           console.log("🔍 No valid siblings found, sending empty array");
//           return [];
//         }
       
//         // Additional validation - ensure each sibling has all required fields
//         const validatedSiblings = finalSiblings.map((sibling, index) => {
//           const validated = {
//             fullName: String(sibling.fullName || "").trim(),
//             schoolName: String(sibling.schoolName || "").trim(),
//             classId: Number(sibling.classId) || 1,
//             relationTypeId: Number(sibling.relationTypeId) || 1,
//             genderId: Number(sibling.genderId) || 1,
//             createdBy: Number(sibling.createdBy) || 2
//           };
         
//           console.log(`🔍 Validated sibling ${index}:`, validated);
//           return validated;
//         });
       
//         console.log("🔍 Final validated siblings for backend:", validatedSiblings);
       
//         // Additional check - ensure we're not sending empty arrays
//         if (validatedSiblings.length === 0) {
//           console.log("🔍 No siblings to send, returning empty array");
//           return [];
//         }
       
//         // Log each sibling individually to ensure they're valid
//         validatedSiblings.forEach((sibling, index) => {
//           console.log(`🔍 Sibling ${index} validation:`, {
//             hasName: !!sibling.fullName,
//             hasSchool: !!sibling.schoolName,
//             hasClassId: !!sibling.classId,
//             hasGenderId: !!sibling.genderId,
//             hasRelationType: !!sibling.relationTypeId,
//             sibling: sibling
//           });
//         });
       
//         return validatedSiblings;
//       })(),
//       studentConcessionDetails: {
//         concessionIssuedBy: safeParseInt(formData.givenById) || safeParseInt(formData.concessionIssuedBy) || 1,
//         concessionAuthorisedBy: safeParseInt(formData.authorizedById) || safeParseInt(formData.concessionAuthorisedBy) || 1,
//         description: formData.reason || formData.description || "",
//         concessionReasonId: safeParseInt(formData.concessionReasonId) || 1,
//         created_by: formData.createdBy || 2,
//         concessions: (() => {
//           console.log("🔍🔍🔍 About to call getConcessionData! 🔍🔍🔍");
//           console.log("🔍 FormData classId:", formData.classId);
//           const concessions = getConcessionData(formData);
//           console.log("🔍 Final concessions being used:", concessions);
//           console.log("🔍 Concessions length:", concessions.length);
//           if (concessions.length === 0) {
//             console.log("⚠️ WARNING: No concessions found! Using fallback.");
//             // Fallback to default concessions if none found
//             return [
//               ...(formData.yearConcession1st && safeParseFloat(formData.yearConcession1st) > 0 ? [{
//                 concTypeId: 1,
//                 amount: safeParseFloat(formData.yearConcession1st)
//               }] : []),
//               ...(formData.yearConcession2nd && safeParseFloat(formData.yearConcession2nd) > 0 ? [{
//                 concTypeId: 2,
//                 amount: safeParseFloat(formData.yearConcession2nd)
//               }] : []),
//               ...(formData.yearConcession3rd && safeParseFloat(formData.yearConcession3rd) > 0 ? [{
//                 concTypeId: 3,
//                 amount: safeParseFloat(formData.yearConcession3rd)
//               }] : [])
//             ];
//           }
//           return concessions;
//         })()
//       },
//       proConcessionDetails: {
//         concessionAmount: safeParseFloat(formData.proConcessionAmount),
//         reason: formData.proReason || formData.reason || "",
//         proEmployeeId: safeParseInt(formData.proEmployeeId) || safeParseInt(formData.authorizedById) || 1,
//         created_by: formData.createdBy || 2
//       },
//       paymentDetails: {
//         applicationFeeAmount: safeParseFloat(formData.applicationFee) || safeParseFloat(formData.amount) || safeParseFloat(formData.appFeeAmount),
//         prePrintedReceiptNo: formData.receiptNumber || formData.appFeeReceiptNo || "",
//         applicationFeeDate: formData.paymentDate || formData.appFeePayDate || new Date().toISOString(),
//         concessionAmount: safeParseFloat(formData.yearConcession1st) + safeParseFloat(formData.yearConcession2nd) + safeParseFloat(formData.yearConcession3rd),
//         paymentModeId: safeParseInt(formData.payMode) || 1,
//         chequeDdNo: formData.mainDdNumber || formData.mainChequeNumber || "",
//         ifscCode: formData.mainDdIfscCode || formData.mainChequeIfscCode || "",
//         chequeDdDate: formData.paymentDate || formData.mainDdDate || formData.mainChequeDate || "",
//         cityId: safeParseInt(formData.mainDdCityName) || safeParseInt(formData.mainChequeCityName) || safeParseInt(formData.addressCity) || 1,
//         orgBankId: safeParseInt(formData.mainDdBankName) || safeParseInt(formData.mainChequeBankName) || 1,
//         orgBankBranchId: safeParseInt(formData.mainDdBranchName) || safeParseInt(formData.mainChequeBranchName) || 1,
//         organizationId: safeParseInt(formData.mainDdOrganisationName) || safeParseInt(formData.mainChequeOrganisationName) || 1,
//         created_by: formData.createdBy || 2
//       }
//     };

//     console.log("🔄 Transformed form data to API format:", apiData);
   
//     // Display formatted object in console UI
//     console.log("📋 ===== API OBJECT STRUCTURE =====");
//     console.log(JSON.stringify(apiData, null, 2));
//     console.log("📋 ===== END API OBJECT =====");
   
//     // Display detailed object structure
//     console.log("🔍 ===== DETAILED API OBJECT =====");
//     console.log("📝 Basic Information:");
//     console.log(`  studAdmsNo: "${apiData.studAdmsNo}"`);
//     console.log(`  studentName: "${apiData.studentName}"`);
//     console.log(`  surname: "${apiData.surname}"`);
//     console.log(`  htNo: "${apiData.htNo}"`);
//     console.log(`  apaarNo: "${apiData.apaarNo}"`);
//     console.log(`  dateOfJoin: "${apiData.dateOfJoin}"`);
//     console.log(`  createdBy: ${apiData.createdBy}`);
//     console.log(`  aadharCardNo: ${apiData.aadharCardNo}`);
//     console.log(`  dob: "${apiData.dob}"`);
   
//     console.log("📝 Academic Information:");
//     console.log(`  religionId: ${apiData.religionId}`);
//     console.log(`  casteId: ${apiData.casteId}`);
//     console.log(`  schoolTypeId: ${apiData.schoolTypeId}`);
//     console.log(`  schoolName: "${apiData.schoolName}"`);
//     console.log(`  preSchoolStateId: ${apiData.preSchoolStateId}`);
//     console.log(`  preSchoolDistrictId: ${apiData.preSchoolDistrictId}`);
//     console.log(`  preschoolTypeId: ${apiData.preschoolTypeId} (from schoolType dropdown)`);
//     console.log(`  admissionReferredBy: "${apiData.admissionReferredBy}"`);
//     console.log(`  scoreAppNo: "${apiData.scoreAppNo}"`);
//     console.log(`  marks: ${apiData.marks}`);
   
//     console.log("📝 Orientation Information:");
//     console.log(`  orientationDate: "${apiData.orientationDate}"`);
//     console.log(`  appSaleDate: "${apiData.appSaleDate}"`);
//     console.log(`  orientationFee: ${apiData.orientationFee}`);
//     console.log(`  genderId: ${apiData.genderId}`);
//     console.log(`  appTypeId: ${apiData.appTypeId}`);
//     console.log(`  studentTypeId: ${apiData.studentTypeId}`);
//     console.log(`  studyTypeId: ${apiData.studyTypeId}`);
//     console.log(`  orientationId: ${apiData.orientationId}`);
//     console.log(`  sectionId: ${apiData.sectionId}`);
//     console.log(`  quotaId: ${apiData.quotaId}`);
//     console.log(`  statusId: ${apiData.statusId}`);
//     console.log(`  classId: ${apiData.classId}`);
//     console.log(`  campusId: ${apiData.campusId}`);
//     console.log(`  orientationBatchId: ${apiData.orientationBatchId}`);
//     console.log(`  bloodGroupId: ${apiData.bloodGroupId}`);
   
//     console.log("👨‍👩‍👧‍👦 Parents Information:");
//     apiData.parents.forEach((parent, index) => {
//       console.log(`  Parent ${index + 1}:`);
//       console.log(`    name: "${parent.name}"`);
//       console.log(`    relationTypeId: ${parent.relationTypeId}`);
//       console.log(`    occupation: "${parent.occupation}"`);
//       console.log(`    mobileNo: ${parent.mobileNo}`);
//       console.log(`    email: "${parent.email}"`);
//     });
   
//     console.log("🏠 Address Details:");
//     console.log(`  doorNo: "${apiData.addressDetails.doorNo}"`);
//     console.log(`  street: "${apiData.addressDetails.street}"`);
//     console.log(`  landmark: "${apiData.addressDetails.landmark}"`);
//     console.log(`  area: "${apiData.addressDetails.area}"`);
//     console.log(`  cityId: ${apiData.addressDetails.cityId}`);
//     console.log(`  mandalId: ${apiData.addressDetails.mandalId}`);
//     console.log(`  districtId: ${apiData.addressDetails.districtId}`);
//     console.log(`  pincode: ${apiData.addressDetails.pincode}`);
//     console.log(`  stateId: ${apiData.addressDetails.stateId}`);
//     console.log(`  createdBy: ${apiData.addressDetails.createdBy}`);
   
//     console.log("👶 Siblings Information:");
//     apiData.siblings.forEach((sibling, index) => {
//       console.log(`  Sibling ${index + 1}:`);
//       console.log(`    fullName: "${sibling.fullName}"`);
//       console.log(`    schoolName: "${sibling.schoolName}"`);
//       console.log(`    classId: ${sibling.classId}`);
//       console.log(`    relationTypeId: ${sibling.relationTypeId}`);
//       console.log(`    genderId: ${sibling.genderId}`);
//       console.log(`    createdBy: ${sibling.createdBy}`);
//     });
   
//     console.log("💰 Student Concession Details:");
//     console.log(`  concessionIssuedBy: ${apiData.studentConcessionDetails.concessionIssuedBy}`);
//     console.log(`  concessionAuthorisedBy: ${apiData.studentConcessionDetails.concessionAuthorisedBy}`);
//     console.log(`  description: "${apiData.studentConcessionDetails.description}"`);
//     console.log(`  concessionReasonId: ${apiData.studentConcessionDetails.concessionReasonId}`);
//     console.log(`  created_by: ${apiData.studentConcessionDetails.created_by}`);
//     console.log("  concessions:");
//     apiData.studentConcessionDetails.concessions.forEach((concession, index) => {
//       console.log(`    Concession ${index + 1}:`);
//       console.log(`      concTypeId: ${concession.concTypeId}`);
//       console.log(`      amount: ${concession.amount}`);
//     });
   
//     console.log("💼 PRO Concession Details:");
//     console.log(`  concessionAmount: ${apiData.proConcessionDetails.concessionAmount}`);
//     console.log(`  reason: "${apiData.proConcessionDetails.reason}"`);
//     console.log(`  proEmployeeId: ${apiData.proConcessionDetails.proEmployeeId}`);
//     console.log(`  created_by: ${apiData.proConcessionDetails.created_by}`);
   
//     console.log("💳 Payment Details:");
//     console.log(`  applicationFeeAmount: ${apiData.paymentDetails.applicationFeeAmount}`);
//     console.log(`  prePrintedReceiptNo: "${apiData.paymentDetails.prePrintedReceiptNo}"`);
//     console.log(`  applicationFeeDate: "${apiData.paymentDetails.applicationFeeDate}"`);
//     console.log(`  concessionAmount: ${apiData.paymentDetails.concessionAmount}`);
//     console.log(`  paymentModeId: ${apiData.paymentDetails.paymentModeId}`);
//     console.log(`  chequeDdNo: "${apiData.paymentDetails.chequeDdNo}"`);
//     console.log(`  ifscCode: "${apiData.paymentDetails.ifscCode}"`);
//     console.log(`  chequeDdDate: "${apiData.paymentDetails.chequeDdDate}"`);
//     console.log(`  cityId: ${apiData.paymentDetails.cityId}`);
//     console.log(`  orgBankId: ${apiData.paymentDetails.orgBankId}`);
//     console.log(`  orgBankBranchId: ${apiData.paymentDetails.orgBankBranchId}`);
//     console.log(`  organizationId: ${apiData.paymentDetails.organizationId}`);
//     console.log(`  created_by: ${apiData.paymentDetails.created_by}`);
   
//     console.log("🔍 ===== END DETAILED API OBJECT =====");
   
//     return apiData;
//   };

//   const initialValues = useMemo(
//     () => {
//       const values = {
//         ...defaultInitialValues,
//         ...locationInitialValues,
//         ...initialData,
//         ...applicationData, // Include fetched application data
//         htNo:
//           initialData.htNo ||
//           "",
//         joinedCampus:
//           applicationData?.campusName ||
//           (locationInitialValues && (locationInitialValues.campus || locationInitialValues.campusName)) ||
//           initialData.campus ||
//           initialData.joinedCampus ||
//           "",
//         campusName:
//           applicationData?.campusName ||
//           (locationInitialValues && (locationInitialValues.campus || locationInitialValues.campusName)) ||
//           initialData.campus ||
//           initialData.joinedCampus ||
//           "",
//         campus:
//           applicationData?.campusName ||
//           (locationInitialValues && (locationInitialValues.campus || locationInitialValues.campusName)) ||
//           initialData.campus ||
//           initialData.joinedCampus ||
//           "",
//         district:
//           applicationData?.zoneName ||
//           (locationInitialValues && (locationInitialValues.zone || locationInitialValues.zoneName)) ||
//           initialData.zone ||
//           initialData.district ||
//           "",
//         zoneName:
//           applicationData?.zoneName ||
//           (locationInitialValues && (locationInitialValues.zone || locationInitialValues.zoneName)) ||
//           initialData.zone ||
//           initialData.district ||
//           "",
//         zone:
//           applicationData?.zoneName ||
//           (locationInitialValues && (locationInitialValues.zone || locationInitialValues.zoneName)) ||
//           initialData.zone ||
//           initialData.district ||
//           "",
//       };
//       console.log("Initial values calculated:", {
//         applicationData,
//         locationInitialValues,
//         initialData,
//         calculatedValues: {
//           htNo: values.htNo,
//           joinedCampus: values.joinedCampus,
//           district: values.district,
//           campusName: values.campusName,
//           zoneName: values.zoneName
//         }
//       });
//       return values;
//     },
//     [initialData, locationInitialValues, applicationData]
//   );

//   useEffect(() => {
//     if (status) {
//       const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
//       if (["Sale", "Confirmation", "Damaged"].includes(normalized)) setSelectedStatus(normalized);
//     }
//   }, [status]);

//   // Clear application data when applicationNo changes to prevent stale data
//   useEffect(() => {
//     setApplicationData(null);
//   }, [applicationNo]);

//   // Fetch application data when applicationNo changes
//   useEffect(() => {
//     const fetchApplicationData = async () => {
//       if (applicationNo) {
//         console.log("🔄 Fetching application data for:", applicationNo);
//         try {
//           const data = await apiService.getApplicationDetails(applicationNo);
//           console.log("📥 Raw application data received:", data);
//           if (data) {
//             // Normalize the data to match our expected format
//             const normalizedData = {
//               applicationNo: data.applicationNo || data.application_no || applicationNo,
//               campusName: data.campusName || data.campus_name || data.campus || data.cmps_name || data.campusName || "",
//               zoneName: data.zoneName || data.zone_name || data.zone || data.zonal_name || data.zoneName || "",
//               studentName: data.studentName || data.student_name || data.name || "",
//               // Add other fields as needed
//             };
//             console.log("✅ Normalized application data:", normalizedData);
//             setApplicationData(normalizedData);
//           } else {
//             console.log("⚠️ No data received from API");
//             setApplicationData(null);
//           }
//         } catch (error) {
//           console.error("❌ Error fetching application data:", error);
//           setApplicationData(null);
//         }
//       } else {
//         console.log("⚠️ No applicationNo provided");
//         setApplicationData(null);
//       }
//     };

//     fetchApplicationData();
//   }, [applicationNo]);

//   const sectionValidationSchemas = useMemo(() => ({
//     0: generalInfoValidationSchema,
//     1: ConcessionInfoSection.validationSchema,
//     2: AddressInfoSection.validationSchema,
//     3: PaymentInfoSection.validationSchema,
//   }), []);

//   const currentValidationSchema = useMemo(
//     () => (selectedStatus === "Sale" ? sectionValidationSchemas[activeStep] : undefined),
//     [activeStep, selectedStatus, sectionValidationSchemas]
//   );

//   const handleNext = (values, setFieldValue, validateForm, setTouched) => {
//     console.log("🔍 handleNext called - validating form...");
//     validateForm().then((errors) => {
//       console.log("🔍 Validation errors:", errors);
//       console.log("🔍 Number of errors:", Object.keys(errors).length);
     
//       if (Object.keys(errors).length === 0) {
//         console.log("✅ No validation errors - proceeding to next step");
//         if (activeStep === 1) {
//           setFieldValue("couponMobile", couponDetails.mobile);
//           setFieldValue("couponCode", couponDetails.code);
//         }
//         if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
//       } else {
//         console.log("❌ Validation errors found - setting touched fields");
//         const touchedFields = {};
//         Object.keys(errors).forEach((field) => {
//           console.log(`🔍 Setting touched for field: ${field}`);
//           if (field === "joinedCampus") {
//             console.log("🎯 Found joinedCampus in errors:", errors[field]);
//           }
//           touchedFields[field] = true;
//           if (field.includes("siblingInformation")) {
//             const match = field.match(/siblingInformation\[(\d+)\]\.(\w+)/);
//             if (match) {
//               const [, index, subField] = match;
//               if (!touchedFields.siblingInformation) touchedFields.siblingInformation = [];
//               if (!touchedFields.siblingInformation[index]) touchedFields.siblingInformation[index] = {};
//               touchedFields.siblingInformation[index][subField] = true;
//             }
//           }
//         });
//         console.log("🔍 Touched fields to set:", touchedFields);
//         setTouched(touchedFields);
//       }
//     });
//   };

//   const handleBack = () => {
//     if (activeStep > 0) setActiveStep((prev) => prev - 1);
//     else navigate("/scopes/application/status");
//   };

//   const handleSubmit = async (values) => {
//     try {
//       if (isSubmitting) return;
//       setIsSubmitting(true);
//       console.log("All form values before submission:", values);

//       // Transform form data to match Swagger API response structure
//       const formData = transformFormDataToApiFormat(values);

//       console.log("Submitting form data:", formData);
//       await apiService.submitAdmissionForm(formData);
//       setSaleData(formData);
//       setSuccessStatusType("sale");
//       setShowSuccess(true);
//     } catch (error) {
//       console.error("Error submitting admission form:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCouponSubmit = (setFieldValue) => {
//     if (!/^\d{10}$/.test(String(couponDetails.mobile || ""))) {
//       return;
//     }
//     if (!couponDetails.code || String(couponDetails.code).trim() === "") {
//       return;
//     }
//     setFieldValue("couponMobile", couponDetails.mobile);
//     setFieldValue("couponCode", couponDetails.code);
//     setShowCouponModal(false);
//   };

//   const handleStepChange = (step) => {
//     if (step <= activeStep) setActiveStep(step);
//   };

//   const handleConfirmationSuccess = (confirmationValues) => {
//     setSuccessStatusType("confirmation");
//     setShowSuccess(true);
//   };

//   const getApplicationData = () => ({
//     applicationNo: initialValues.applicationNo,
//     studentName: initialValues.studentName,
//     amount: initialValues.amount,
//     campus: initialValues.joinedCampus,
//   });

//   // Prefer human-readable labels over numeric ids for header display
//   const resolveDisplayValue = (primary, ...fallbacks) => {
//     const isNonNumeric = (v) => v && !/^\d+$/.test(String(v).trim());
//     if (isNonNumeric(primary)) return primary;
//     for (const v of fallbacks) {
//       if (isNonNumeric(v)) return v;
//     }
//     // If everything is numeric/empty, return the first truthy value or empty string
//     return primary || fallbacks.find(Boolean) || "";
//   };

//   // Create a more robust data resolution that handles multiple scenarios
//   const getHeaderCampus = () => {
//     // Try initial values first (most persistent)
//     if (initialValues.campusName && initialValues.campusName !== "-" && initialValues.campusName !== "") {
//       console.log("✅ Campus found in initialValues.campusName:", initialValues.campusName);
//       return initialValues.campusName;
//     }
//     if (initialValues.campus && initialValues.campus !== "-" && initialValues.campus !== "") {
//       console.log("✅ Campus found in initialValues.campus:", initialValues.campus);
//       return initialValues.campus;
//     }
//     if (initialValues.joinedCampus && initialValues.joinedCampus !== "-" && initialValues.joinedCampus !== "") {
//       console.log("✅ Campus found in initialValues.joinedCampus:", initialValues.joinedCampus);
//       return initialValues.joinedCampus;
//     }
//     // Try location state (immediate data from navigation)
//     if (locationInitialValues?.campusName && locationInitialValues.campusName !== "-" && locationInitialValues.campusName !== "") {
//       console.log("✅ Campus found in locationInitialValues.campusName:", locationInitialValues.campusName);
//       return locationInitialValues.campusName;
//     }
//     if (locationInitialValues?.campus && locationInitialValues.campus !== "-" && locationInitialValues.campus !== "") {
//       console.log("✅ Campus found in locationInitialValues.campus:", locationInitialValues.campus);
//       return locationInitialValues.campus;
//     }
//     // Try API data
//     if (applicationData?.campusName && applicationData.campusName !== "-" && applicationData.campusName !== "") {
//       console.log("✅ Campus found in applicationData.campusName:", applicationData.campusName);
//       return applicationData.campusName;
//     }
//     // Try persistent data as last resort
//     if (persistentData.campus && persistentData.campus !== "-" && persistentData.campus !== "") {
//       console.log("✅ Campus found in persistentData.campus:", persistentData.campus);
//       return persistentData.campus;
//     }
//     console.log("❌ No campus data found, returning '-'");
//     return "-";
//   };

//   const getHeaderZone = () => {
//     // Try initial values first (most persistent)
//     if (initialValues.zoneName && initialValues.zoneName !== "-" && initialValues.zoneName !== "") {
//       console.log("✅ Zone found in initialValues.zoneName:", initialValues.zoneName);
//       return initialValues.zoneName;
//     }
//     if (initialValues.zone && initialValues.zone !== "-" && initialValues.zone !== "") {
//       console.log("✅ Zone found in initialValues.zone:", initialValues.zone);
//       return initialValues.zone;
//     }
//     if (initialValues.district && initialValues.district !== "-" && initialValues.district !== "") {
//       console.log("✅ Zone found in initialValues.district:", initialValues.district);
//       return initialValues.district;
//     }
//     // Try location state (immediate data from navigation)
//     if (locationInitialValues?.zoneName && locationInitialValues.zoneName !== "-" && locationInitialValues.zoneName !== "") {
//       console.log("✅ Zone found in locationInitialValues.zoneName:", locationInitialValues.zoneName);
//       return locationInitialValues.zoneName;
//     }
//     if (locationInitialValues?.zone && locationInitialValues.zone !== "-" && locationInitialValues.zone !== "") {
//       console.log("✅ Zone found in locationInitialValues.zone:", locationInitialValues.zone);
//       return locationInitialValues.zone;
//     }
//     // Try API data
//     if (applicationData?.zoneName && applicationData.zoneName !== "-" && applicationData.zoneName !== "") {
//       console.log("✅ Zone found in applicationData.zoneName:", applicationData.zoneName);
//       return applicationData.zoneName;
//     }
//     // Try persistent data as last resort
//     if (persistentData.zone && persistentData.zone !== "-" && persistentData.zone !== "") {
//       console.log("✅ Zone found in persistentData.zone:", persistentData.zone);
//       return persistentData.zone;
//     }
//     console.log("❌ No zone data found, returning '-'");
//     return "-";
//   };

//   const headerCampus = getHeaderCampus();
//   const headerZone = getHeaderZone();

//   // Preserve campus and zone data when first loaded
//   useEffect(() => {
//     if (headerCampus && headerCampus !== "-" && !persistentData.campus) {
//       setPersistentData(prev => ({ ...prev, campus: headerCampus }));
//     }
//     if (headerZone && headerZone !== "-" && !persistentData.zone) {
//       setPersistentData(prev => ({ ...prev, zone: headerZone }));
//     }
//   }, [headerCampus, headerZone, persistentData.campus, persistentData.zone]);

//   // Debug logging for header data
//   console.log("🏢 Header Campus Resolution:", {
//     applicationData: applicationData?.campusName,
//     locationInitialValues: locationInitialValues?.campusName,
//     initialValues: {
//       campusName: initialValues.campusName,
//       campus: initialValues.campus,
//       joinedCampus: initialValues.joinedCampus
//     },
//     resolved: headerCampus
//   });

//   console.log("🌍 Header Zone Resolution:", {
//     applicationData: applicationData?.zoneName,
//     locationInitialValues: locationInitialValues?.zoneName,
//     initialValues: {
//       zoneName: initialValues.zoneName,
//       zone: initialValues.zone,
//       district: initialValues.district
//     },
//     resolved: headerZone
//   });

//   console.log("📊 StatusHeader Props:", {
//     applicationNo: applicationData?.applicationNo || initialValues.applicationNo || applicationNo || "",
//     campusName: headerCampus,
//     zoneName: headerZone
//   });

//   console.log("🔍 Complete Data Debug:", {
//     locationInitialValues: locationInitialValues,
//     applicationData: applicationData,
//     initialValues: {
//       campusName: initialValues.campusName,
//       zoneName: initialValues.zoneName,
//       campus: initialValues.campus,
//       zone: initialValues.zone,
//       district: initialValues.district,
//       joinedCampus: initialValues.joinedCampus
//     },
//     selectedStatus: selectedStatus
//   });

//   console.log("🔍 ApplicationStatusForm render - selectedStatus:", selectedStatus, "showSuccess:", showSuccess);
 
//   return (
//     <div className={styles.Application_Status_Form_main_app_status_container}>
//       <div className={styles.Application_Status_Form_main_app_status_header}>
//         <div className={styles.Application_Status_Form_main_app_status_header_back_btn}>
//           <div className={styles.Application_Status_Form_main_back_btn} onClick={handleBack}>
//             <img src={backButton} alt="back" />
//           </div>
//         </div>
//         <div className={styles.Application_Status_Form_main_app_status_header_status_header}>
//           {!showSuccess && (
//             <StatusHeader
//               applicationNo={applicationData?.applicationNo || initialValues.applicationNo || applicationNo || ""}
//               campusName={headerCampus}
//               zoneName={headerZone}
//             />
//           )}
//         </div>
//       </div>
//       <div className={styles.Application_Status_Form_main_layout_wrapper}>
//         <StatusSelector
//           selectedStatus={selectedStatus}
//           onStatusSelect={(newStatus) => {
//             if (showSuccess) return;
//             setSelectedStatus(newStatus);
//             const pathSegment = newStatus.toLowerCase();
//             const appNo = initialValues.applicationNo || applicationNo || "";
//             if (appNo) {
//               // Pass current application data through navigation state to ensure StatusHeader visibility
//               // Use current resolved values and persistent data as fallback to preserve data
//               const currentData = {
//                 applicationNo: applicationData?.applicationNo || initialValues.applicationNo || applicationNo || "",
//                 zoneName: initialValues.zoneName || initialValues.zone || initialValues.district || headerZone || persistentData.zone || "",
//                 zone: initialValues.zoneName || initialValues.zone || initialValues.district || headerZone || persistentData.zone || "",
//                 zoneEmpId: initialValues.zoneEmpId || "",
//                 campusName: initialValues.campusName || initialValues.campus || initialValues.joinedCampus || headerCampus || persistentData.campus || "",
//                 campus: initialValues.campusName || initialValues.campus || initialValues.joinedCampus || headerCampus || persistentData.campus || "",
//                 campusId: initialValues.campusId || "",
//                 proName: initialValues.proName || "",
//                 dgmName: initialValues.dgmName || "",
//                 dgmEmpId: initialValues.dgmEmpId || "",
//                 status: initialValues.status || "",
//                 statusId: initialValues.statusId || "",
//                 reason: initialValues.reason || "",
//               };
//               console.log("🚀 StatusSelector Navigation Data:", {
//                 newStatus,
//                 appNo,
//                 currentData,
//                 initialValues: {
//                   campusName: initialValues.campusName,
//                   zoneName: initialValues.zoneName,
//                   campus: initialValues.campus,
//                   zone: initialValues.zone,
//                   district: initialValues.district,
//                   joinedCampus: initialValues.joinedCampus
//                 }
//               });
             
//               navigate(`/scopes/application/status/${appNo}/${pathSegment}`, {
//                 state: {
//                   initialValues: currentData,
//                 },
//               });
//             }
//           }}
//           showOnlyTitle={showSuccess}
//           currentStatus={showSuccess ? "Confirmation" : ""}
//           applicationNo={initialValues.applicationNo || applicationNo || ""}
//         />
//         {!showSuccess && selectedStatus === "Sale" && <ProgressHeader step={activeStep} totalSteps={steps.length} />}
//         {!showSuccess && selectedStatus === "Confirmation" && <ProgressHeader step={activeConfirmationStep} totalSteps={2} />}
//       </div>
//       {showSuccess ? (
//         <SuccessPage
//           applicationNo={initialValues.applicationNo}
//           studentName={initialValues.studentName}
//           amount={initialValues.amount}
//           campus={initialValues.campusName || initialValues.joinedCampus || initialValues.campus || ""}
//           zone={initialValues.zoneName || initialValues.district || initialValues.zone || ""}
//           onBack={() => navigate("/scopes/application")}
//           statusType={successStatusType}
//         />
//       ) : selectedStatus === "Confirmation" ? (
//         <div>
//           {console.log("🔍 Rendering ConfirmationHeader with selectedStatus:", selectedStatus)}
//           <ConfirmationHeader
//             onSuccess={handleConfirmationSuccess}
//             applicationData={getApplicationData()}
//             onStepChange={(step) => setActiveConfirmationStep(step)}
//             saleData={saleData}
//           />
//         </div>
//       ) : selectedStatus === "Sale" ? (
//         <Formik
//           initialValues={initialValues}
//           validationSchema={currentValidationSchema}
//           onSubmit={handleSubmit}
//           enableReinitialize={true}
//         >
//           {({ values, errors, touched, setFieldValue, handleChange, handleSubmit, validateForm, setTouched }) => (
//             <Form className={styles.Application_Status_Form_main_application_form}>
//               <div className={styles.Application_Status_Form_main_form_wrapper}>
//                 <StepperTabs steps={steps} activeStep={activeStep} onStepChange={handleStepChange} />
//                 {activeStep === 0 && (
//                   <GeneralInfoSection
//                     values={values}
//                     errors={errors}
//                     touched={touched}
//                     handleChange={handleChange}
//                     setFieldValue={setFieldValue}
//                     setFieldTouched={setTouched}
//                     validateForm={validateForm}
//                     activeStep={activeStep}
//                     setActiveStep={setActiveStep}
//                     steps={steps}
//                     handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {activeStep === 1 && (
//                   <ConcessionInfoSection
//                     values={values}
//                     errors={errors}
//                     touched={touched}
//                     handleChange={handleChange}
//                     setFieldValue={setFieldValue}
//                     setFieldTouched={setTouched}
//                     validateForm={validateForm}
//                     showCouponModal={showCouponModal}
//                     setShowCouponModal={setShowCouponModal}
//                     couponDetails={couponDetails}
//                     setCouponDetails={setCouponDetails}
//                     onCouponSubmit={() => handleCouponSubmit(setFieldValue)}
//                     activeStep={activeStep}
//                     setActiveStep={setActiveStep}
//                     steps={steps}
//                     handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {activeStep === 2 && (
//                   <AddressInfoSection
//                     values={values}
//                     errors={errors}
//                     touched={touched}
//                     handleChange={handleChange}
//                     setFieldValue={setFieldValue}
//                     setFieldTouched={setTouched}
//                     validateForm={validateForm}
//                     activeStep={activeStep}
//                     setActiveStep={setActiveStep}
//                     steps={steps}
//                     handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
//                     handleBack={handleBack}
//                   />
//                 )}
//                 {activeStep === 3 && (
//                   <PaymentInfoSection
//                     values={values}
//                     errors={errors}
//                     touched={touched}
//                     handleChange={handleChange}
//                     setFieldValue={setFieldValue}
//                     setFieldTouched={setTouched}
//                     validateForm={validateForm}
//                     activeStep={activeStep}
//                     setActiveStep={setActiveStep}
//                     steps={steps}
//                     handleNext={() => handleNext(values, setFieldValue, validateForm, setTouched)}
//                     handleBack={handleBack}
//                     handleSubmit={handleSubmit}
//                     finishDisabled={isSubmitting}
//                     onContinue={(backendResponse) => {
//                       console.log("🔍 onContinue called with backend response:", backendResponse);
//                       console.log("🔍 Backend response type:", typeof backendResponse);
                     
//                       // Since backend returns a string, we'll use the existing application number
//                       // The backend has already created the record with the studAdmsNo we sent
//                       const admissionNo = values.applicationNo || values.studAdmsNo || initialValues.applicationNo || applicationNo;
                     
//                       console.log("🔍 Using application number as admission number:", admissionNo);
                     
//                       // Set sale data with the admission number and map fields for StudentInformation
//                       const saleDataWithAdmission = {
//                         ...values,
//                         admissionNo: admissionNo,
//                         studAdmsNo: admissionNo,
//                         applicationNo: admissionNo,  // StudentInformation looks for this field
//                         // Map form fields to StudentInformation expected fields
//                         studentName: values.firstName || values.studentName || "",
//                         surname: values.surname || "",
//                         fatherName: values.fatherName || "",
//                         motherName: values.motherName || "",
//                         gender: values.gender || "1",
//                         amount: values.amount || values.applicationFee || "",
//                         appFeeAmount: values.applicationFee || "",
//                         appFee: values.applicationFee || "",
//                         yearConcession1st: values.yearConcession1st || "",
//                         yearConcession2nd: values.yearConcession2nd || "",
//                         yearConcession3rd: values.yearConcession3rd || "",
//                         reason: values.reason || "",
//                         reasonId: values.concessionReasonId || ""
//                       };
                     
//                       console.log("🔍 Setting sale data:", saleDataWithAdmission);
//                       setSaleData(saleDataWithAdmission);
//                       console.log("🔍 Setting selectedStatus to Confirmation");
//                       setSelectedStatus("Confirmation");
                     
//                       const pathSegment = "confirmation";
//                       const appNo = admissionNo;
                     
//                       console.log("🔍 Navigating to confirmation with admission number:", appNo);
                     
//                       if (appNo) {
//                         navigate(`/scopes/application/status/${appNo}/${pathSegment}`);
//                       } else {
//                         console.warn("⚠️ No admission number available for navigation");
//                       }
//                     }}
//                   />
//                 )}
//               </div>
//             </Form>
//           )}
//         </Formik>
//       ) : selectedStatus === "Damaged" ? (
//         <Formik
//           initialValues={initialValues}
//           onSubmit={handleSubmit}
//           enableReinitialize={true}
//         >
//           {({ values, errors, touched, setFieldValue, handleChange, validateForm, setTouched }) => (
//             <Damaged />
//           )}
//         </Formik>
//       ) : null}
//     </div>
//   );
// };

// export default ApplicationStatusForm;