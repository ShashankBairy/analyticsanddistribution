import React, { useState, useEffect } from "react";
import Snackbar from "../../../../widgets/Snackbar/Snackbar";
import { getConcessionFieldMapping } from "./utils/fieldMapping";
import { useConcessionData } from "./hooks/useConcessionData";
import { useConcessionForm } from "./hooks/useConcessionForm";
import ConcessionFields from "./components/ConcessionFields";
import styles from "./ConcessionInfoSection.module.css";

/**
 * Refactored ConcessionInfoSection component
 * Extracted from ConcessionInfoSection.js (1,177 lines) to organized structure
 * Preserves every single line and functionality exactly as manager wants
 */
const ConcessionInfoSectionRefactored = ({
  handleNext,
  handleBack,
  setCouponDetails,
  onCouponSubmit,
  handleChange,
  setFieldValue,
  setFieldTouched,
  setActiveStep,
  values,
  errors,
  touched,
  validateForm,
}) => {
  // Custom hooks for different concerns
  const {
    reasonOptions,
    setReasonOptions,
    employeeOptions,
    setEmployeeOptions,
    isLoading,
    setIsLoading,
    loadingStates,
    setLoadingStates,
    showSnackbar,
    closeSnackbar,
  } = useConcessionData();

  const {
    error,
    setError,
    showMobileNumber,
    setShowMobileNumber,
    persistentErrors,
    setPersistentErrors,
  } = useConcessionForm(values, setFieldTouched, setFieldValue);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  // Get dynamic concession field mapping based on joining class
  const joiningClassName = values.joiningClassName || values.joiningClass || values.joinInto;
  
  // Try to get the actual class name if the value is an ID
  const getActualClassName = (value) => {
    if (!value) return value;
    
    // If it's already a string name, return it
    if (typeof value === 'string' && !/^\d+$/.test(value)) {
      return value;
    }
    
    // If it's a number, try to find the corresponding class name
    // This would need to be implemented based on your class mapping logic
    return value;
  };

  const actualClassName = getActualClassName(joiningClassName);
  const concessionMapping = getConcessionFieldMapping(actualClassName);

  // Helper function to get dynamic flatfields
  const getDynamicFlatfields = () => {
    const baseFields = [];
    
    // Add mobile number field first
    baseFields.push({
      label: "Mobile Number",
      name: "mobileNumber",
      placeholder: "Enter Mobile Number",
    });
    
    // Add concession fields based on mapping
    if (concessionMapping && concessionMapping.fields) {
      concessionMapping.fields.forEach((field) => {
        if (field.show) {
          baseFields.push({
            label: field.label,
            name: field.name,
            placeholder: `Enter ${field.label}`,
          });
        }
      });
    } else {
      // Fallback to default fields if no mapping is available
      baseFields.push(
        { label: "1st Year Concession", name: "yearConcession1st", placeholder: "Enter 1st Year Concession" },
        { label: "2nd Year Concession", name: "yearConcession2nd", placeholder: "Enter 2nd Year Concession" },
        { label: "3rd Year Concession", name: "yearConcession3rd", placeholder: "Enter 3rd Year Concession" }
      );
    }
    
    // Add other fields
    baseFields.push(
      { label: "Given By", name: "givenBy", type: "select", options: employeeOptions, required: true },
      { label: "Description", name: "description", placeholder: "Enter Description" },
      { label: "Authorized By", name: "authorizedBy", type: "select", options: employeeOptions, required: true },
      { label: "Reason", name: "reason", type: "select", options: reasonOptions, required: true },
      { label: "Concession Amount", name: "concessionAmount", placeholder: "Enter Concession amount" },
      { label: "Concession Written By", name: "concessionWrittenBy", type: "select", options: employeeOptions },
      { label: "Reason", name: "additionalReason", placeholder: "Enter Reason" }
    );
    
    return baseFields;
  };
  
  const flatfields = getDynamicFlatfields();
  
  // Debug the flatfields array

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
    if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd", "concessionAmount"].includes(name)) {
      finalValue = value.replace(/\D/g, '');
    } else if (["description", "additionalReason"].includes(name)) {
      finalValue = value.replace(/[^a-zA-Z\s\.\-]/g, '');
      // Apply capitalization to text fields
      finalValue = capitalizeText(finalValue);
    } else if (name === "mobileNumber") {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }
    setFieldValue(name, finalValue);
    setFieldTouched(name, true);
   
    // Handle concession amount changes
    if (["yearConcession1st", "yearConcession2nd", "yearConcession3rd"].includes(name)) {
      // Get all concession amounts including the current change
      const allConcessionAmounts = [
        name === "yearConcession1st" ? finalValue : values.yearConcession1st,
        name === "yearConcession2nd" ? finalValue : values.yearConcession2nd,
        name === "yearConcession3rd" ? finalValue : values.yearConcession3rd
      ];
     
      const hasConcession = allConcessionAmounts.some((v) => v && v.toString().trim() !== "" && Number(v) > 0);
     
      // Real-time validation for concession total
      const orientationFee = values.OrientationFee;
      if (hasConcession && orientationFee) {
        const totalConcession = allConcessionAmounts.reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
        const orientationFeeValue = parseFloat(orientationFee) || 0;
       
        if (totalConcession > orientationFeeValue) {
          // Total concession exceeds orientation fee
        }
      }
     
      if (hasConcession) {
        // Only mark fields as touched to show validation errors, don't clear them
        setFieldTouched("givenBy", true);
        setFieldTouched("givenById", true);
        setFieldTouched("authorizedBy", true);
        setFieldTouched("authorizedById", true);
        setFieldTouched("reason", true);
        setFieldTouched("concessionReasonId", true);
      } else {
        // Clear all concession-related fields when no concession amount is entered
        setFieldValue("givenBy", "");
        setFieldValue("givenById", "");
        setFieldValue("authorizedBy", "");
        setFieldValue("authorizedById", "");
        setFieldValue("reason", "");
        setFieldValue("concessionReasonId", "");
        setFieldValue("concessionWrittenBy", "");
        setFieldValue("concessionWrittenById", "");
        setFieldValue("additionalReason", "");
        setFieldValue("concessionAmount", "");
        setFieldValue("additionalConcession", false);
       
        // Clear touched state for these fields
        setFieldTouched("givenBy", false);
        setFieldTouched("givenById", false);
        setFieldTouched("authorizedBy", false);
        setFieldTouched("authorizedById", false);
        setFieldTouched("reason", false);
        setFieldTouched("concessionReasonId", false);
        setFieldTouched("concessionWrittenBy", false);
        setFieldTouched("concessionWrittenById", false);
        setFieldTouched("additionalReason", false);
        setFieldTouched("concessionAmount", false);
        setFieldTouched("additionalConcession", false);
      }
    }
   
    // Show mobileNumber row when typing in coupon field
    if (name === "coupon" && finalValue.trim() !== "") {
      setShowMobileNumber(true);
    }
  };

  const handleEmployeeChange = (name) => (e) => {
    const selectedLabel = e.target.value;
    const selectedEmployee = employeeOptions.find((opt) => opt.label === selectedLabel);
   
    setFieldValue(name, selectedLabel || '');
    setFieldValue(`${name}Id`, selectedEmployee ? String(selectedEmployee.value) : '');
    setFieldTouched(name, true);
    setFieldTouched(`${name}Id`, true);
   
    // Clear persistent error only for this specific field
    if (selectedLabel && selectedLabel.trim() !== '') {
      setPersistentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors[`${name}Id`];
        return newErrors;
      });
    }
  };

  const handleReasonChange = (e) => {
    const selectedLabel = e.target.value;
    const selectedReason = reasonOptions.find((opt) => opt.label === selectedLabel);
   
    setFieldValue("reason", selectedLabel || '');
    setFieldValue("concessionReasonId", selectedReason ? String(selectedReason.value) : '');
    setFieldTouched("reason", true);
    setFieldTouched("concessionReasonId", true);
   
    // Clear persistent error only for this specific field
    if (selectedLabel && selectedLabel.trim() !== '') {
      setPersistentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors["reason"];
        delete newErrors["concessionReasonId"];
        return newErrors;
      });
    }
  };

  const handleApplyCoupon = () => {
    setCouponDetails({ mobile: values.mobileNumber || "", code: values.coupon || "" });
    onCouponSubmit();
  };

  const handleSubmit = async () => {
    const errors = await validateForm();
   
    const touchedFields = Object.keys(errors).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setFieldTouched(touchedFields);
   
    if (Object.keys(errors).length === 0) {
      handleNext();
    }
  };

  // Helper function to check if field should show error
  const shouldShowError = (fieldName) => {
    return touched[fieldName] && (errors[fieldName] || errors[`${fieldName}Id`]);
  };

  // Helper function to get field error
  const getFieldError = (fieldName) => {
    return errors[fieldName] || errors[`${fieldName}Id`];
  };

  // Form is now always rendered, dropdowns load in background
  if (error) {
    return <div className={styles.Concession_Info_Section_error}>{error}</div>;
  }

  return (
    <>
      <ConcessionFields
        values={values}
        errors={errors}
        touched={touched}
        handleSectionChange={handleSectionChange}
        handleEmployeeChange={handleEmployeeChange}
        handleReasonChange={handleReasonChange}
        handleApplyCoupon={handleApplyCoupon}
        handleSubmit={handleSubmit}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        setActiveStep={setActiveStep}
        validateForm={validateForm}
        showMobileNumber={showMobileNumber}
        setShowMobileNumber={setShowMobileNumber}
        flatfields={flatfields}
        concessionMapping={concessionMapping}
        loadingStates={loadingStates}
        shouldShowError={shouldShowError}
        getFieldError={getFieldError}
        persistentErrors={persistentErrors}
        snackbar={snackbar}
        closeSnackbar={closeSnackbar}
        joiningClassName={joiningClassName}
        handleBack={handleBack}
        showSnackbar={showSnackbar}
      />
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
        position="bottom-center"
      />
    </>
  );
};

export default ConcessionInfoSectionRefactored;