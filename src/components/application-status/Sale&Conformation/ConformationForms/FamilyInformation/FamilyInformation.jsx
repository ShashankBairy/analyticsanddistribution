import React, { useState, useEffect, useRef } from "react";
import { Formik } from 'formik';
import Inputbox from "../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../widgets/Dropdown/Dropdown";
import { ReactComponent as EmailIcon } from "../../../../../assets/application-status/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "../../../../../assets/application-status/PhoneIcon.svg";
import { capitalizeWords } from "../../../../../utils/textUtils";
import { useSectors, useOccupations } from "../hooks/useConfirmationData";

import FormError from "./components/FormError";
import Snackbar from "../../../../../widgets/Snackbar/Snackbar";
import styles from "./FamilyInformation.module.css";

const FamilyInformation = ({ formData = {}, onSuccess, externalErrors = {}, onClearFieldError, profileData = null }) => {
  
  // Fetch sectors and occupations data using custom hooks
  const { sectors, loading: sectorsLoading, error: sectorsError } = useSectors();
  const { occupations, loading: occupationsLoading, error: occupationsError } = useOccupations();
  
  // Snackbar state for validation errors
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
    duration: 4000
  });

  // Show snackbar helper function
  const showSnackbar = (message, severity = 'error', duration = 4000) => {
    setSnackbar({
      open: true,
      message,
      severity,
      duration
    });
  };

  // Close snackbar helper function
  const closeSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Validation disabled (schema removed as requested)
  const customValidate = async () => {
    return {};
  };

  // Debounced callback to parent
  const debouncedCallback = useRef(null);
  
  // Update parent callback with debouncing
  const updateParentCallback = (values) => {
    if (debouncedCallback.current) {
      clearTimeout(debouncedCallback.current);
    }
    debouncedCallback.current = setTimeout(() => {
      if (onSuccess && Object.keys(values).length > 0) {
        onSuccess(values);
      }
    }, 100);
  };
  
  // Initial form values
  const initialValues = {
    fatherName: formData.fatherName || profileData?.parentInfo?.fatherName || "",
    fatherPhoneNumber: formData.fatherPhoneNumber || (profileData?.parentInfo?.phoneNumber != null ? String(profileData.parentInfo.phoneNumber) : ""),
    fatherEmail: formData.fatherEmail || "",
    fatherSector: formData.fatherSector || "",
    fatherSectorId: formData.fatherSectorId || "", // Store sector ID for backend
    fatherOccupation: formData.fatherOccupation || "",
    fatherOccupationId: formData.fatherOccupationId || "", // Store occupation ID for backend
    fatherOtherOccupation: formData.fatherOtherOccupation || "",
    motherName: formData.motherName || "",
    motherPhoneNumber: formData.motherPhoneNumber || "",
    motherEmail: formData.motherEmail || "",
    motherSector: formData.motherSector || "",
    motherSectorId: formData.motherSectorId || "", // Store sector ID for backend
    motherOccupation: formData.motherOccupation || "",
    motherOccupationId: formData.motherOccupationId || "", // Store occupation ID for backend
    motherOtherOccupation: formData.motherOtherOccupation || "",
  };

  // Handle input changes with validation
  const handleChange = (e, setFieldValue, values) => {
    const { name, value } = e.target;
    
    // Clear external error if it exists
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
    
    // Capitalize name fields
    const nameFields = ["fatherName", "motherName"];
    const processedValue = nameFields.includes(name) ? capitalizeWords(value) : value;
    
    // Handle sector selection - store both label and ID
    if (name === "fatherSector" || name === "motherSector") {
      const selectedSector = sectors.find(sector => sector.label === value);
      const sectorId = selectedSector ? selectedSector.id : "";
      
      setFieldValue(name, processedValue);
      setFieldValue(`${name}Id`, sectorId); // Store the ID for backend
      
      // Clear occupation when sector changes to "Other" or "Others"
      const lowerSector = processedValue.toLowerCase();
      if (lowerSector.includes("other")) {
        const occupationFieldName = name.replace("Sector", "Occupation");
        setFieldValue(occupationFieldName, "");
      }
    } else if (name === "fatherOccupation" || name === "motherOccupation") {
      const selectedOccupation = occupations.find(occupation => occupation.label === value);
      const occupationId = selectedOccupation ? selectedOccupation.id : "";
      
      setFieldValue(name, processedValue);
      setFieldValue(`${name}Id`, occupationId); // Store the ID for backend
    } else {
      setFieldValue(name, processedValue);
    }
  };

  // Handle name field changes with filtering
  const handleNameFieldChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    
    // Clear external error if it exists
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
    
    // Filter out numbers and special characters, keep only letters and spaces
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    const capitalizedValue = capitalizeWords(filteredValue);
    setFieldValue(name, capitalizedValue);
  };

  // Handle phone number changes with filtering
  const handlePhoneFieldChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    
    // Clear external error if it exists
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
    
    // Filter out non-numeric characters and limit to 10 digits
    const filteredValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    setFieldValue(name, filteredValue);
  };

  // Handle email field changes
  const handleEmailFieldChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    
    // Clear external error if it exists
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
    
    setFieldValue(name, value);
  };

  // Handle other occupation field changes
  const handleOtherOccupationChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    
    // Clear external error if it exists
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
    
    // Filter out special characters, keep letters, numbers, spaces, and common punctuation
    const filteredValue = value.replace(/[^a-zA-Z0-9\s\-.,]/g, '');
    setFieldValue(name, filteredValue);
  };
  
  // Occupation options for dropdown - now fetched from API
  const occupationOptions = occupations.map(occupation => occupation.label);
  
  // Filter occupation options to show only "Others" when sector is "Other" or "Others"
  const getFilteredOccupationOptions = (sectorValue) => {
    if (!sectorValue) return occupationOptions;
    const lowerSector = sectorValue.toLowerCase();
    if (lowerSector.includes("other")) {
      return ["Others"];
    }
    return occupationOptions;
  };

  // Sector options for dropdown - now fetched from API
  const sectorOptions = sectors.map(sector => sector.label);

  // Helper function to get father fields with dynamic occupation options
  const getFatherFields = (values) => [
    { label: "Father Name", name: "fatherName", placeholder: "Enter Father Name", type: "input", required: true },
   
    { label: "Phone Number", name: "fatherPhoneNumber", placeholder: "Enter Phone Number",type: "input", required: true },
    { label: "Email Id", name: "fatherEmail", placeholder: "Enter Father Mail id", type: "Email" },
    {label: "Sector", name: "fatherSector", placeholder: "Select Sector", type: "dropdown", options: sectorOptions },
    { label: "Occupation", name: "fatherOccupation", placeholder: "Select Occupation", type: "dropdown", options: getFilteredOccupationOptions(values.fatherSector) },
    { label: "Other Occupation", name: "fatherOtherOccupation", placeholder: "Enter Other Occupation", type: "input", required: false },
  ];

  // Helper function to get mother fields with dynamic occupation options
  const getMotherFields = (values) => [
    { label: "Mother Name", name: "motherName", placeholder: "Enter Mother Name", type: "input", required: true },
   
    { label: "Phone Number", name: "motherPhoneNumber", placeholder: "Enter Phone Number", type: "input", required: true },
    { label: "Email Id", name: "motherEmail", placeholder: "Enter Mother Mail id", type: "Email" },
    { label: "Sector", name: "motherSector", placeholder: "Select Sector", type: "dropdown", options: sectorOptions },
    { label: "Occupation", name: "motherOccupation", placeholder: "Select Occupation", type: "dropdown", options: getFilteredOccupationOptions(values.motherSector) },
    { label: "Other Occupation", name: "motherOtherOccupation", placeholder: "Enter Other Occupation", type: "input", required: false },
  ];

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={customValidate}
        validateOnBlur={true}
        validateOnChange={true}
        onSubmit={(values) => {
          console.log('Family Information form submitted:', values);
          // Call onSuccess with the form values
          if (onSuccess) {
            onSuccess(values);
          }
        }}
      >
      {({ values, errors, touched, setFieldValue, handleBlur }) => {
        // Update parent callback with debouncing
        updateParentCallback(values);

        return (
          <>
            {/* Father Information */}
            <div className={styles.family_info_section_general_form_row}>
              <div className={`${styles.family_info_section_general_sibling_container} ${styles.family_info_section_general_full_width}`}>
                <div className={styles.family_info_section_general_field_label_wrapper}>
                  <span className={styles.family_info_section_general_field_label}>Parent Information</span>
                  <div className={styles.family_info_section_general_line}></div>
                </div>
                <div className={styles.family_info_section_general_form_grid}>
                  {getFatherFields(values).map((field, index) => {
                    // Conditional visibility for Other Occupation field
                    if (field.name === "fatherOtherOccupation") {
                      const selectedOccupation = values.fatherOccupation?.toLowerCase() || "";
                      const isOtherSelected = selectedOccupation.includes("other");
                      if (!isOtherSelected) {
                        return null; // Hide the field if "Other" is not selected
                      }
                    }

                    return (
                      <div key={index} className={styles.family_info_section_general_form_field}>
                        {field.name === "fatherPhoneNumber" ? (
                        <>
                          <div className={styles.inputWithIconWrapper}>
                            <Inputbox
                              label={field.label}
                              id={field.name}
                              name={field.name}
                              placeholder={field.placeholder}
                              value={values[field.name] || ""}
                              onChange={(e) => handlePhoneFieldChange(e, setFieldValue)}
                              onBlur={handleBlur}
                              required={field.required}
                              type={field.type || "text"}
                            />
                            <PhoneIcon className={styles.inputWithIcon} />
                          </div>
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </>
                      ) : field.name === "fatherEmail" ? (
                        <div className={styles.inputWithIconWrapper}>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleEmailFieldChange(e, setFieldValue)}
                            onBlur={handleBlur}
                            required={field.required}
                            type={field.type || "text"}
                          />
                          <EmailIcon className={styles.inputWithIcon} />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      ) : field.type === "dropdown" ? (
                        <div>
                          <Dropdown
                            dropdownname={field.label}
                            id={field.name}
                            name={field.name}
                            value={values[field.name] || ""}
                            onChange={(e) => handleChange(e, setFieldValue, values)}
                            onBlur={handleBlur}
                            results={field.options}
                            required={field.required}
                            dropdownsearch={true}
                            disabled={sectorsLoading || occupationsLoading}
                            placeholder={
                              (sectorsLoading || occupationsLoading) 
                                ? "Loading..." 
                                : field.placeholder
                            }
                          />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      ) : field.name === "fatherName" ? (
                        <div>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleNameFieldChange(e, setFieldValue)}
                            onBlur={handleBlur}
                            type={field.type || "text"}
                            required={field.required}
                          />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      ) : field.name === "fatherOtherOccupation" ? (
                        <div>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleOtherOccupationChange(e, setFieldValue)}
                            onBlur={handleBlur}
                            type={field.type || "text"}
                            required={field.required}
                          />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      ) : (
                        <div>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleChange(e, setFieldValue, values)}
                            onBlur={handleBlur}
                            type={field.type || "text"}
                            required={field.required}
                          />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Spacing between Father and Mother Information */}
            <div style={{ marginTop: "20px" }}></div>

            {/* Mother Information */}
            <div className={styles.family_info_section_general_form_row}>
              <div className={`${styles.family_info_section_general_sibling_container} ${styles.family_info_section_general_full_width}`}>
                <div className={styles.family_info_section_general_form_grid}>
                  {getMotherFields(values).map((field, index) => {
                    // Conditional visibility for Other Occupation field
                    if (field.name === "motherOtherOccupation") {
                      const selectedOccupation = values.motherOccupation?.toLowerCase() || "";
                      const isOtherSelected = selectedOccupation.includes("other");
                      if (!isOtherSelected) {
                        return null; // Hide the field if "Other" is not selected
                      }
                    }

                    return (
                    <div key={index} className={styles.family_info_section_general_form_field}>
                      {field.name === "motherPhoneNumber" ? (
                        <>
                          <div className={styles.inputWithIconWrapper}>
                            <Inputbox
                              label={field.label}
                              id={field.name}
                              name={field.name}
                              placeholder={field.placeholder}
                              value={values[field.name] || ""}
                              onChange={(e) => handlePhoneFieldChange(e, setFieldValue)}
                              onBlur={handleBlur}
                              required={field.required}
                              type={field.type || "text"}
                            />
                            <PhoneIcon className={styles.inputWithIcon} />
                          </div>
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </>
                      ) : field.name === "motherEmail" ? (
                        <div className={styles.inputWithIconWrapper}>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleEmailFieldChange(e, setFieldValue)}
                            onBlur={handleBlur}
                            required={field.required}
                            type={field.type || "text"}
                          />
                          <EmailIcon className={styles.inputWithIcon} />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      ) : field.type === "dropdown" ? (
                        <div>
                          <Dropdown
                            dropdownname={field.label}
                            id={field.name}
                            name={field.name}
                            value={values[field.name] || ""}
                            onChange={(e) => handleChange(e, setFieldValue, values)}
                            onBlur={handleBlur}
                            results={field.options}
                            required={field.required}
                            dropdownsearch={true}
                            disabled={sectorsLoading || occupationsLoading}
                            placeholder={
                              (sectorsLoading || occupationsLoading) 
                                ? "Loading..." 
                                : field.placeholder
                            }
                          />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      ) : field.name === "motherName" ? (
                        <div>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleNameFieldChange(e, setFieldValue)}
                            onBlur={handleBlur}
                            type={field.type || "text"}
                            required={field.required}
                          />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      ) : field.name === "motherOtherOccupation" ? (
                        <div>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleOtherOccupationChange(e, setFieldValue)}
                            onBlur={handleBlur}
                            type={field.type || "text"}
                            required={field.required}
                          />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      ) : (
                        <div>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleChange(e, setFieldValue, values)}
                            onBlur={handleBlur}
                            type={field.type || "text"}
                            required={field.required}
                          />
                          <FormError 
                            error={errors[field.name]} 
                            touched={touched[field.name]} 
                            externalErrors={externalErrors}
                            name={field.name}
                          />
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        );
      }}
      </Formik>
      
      {/* Snackbar for validation errors */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        duration={snackbar.duration}
        position="top-right"
        transition="slideRightToLeft"
        animation="fadeIn"
        width="50%"
        onClose={closeSnackbar}
      />
    </>
  );
};

export default FamilyInformation;
