import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";
import Inputbox from "../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../widgets/Dropdown/Dropdown";
import { Button as MUIButton } from "@mui/material";
import Button from "../../../../widgets/Button/Button";
import Snackbar from "../../../../widgets/Snackbar/Snackbar";
import { ReactComponent as TrendingUpIcon } from "../../../../assets/application-status/Trending up.svg";
import Cash from "../../../../assets/application-status/Cash (1).svg";
import DD from "../../../../assets/application-status/DD (1).svg";
import Debit from "../../../../assets/application-status/Debit Card.svg";
import Cheque from "../../../../assets/application-status/Cheque (1).svg";
import SkipIcon from "../../../../assets/application-status/SkipIcon.svg";
import * as Yup from "yup";
import styles from "./PaymentInfoSection.module.css";
import { ReactComponent as BackArrow } from "../../../../assets/application-status/Backarrow.svg";
import apiService from "../../../../queries/application-status/SaleFormapis";

// Import the transformation function from ApplicationStatusForm
const transformFormDataToApiFormat = (formData) => {
  // Helper function to safely parse integers with fallback
  const safeParseInt = (value, fallback = 0) => {
    if (!value || value === "" || value === null || value === undefined) return fallback;
    const parsed = parseInt(value);
    return isNaN(parsed) ? fallback : parsed;
  };

  // Helper function to safely parse floats with fallback
  const safeParseFloat = (value, fallback = 0) => {
    if (!value || value === "" || value === null || value === undefined) return fallback;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  };

  const apiData = {
    studAdmsNo: formData.applicationNo || formData.htNo || "",
    studentName: formData.studentName || formData.firstName || "",
    surname: formData.surname || "",
    htNo: formData.htNo || "",
    apaarNo: formData.aapar || "",
    dateOfJoin: formData.dateOfJoin || new Date().toISOString().split('T')[0],
    createdBy: formData.createdBy || 2,
    aadharCardNo: safeParseInt(formData.aadhaar),
    dob: formData.dob || "",
    religionId: safeParseInt(formData.religion) || 1,
    casteId: safeParseInt(formData.caste) || 1,
    schoolTypeId: safeParseInt(formData.schoolTypeId) || 1,
    schoolName: formData.schoolName || "",
    preSchoolStateId: safeParseInt(formData.schoolState) || 1,
    preSchoolDistrictId: safeParseInt(formData.schoolDistrict) || 1,
    preschoolTypeId: safeParseInt(formData.schoolType) || safeParseInt(formData.preschoolTypeId) || safeParseInt(formData.preschoolType) || 1,
    admissionReferredBy: formData.admissionReferredBy || "",
    scoreAppNo: formData.scoreAppNo || "",
    marks: safeParseInt(formData.marks),
    orientationDate: formData.orientationDates || formData.courseDates || "",
    appSaleDate: formData.appSaleDate || new Date().toISOString(),
    orientationFee: safeParseFloat(formData.OrientationFee) || safeParseFloat(formData.orientationFee) || safeParseFloat(formData.fee),
    genderId: safeParseInt(formData.gender) || 1,
    appTypeId: safeParseInt(formData.admissionType) || safeParseInt(formData.appType) || 1,
    studentTypeId: safeParseInt(formData.studentType) || 1,
    studyTypeId: safeParseInt(formData.batchType) || safeParseInt(formData.studyType) || 1,
    orientationId: safeParseInt(formData.orientationName) || safeParseInt(formData.course) || 1,
    sectionId: safeParseInt(formData.section) || 1,
    quotaId: safeParseInt(formData.quota) || 1,
    statusId: safeParseInt(formData.status) || 2,
    classId: safeParseInt(formData.joiningClassName) || safeParseInt(formData.classId) || 1,
    campusId: safeParseInt(formData.joinedCampus) || 1,
    // proId: safeParseInt(formData.proId) || 4095,
    orientationBatchId: safeParseInt(formData.orientationBatch) || safeParseInt(formData.courseBatch) || 1,
    bloodGroupId: safeParseInt(formData.bloodGroup) || 1,
    parents: [
      {
        name: formData.fatherName || "",
        relationTypeId: 1, // Father relation type ID
        occupation: formData.fatherOccupation || "",
        mobileNo: safeParseInt(formData.fatherPhoneNumber),
        email: formData.fatherEmail || ""
      },
      {
        name: formData.motherName || "",
        relationTypeId: 2, // Mother relation type ID
        occupation: formData.motherOccupation || "",
        mobileNo: safeParseInt(formData.motherPhoneNumber),
        email: formData.motherEmail || ""
      }
    ],
    addressDetails: {
      doorNo: formData.doorNo || "",
      street: formData.street || "",
      landmark: formData.landmark || "",
      area: formData.area || "",
      cityId: safeParseInt(formData.addressCity) || safeParseInt(formData.city) || 1,
      mandalId: safeParseInt(formData.mandal) || 1,
      districtId: safeParseInt(formData.district) || 1,
      pincode: safeParseInt(formData.pincode) || 500001,
      stateId: safeParseInt(formData.state) || safeParseInt(formData.stateId) || 1,
      createdBy: formData.createdBy || 2
    },
    siblings: (() => {
      console.log("🔍 PaymentInfoSection - Original siblingInformation:", formData.siblingInformation);
      
      // Helper function to safely parse integers with fallback
      const safeParseInt = (value, fallback = 1) => {
        if (!value || value === "" || value === null || value === undefined) return fallback;
        const parsed = parseInt(value);
        return isNaN(parsed) ? fallback : parsed;
      };

      const filteredSiblings = (formData.siblingInformation || [])
        .filter(sibling => {
          // Check if sibling object exists and has required fields
          if (!sibling || typeof sibling !== 'object') {
            console.log(`🔍 PaymentInfoSection - Filtering out invalid sibling object:`, sibling);
            return false;
          }
         
          // Only include siblings that have at least a name filled
          const hasName = sibling.fullName && sibling.fullName.trim() !== "";
          console.log(`🔍 PaymentInfoSection - Filtering sibling:`, { sibling, hasName });
          return hasName;
        });
     
      console.log("🔍 PaymentInfoSection - Filtered siblings:", filteredSiblings);
     
      const transformedSiblings = filteredSiblings.map((sibling, index) => {
        // Additional validation to ensure required fields are present
        if (!sibling.fullName || sibling.fullName.trim() === "") {
          console.warn(`⚠️ PaymentInfoSection - Skipping sibling ${index} - no name provided:`, sibling);
          return null;
        }
       
        const transformedSibling = {
          fullName: sibling.fullName.trim(),
          schoolName: sibling.schoolName?.trim() || "",
          classId: safeParseInt(sibling.class) || safeParseInt(sibling.classId) || 1,
          relationTypeId: safeParseInt(sibling.relationType) || safeParseInt(sibling.relationTypeId) || 1,
          genderId: safeParseInt(sibling.gender) || safeParseInt(sibling.genderId) || 1,
          createdBy: formData.createdBy || 2
        };
       
        console.log(`🔍 PaymentInfoSection - Sibling ${index} transformation:`, {
          original: sibling,
          transformed: transformedSibling
        });
       
        return transformedSibling;
      }).filter(sibling => sibling !== null); // Remove any null entries
     
      console.log("🔍 PaymentInfoSection - Final transformed siblings:", transformedSiblings);
     
      // Final safety check - ensure no empty or invalid siblings are sent
      const finalSiblings = transformedSiblings.filter(sibling => {
        const isValid = sibling &&
                       sibling.fullName &&
                       sibling.fullName.trim() !== "" &&
                       sibling.genderId &&
                       sibling.classId &&
                       sibling.relationTypeId;
       
        if (!isValid) {
          console.warn("🔍 PaymentInfoSection - Removing invalid sibling from final array:", sibling);
        }
       
        return isValid;
      });
     
      console.log("🔍 PaymentInfoSection - Final validated siblings:", finalSiblings);
     
      // If no valid siblings, return empty array to avoid sending empty objects
      if (finalSiblings.length === 0) {
        console.log("🔍 PaymentInfoSection - No valid siblings found, sending empty array");
        return [];
      }
     
      return finalSiblings;
    })(),
    studentConcessionDetails: {
      concessionIssuedBy: safeParseInt(formData.givenById) || safeParseInt(formData.concessionIssuedBy) || 1,
      concessionAuthorisedBy: safeParseInt(formData.authorizedById) || safeParseInt(formData.concessionAuthorisedBy) || 1,
      description: formData.reason || formData.description || "",
      concessionReasonId: safeParseInt(formData.concessionReasonId) || 1,
      created_by: formData.createdBy || 2,
      concessions: [
        ...(formData.yearConcession1st && safeParseFloat(formData.yearConcession1st) > 0 ? [{
          concTypeId: 1, // Year 1 concession
          amount: safeParseFloat(formData.yearConcession1st)
        }] : []),
        ...(formData.yearConcession2nd && safeParseFloat(formData.yearConcession2nd) > 0 ? [{
          concTypeId: 2, // Year 2 concession
          amount: safeParseFloat(formData.yearConcession2nd)
        }] : []),
        ...(formData.yearConcession3rd && safeParseFloat(formData.yearConcession3rd) > 0 ? [{
          concTypeId: 3, // Year 3 concession
          amount: safeParseFloat(formData.yearConcession3rd)
        }] : [])
      ]
    },
    proConcessionDetails: {
      concessionAmount: safeParseFloat(formData.proConcessionAmount),
      reason: formData.proReason || formData.reason || "",
      proEmployeeId: safeParseInt(formData.proEmployeeId) || safeParseInt(formData.authorizedById) || 1,
      created_by: formData.createdBy || 2
    },
    paymentDetails: {
      applicationFeeAmount: safeParseFloat(formData.applicationFee) || safeParseFloat(formData.amount) || safeParseFloat(formData.appFeeAmount),
      prePrintedReceiptNo: formData.receiptNumber || formData.appFeeReceiptNo || "",
      applicationFeeDate: formData.paymentDate || formData.appFeePayDate || new Date().toISOString(),
      concessionAmount: safeParseFloat(formData.yearConcession1st) + safeParseFloat(formData.yearConcession2nd) + safeParseFloat(formData.yearConcession3rd),
      paymentModeId: safeParseInt(formData.payMode) || 1,
      chequeDdNo: formData.mainDdNumber || formData.mainChequeNumber || "",
      ifscCode: formData.mainDdIfscCode || formData.mainChequeIfscCode || "",
      chequeDdDate: formData.paymentDate || formData.mainDdDate || formData.mainChequeDate || "",
      cityId: safeParseInt(formData.mainDdCityName) || safeParseInt(formData.mainChequeCityName) || safeParseInt(formData.addressCity) || 1,
      orgBankId: safeParseInt(formData.mainDdBankName) || safeParseInt(formData.mainChequeBankName) || 1,
      orgBankBranchId: safeParseInt(formData.mainDdBranchName) || safeParseInt(formData.mainChequeBranchName) || 1,
      organizationId: safeParseInt(formData.mainDdOrganisationName) || safeParseInt(formData.mainChequeOrganisationName) || 1,
      created_by: formData.createdBy || 2
    }
  };

  return apiData;
};

// Validation schema for PaymentInfoSection
const validationSchema = Yup.object().shape({
  payMode: Yup.number().required("Application Fee Pay Mode is required"),
  appFeeReceived: Yup.boolean(),
  // Cash fields for payMode
  paymentDate: Yup.date().when("payMode", {
    is: 1,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  amount: Yup.string().when("payMode", {
    is: 1,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  receiptNumber: Yup.string().when("payMode", {
    is: 1,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  // DD fields for payMode
  mainDdPayDate: Yup.date().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdAmount: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdReceiptNumber: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdOrganisationName: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Organisation Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdNumber: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("DD Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdCityName: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("City Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdBankName: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Bank Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdBranchName: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("Branch Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdIfscCode: Yup.string().when("payMode", {
    is: 2,
    then: (schema) => schema.required("IFSC Code is required").matches(/^[A-Z0-9]{11}$/, "IFSC Code must be 11 alphanumeric characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainDdDate: Yup.date().when("payMode", {
    is: 2,
    then: (schema) => schema.required("DD Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  // Cheque fields for payMode
  mainChequePayDate: Yup.date().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeAmount: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeReceiptNumber: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeOrganisationName: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Organisation Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeNumber: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Cheque Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeCityName: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("City Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeBankName: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Bank Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeBranchName: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Branch Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeIfscCode: Yup.string().when("payMode", {
    is: 3,
    then: (schema) => schema.required("IFSC Code is required").matches(/^[A-Z0-9]{11}$/, "IFSC Code must be 11 alphanumeric characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainChequeDate: Yup.date().when("payMode", {
    is: 3,
    then: (schema) => schema.required("Cheque Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  // Credit/Debit Card fields for payMode
  cardPayDate: Yup.date().when("payMode", {
    is: 4,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardAmount: Yup.string().when("payMode", {
    is: 4,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardReceiptNumber: Yup.string().when("payMode", {
    is: 4,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  // App Fee (conditional) — depend on main payMode
  appFeePayDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 1,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  appFeeAmount: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 1,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  appFeeReceiptNo: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 1,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdPayDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdAmount: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdReceiptNumber: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdOrganisationName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Organisation Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdNumber: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("DD Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdCityName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("City Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdBankName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Bank Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdBranchName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("Branch Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdIfscCode: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("IFSC Code is required").matches(/^[A-Z0-9]{11}$/, "IFSC Code must be 11 alphanumeric characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeDdDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 2,
    then: (schema) => schema.required("DD Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequePayDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeAmount: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeReceiptNumber: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeOrganisationName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Organisation Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeNumber: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Cheque Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeCityName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("City Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeBankName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Bank Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeBranchName: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Branch Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeIfscCode: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("IFSC Code is required").matches(/^[A-Z0-9]{11}$/, "IFSC Code must be 11 alphanumeric characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  feeChequeDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 3,
    then: (schema) => schema.required("Cheque Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardFeePayDate: Yup.date().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 4,
    then: (schema) => schema.required("Application Fee Pay Date is required").nullable(),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardFeeAmount: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 4,
    then: (schema) => schema.required("Application Fee Amount is required").matches(/^\d+$/, "Amount must be numeric"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardFeeReceiptNo: Yup.string().when(["appFeeReceived", "payMode"], {
    is: (appFeeReceived, payMode) => appFeeReceived && payMode === 4,
    then: (schema) => schema.required("Receipt Number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const PaymentInfoSection = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  activeStep,
  setActiveStep,
  steps,
  handleNext,
  handleBack,
  validateForm,
  onFinish,
  onContinue,
  finishDisabled,
}) => {
  const { setErrors, setTouched } = useFormikContext();
  const navigate = useNavigate();
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("Cash");
  const [selectedAppFeePayMode, setSelectedAppFeePayMode] = useState("Cash");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  // Function to show snackbar messages
  const showSnackbar = (message, severity = 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Function to close snackbar
  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    organizations: [],
    cities: [],
    banks: [],
    branches: [],
  });

  // Define modes at component level
  const modes = [
    { label: "Cash", value: 1, icon: Cash },
    { label: "DD", value: 2, icon: DD },
    { label: "Cheque", value: 3, icon: Cheque },
    { label: "Credit/Debit Card", value: 4, icon: Debit },
  ];

  // Fetch initial data (organizations and cities)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log("Fetching initial payment data...");
        const [organizations, cities] = await Promise.all([
          apiService.fetchOrganizations(),
          apiService.fetchCities(),
        ]);

        console.log("Organizations response:", organizations);
        console.log("Cities response:", cities);

        // Process organizations
        let organizationsArray = [];
        if (Array.isArray(organizations)) {
          organizationsArray = organizations;
        } else if (organizations && typeof organizations === 'object') {
          organizationsArray = [organizations];
        }

        const processedOrganizations = organizationsArray
          .filter((item) => item && item.id != null && item.name)
          .map((item) => ({
            value: item.id?.toString() || "",
            label: capitalizeText(item.name || ""),
          }));

        // Process cities
        let citiesArray = [];
        if (Array.isArray(cities)) {
          citiesArray = cities;
        } else if (cities && typeof cities === 'object') {
          citiesArray = [cities];
        }

        const processedCities = citiesArray
          .filter((item) => item && item.id != null && item.name)
          .map((item) => ({
            value: item.id?.toString() || "",
            label: capitalizeText(item.name || ""),
          }));

        setDropdownOptions((prev) => ({
          ...prev,
          organizations: processedOrganizations,
          cities: processedCities,
        }));

        console.log("Processed organizations:", processedOrganizations);
        console.log("Processed cities:", processedCities);
      } catch (error) {
        console.error("Error fetching initial payment data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch banks when organization changes
  useEffect(() => {
    const fetchBanks = async () => {
      if (values.mainDdOrganisationName || values.mainChequeOrganisationName || 
          values.feeDdOrganisationName || values.feeChequeOrganisationName) {
        const organizationId = values.mainDdOrganisationName || values.mainChequeOrganisationName || 
                              values.feeDdOrganisationName || values.feeChequeOrganisationName;
        
        try {
          console.log("Fetching banks for organization:", organizationId);
          const banks = await apiService.fetchBanksByOrganization(organizationId);
          console.log("Banks response:", banks);

          let banksArray = [];
          if (Array.isArray(banks)) {
            banksArray = banks;
          } else if (banks && typeof banks === 'object') {
            banksArray = [banks];
          }

          const processedBanks = banksArray
            .filter((item) => item && item.id != null && item.name)
            .map((item) => ({
              value: item.id?.toString() || "",
              label: capitalizeText(item.name || ""),
            }));

          setDropdownOptions((prev) => ({
            ...prev,
            banks: processedBanks,
            branches: [], // Reset branches when organization changes
          }));

          console.log("Processed banks:", processedBanks);
        } catch (error) {
          console.error("Error fetching banks:", error);
        }
      }
    };

    fetchBanks();
  }, [values.mainDdOrganisationName, values.mainChequeOrganisationName, 
      values.feeDdOrganisationName, values.feeChequeOrganisationName]);

  // Fetch branches when bank changes
  useEffect(() => {
    const fetchBranches = async () => {
      const organizationId = values.mainDdOrganisationName || values.mainChequeOrganisationName || 
                            values.feeDdOrganisationName || values.feeChequeOrganisationName;
      const bankId = values.mainDdBankName || values.mainChequeBankName || 
                     values.feeDdBankName || values.feeChequeBankName;

      if (organizationId && bankId) {
        try {
          console.log("Fetching branches for organization:", organizationId, "and bank:", bankId);
          const branches = await apiService.fetchBranchesByOrganizationAndBank(organizationId, bankId);
          console.log("Branches response:", branches);

          let branchesArray = [];
          if (Array.isArray(branches)) {
            branchesArray = branches;
          } else if (branches && typeof branches === 'object') {
            branchesArray = [branches];
          }

          const processedBranches = branchesArray
            .filter((item) => item && item.id != null && item.name)
            .map((item) => ({
              value: item.id?.toString() || "",
              label: capitalizeText(item.name || ""),
            }));

          setDropdownOptions((prev) => ({
            ...prev,
            branches: processedBranches,
          }));

          console.log("Processed branches:", processedBranches);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      }
    };

    fetchBranches();
  }, [values.mainDdBankName, values.mainChequeBankName, values.feeDdBankName, values.feeChequeBankName]);

  useEffect(() => {
    const payMode = values?.payMode ?? 1;
    const appFeeReceived = !!values?.appFeeReceived;

    const modeLabel = modes.find(mode => mode.value === payMode)?.label ?? "Cash";

    setSelectedPaymentMode(modeLabel);
    setSelectedAppFeePayMode(modeLabel);
    setFieldValue && setFieldValue("appFeePayMode", payMode, false);

    setErrors({});
    setTouched({});
  }, [
    values?.payMode,
    values?.appFeeReceived,
    setFieldValue, // Added to dependency array to avoid missing dependency warning
  ]);

  const getPaymentModeFields = () => {
    switch (selectedPaymentMode) {
      case "Cash":
        return [
          { label: "Application Fee Pay Date", name: "paymentDate", placeholder: "Select Payment Date", type: "date", required: true },
          { label: "Application Fee Amount", name: "amount", placeholder: "Enter Amount (numbers only)", required: true },
          { label: "Application Sale Date", name: "mainDdSaleDate", placeholder: "Select Sale Date", type: "date", required: true },
          { label: "Receipt Number", name: "receiptNumber", placeholder: "Enter Receipt Number", required: true },
        ];
      case "DD":
        return [
          { label: "Application Fee Pay Date", name: "mainDdPayDate", placeholder: "Select Pay Date", type: "date", required: true },
          { label: "Application Fee Amount", name: "mainDdAmount", placeholder: "Enter Amount (numbers only)", required: true },
          {label:"Applicattion Sale Date", name: "mainDdSaleDate", placeholder: "Select Sale Date", type: "date", required: true },
          { label: "Receipt Number", name: "mainDdReceiptNumber", placeholder: "Enter Receipt Number", required: true },
          { label: "Organisation Name", name: "mainDdOrganisationName", type: "select", options: dropdownOptions.organizations.map(opt => opt.label), required: true },
          { label: "DD Number", name: "mainDdNumber", placeholder: "Enter DD Number", required: true },
          { label: "City Name", name: "mainDdCityName", type: "select", options: dropdownOptions.cities.map(opt => opt.label), required: true },
          { label: "Bank Name", name: "mainDdBankName", type: "select", options: dropdownOptions.banks.map(opt => opt.label), required: true },
          { label: "Branch Name", name: "mainDdBranchName", type: "select", options: dropdownOptions.branches.map(opt => opt.label), required: true },
          { label: "IFSC Code", name: "mainDdIfscCode", placeholder: "Enter IFSC Code", required: true },
          { label: "DD Date", name: "mainDdDate", placeholder: "Select DD Date", type: "date", required: true },
        ];
      case "Cheque":
        return [
          { label: "Application Fee Pay Date", name: "mainChequePayDate", placeholder: "Select Pay Date", type: "date", required: true },
          { label: "Application Fee Amount", name: "mainChequeAmount", placeholder: "Enter Amount (numbers only)", required: true },
          { label: "Application Sale Date", name: "mainChequeSaleDate", placeholder: "Select Sale Date", type: "date", required: true },
          { label: "Receipt Number", name: "mainChequeReceiptNumber", placeholder: "Enter Receipt Number", required: true },
          { label: "Organisation Name", name: "mainChequeOrganisationName", type: "select", options: dropdownOptions.organizations.map(opt => opt.label), required: true },
          { label: "Cheque Number", name: "mainChequeNumber", placeholder: "Enter Cheque Number", required: true },
          { label: "City Name", name: "mainChequeCityName", type: "select", options: dropdownOptions.cities.map(opt => opt.label), required: true },
          { label: "Bank Name", name: "mainChequeBankName", type: "select", options: dropdownOptions.banks.map(opt => opt.label), required: true },
          { label: "Branch Name", name: "mainChequeBranchName", type: "select", options: dropdownOptions.branches.map(opt => opt.label), required: true },
          { label: "IFSC Code", name: "mainChequeIfscCode", placeholder: "Enter IFSC Code", required: true },
          { label: "Cheque Date", name: "mainChequeDate", placeholder: "Select Cheque Date", type: "date", required: true },
        ];
      case "Credit/Debit Card":
        return [
          { label: "Application Fee Pay Date", name: "cardPayDate", placeholder: "Select Payment Date", type: "date", required: true },
          { label: "Application Fee Amount", name: "cardAmount", placeholder: "Enter Amount (numbers only)", required: true },
          { label: "Receipt Number", name: "cardReceiptNumber", placeholder: "Enter Receipt Number", required: true },
        ];
      default:
        return [];
    }
  };

  // Helper function to capitalize text
  const capitalizeText = (text) => {
    if (!text) return text;
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if ([
      "amount", "appFeeAmount", "appFeeReceiptNo", "receiptNumber", "mainDdAmount", "feeDdAmount",
      "mainChequeAmount", "feeChequeAmount", "mainDdReceiptNumber", "feeDdReceiptNumber",
      "mainChequeReceiptNumber", "feeChequeReceiptNumber", "mainDdNumber", "feeDdNumber",
      "mainChequeNumber", "cardAmount", "cardReceiptNumber", "cardFeeAmount", "cardFeeReceiptNo"
    ].includes(name)) {
      finalValue = value.replace(/\D/g, '');
    } else if (["mainDdIfscCode", "mainChequeIfscCode", "feeDdIfscCode", "feeChequeIfscCode"].includes(name)) {
      finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    } else if (["mainDdOrganisationName", "mainChequeOrganisationName", "feeDdOrganisationName", "feeChequeOrganisationName"].includes(name)) {
      // Apply capitalization to organization name fields
      finalValue = capitalizeText(value);
    }
    setFieldValue(name, finalValue);
    console.log(`Field ${name} changed to:`, finalValue);
  };

  const renderPaymentModes = (name) => {
    const selected = values[name] ?? 1;
    return (
      <nav className={styles.Payment_Info_Section_payment_category_options}>
        <ul className={styles.Payment_Info_Section_payment_nav_list}>
          {modes.map((mode) => (
            <li key={mode.label} className={styles.Payment_Info_Section_payment_nav_item}>
              <MUIButton
                type="button"
                className={`${styles.Payment_Info_Section_payment_category_label} ${selected === mode.value ? styles.Payment_Info_Section_active : ""}`}
                onClick={() => {
                  setFieldValue(name, mode.value);
                  if (name === "payMode") {
                    setSelectedPaymentMode(mode.label);
                    setSelectedAppFeePayMode(mode.label);
                    setFieldValue("appFeePayMode", mode.value);
                  }
                }}
              >
                <img src={mode.icon} alt={mode.label} className={styles.paymentIcon} />
                <span className={styles.Payment_Info_Section_payment_category_text}>{mode.label}</span>
              </MUIButton>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const renderInput = (field) => {
    if (field.type === "custom") {
      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_input_group}>
          <div className={styles.Payment_Info_Section_payment_field_label_wrapper}>
            <label className={`${styles.Payment_Info_Section_payment_form_label} ${styles.Payment_Info_Section_payment_fw_semibold} ${styles.Payment_Info_Section_payment_small_label}`} htmlFor={field.name}>
              {field.label}
            </label>
            <div className={styles.Payment_Info_Section_payment_line}></div>
          </div>
          {renderPaymentModes(field.name)}
          {touched[field.name] && errors[field.name] && (
            <span className={styles.Payment_Info_Section_payment_error_message}>{errors[field.name]}</span>
          )}
        </div>
      );
    } else if (field.type === "checkbox") {
      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_checkbox_group}>
          <label
            className={`${styles.Payment_Info_Section_payment_form_label} ${styles.Payment_Info_Section_payment_small_label}`}
            htmlFor={field.name}
          >
            {field.label}
          </label>
          <label className={styles.squareCheckbox}>
            <input
              type="checkbox"
              name={field.name}
              checked={values[field.name]}
              onChange={handleChange}
            />
            <span className={styles.checkmark}></span>
          </label>
          {touched[field.name] && errors[field.name] && (
            <span className={styles.Payment_Info_Section_payment_error_message}>
              {errors[field.name]}
            </span>
          )}
        </div>
      );
    } else if (field.type === "select") {
      // Get the appropriate dropdown options based on field name
      let dropdownData = [];
      if (field.name.includes('OrganisationName')) {
        dropdownData = dropdownOptions.organizations;
      } else if (field.name.includes('CityName')) {
        dropdownData = dropdownOptions.cities;
      } else if (field.name.includes('BankName')) {
        dropdownData = dropdownOptions.banks;
      } else if (field.name.includes('BranchName')) {
        dropdownData = dropdownOptions.branches;
      } else {
        dropdownData = field.options ? field.options.map(opt => ({ value: opt, label: opt })) : [];
      }

      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_dropdown_wrapper}>
          <Dropdown
            dropdownname={field.label}
            name={field.name}
            results={dropdownData.length > 0 ? dropdownData.map(opt => opt.label) : ["No record found"]}
            value={
              dropdownData.find((opt) => opt.value === values[field.name])?.label || ""
            }
            onChange={(e) => {
              const selected = dropdownData.find((opt) => opt.label === e.target.value);
              setFieldValue(field.name, selected ? selected.value : "");
              console.log(`Selected ${field.name}:`, selected ? selected.value : "None");
            }}
            error={touched[field.name] && errors[field.name]}
            required={field.required}
            loading={
              (field.name.includes('OrganisationName') && dropdownOptions.organizations.length === 0) ||
              (field.name.includes('CityName') && dropdownOptions.cities.length === 0) ||
              (field.name.includes('BankName') && dropdownOptions.banks.length === 0) ||
              (field.name.includes('BranchName') && dropdownOptions.branches.length === 0)
            }
          />
          {touched[field.name] && errors[field.name] && (
            <span className={styles.Payment_Info_Section_payment_error_message}>{errors[field.name]}</span>
          )}
        </div>
      );
    } else {
      return (
        <div key={field.name} className={styles.Payment_Info_Section_payment_inputbox_wrapper}>
          <Inputbox
            id={field.name}
            name={field.name}
            label={field.label}
            type={field.type || "text"}
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={values[field.name] || ""}
            onChange={handleSectionChange}
            error={touched[field.name] && errors[field.name]}
            required={field.required}
          />
          {touched[field.name] && errors[field.name] && (
            <span className={styles.Payment_Info_Section_payment_error_message}>{errors[field.name]}</span>
          )}
        </div>
      );
    }
  };

  // Handle proceed to confirmation
  const handleProceedToConfirmation = async () => {
    try {
      setIsSubmitting(true);
      console.log("🚀 Proceeding to confirmation with form data:", values);
      
      // Validate the form before submitting
      const validationErrors = await validateForm();
      if (validationErrors && Object.keys(validationErrors).length > 0) {
        console.error("❌ Form validation failed:", validationErrors);
        setErrors(validationErrors);
        setTouched(Object.keys(validationErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        setIsSubmitting(false);
        return;
      }

      // Submit the form data to the database first
      console.log("📤 Submitting application sale data to database...");
      console.log("🔍 Form values being submitted:", JSON.stringify(values, null, 2));
      
      // Use the same transformation function as the Finish button
      const transformedData = transformFormDataToApiFormat(values);
      
      console.log("🔍 Transformed data for API:", JSON.stringify(transformedData, null, 2));
      
      const response = await apiService.submitAdmissionForm(transformedData);
      console.log("✅ Application sale data submitted successfully:", response);
      
      // Call the onContinue callback to navigate to confirmation page with proper route
      if (onContinue) {
        console.log("✅ Using onContinue callback for navigation");
        console.log("🔍 Backend response data:", response);
        // Pass the backend response data to the onContinue callback
        onContinue(response);
      } else {
        console.warn("⚠️ onContinue callback not provided, using fallback navigation");
        // Fallback navigation if onContinue is not provided
        navigate('/confirmation', { 
          state: { 
            applicationData: values,
            submissionResponse: response,
            fromPayment: true 
          } 
        });
      }
      
    } catch (error) {
      console.error("❌ Error submitting application sale data:", error);
      // You might want to show an error message to the user here
      alert("Failed to submit application data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.Payment_Info_Section_payment_info_section}>
      <div className={styles.Payment_Info_Section_payment_section_header}>
        <div className={styles.Payment_Info_Section_payment_header_content}>
          <div className={styles.Payment_Info_Section_payment_header_left}>
            {renderInput({ label: "Application Fee Pay Mode", name: "payMode", type: "custom", required: true })}
          </div>
          {selectedPaymentMode === "Credit/Debit Card" && (
            <div className={styles.Payment_Info_Section_payment_header_middle}>
              <div className={styles.Payment_Info_Section_payment_checkbox_group}>
                <label className={styles.squareCheckbox}>
                  <input
                    type="checkbox"
                    name="proCreditCard"
                    checked={values.proCreditCard}
                    onChange={handleChange}
                  />
                  <span className={styles.checkmark}></span>
                </label>
                <label
                  className={`${styles.Payment_Info_Section_payment_form_label} ${styles.Payment_Info_Section_payment_small_label}`}
                  htmlFor="proCreditCard"
                >
                  PRO Credit Card
                </label>
                {touched.proCreditCard && errors.proCreditCard && (
                  <span className={styles.Payment_Info_Section_payment_error_message}>
                    {errors.proCreditCard}
                  </span>
                )}
              </div>
              <div className={styles.Payment_Info_Section_payment_special_concession_block}>
                <h6 className={styles.Payment_Info_Section_payment_concession_value}>0</h6>
                <span className={styles.Payment_Info_Section_payment_concession_label}>Application Special Concession Value</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.Payment_Info_Section_payment_form_grid}>
        {getPaymentModeFields()
          .map((field) => renderInput(field))
          .reduce((rows, item, index) => {
            if (index % 3 === 0) rows.push([]);
            rows[rows.length - 1].push(item);
            return rows;
          }, [])
          .map((row, rowIndex) => (
            <div key={rowIndex} className={styles.Payment_Info_Section_payment_form_row}>
              {row}
              {row.length < 3 &&
                Array.from({ length: 3 - row.length }).map((_, padIndex) => (
                  <div key={`pad-${rowIndex}-${padIndex}`} className={styles.Payment_Info_Section_payment_empty_field}></div>
                ))}
            </div>
          ))}
      </div>
      <div className={styles.Payment_Info_Section_payment_form_actions} style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Button
          type="button"
          variant="secondary"
          buttonname="Back"
          lefticon={<BackArrow />}
          onClick={handleBack}
        />
        <Button
          type="submit"
          variant="primary"
          buttonname="Finish"
          righticon={<TrendingUpIcon />}
          disabled={finishDisabled}
        />
      </div>
      <a 
        href="#"
        className={styles.paymentLinkButton}
        onClick={(e) => {
          e.preventDefault(); // Prevent default link navigation
          if (!isSubmitting) {
            handleProceedToConfirmation();
          }
        }}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginTop:"10px"
        }}
      >
        <figure style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <img src={SkipIcon} alt="Skip" style={{ width: 24, height: 24 }} />
        </figure>
        {isSubmitting ? "Submitting..." : "Proceed to Confirmation"}
      </a>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
        position="bottom-center"
      />
    </div>
  );
};

PaymentInfoSection.validationSchema = validationSchema;

export default PaymentInfoSection;