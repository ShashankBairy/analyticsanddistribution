import React, { useMemo, useCallback, memo } from 'react';
import { Field } from 'formik';
import Inputbox from '../../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../../widgets/Dropdown/Dropdown';
import FormError from './FormError';
import { ReactComponent as PhoneIcon } from '../../../../../../assets/application-status/PhoneIcon.svg';
import { capitalizeWords } from '../../../../../../utils/textUtils';
import personalInfoStyles from '../PersonalInformation.module.css';

// Debug flag for conditional logging
const DEBUG = process.env.NODE_ENV === 'development';

const FieldRenderer = ({ 
  fields, 
  values, 
  handleChange, 
  handleBlur, 
  touched, 
  errors,
  admissionReferredByOptions,
  quotaOptions,
  admissionTypeOptions,
  genderOptions,
  authorizedByOptions,
  errorClassName,
  setFieldValue,
  isSubmitted,
  externalErrors,
  onClearFieldError
}) => {
  const getOptions = useCallback((optionsKey) => {
    const options = (() => {
      switch (optionsKey) {
        case "admissionReferredByOptions":
          return admissionReferredByOptions || [];
        case "quotaOptions":
          return quotaOptions || [];
        case "admissionTypeOptions":
          return admissionTypeOptions || [];
        case "genderOptions":
          return genderOptions || [];
        case "authorizedByOptions":
          return authorizedByOptions || [];
        case "employeeIdOptions":
          return authorizedByOptions || [];
        default:
          return [];
      }
    })();
    
    return options;
  }, [admissionReferredByOptions, quotaOptions, admissionTypeOptions, genderOptions, authorizedByOptions]);

  // Custom onChange handler for name fields with capitalization and number filtering - optimized with useCallback
  const handleNameFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Clear external error for this field when user starts typing
    if (onClearFieldError && externalErrors[name]) {
      onClearFieldError(name);
    }
    
    // Filter out numbers and special characters, only allow letters and spaces
    const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
    const capitalizedValue = capitalizeWords(filteredValue);
    
    // Use Formik's setFieldValue to update the field
    if (setFieldValue) {
      setFieldValue(name, capitalizedValue);
    } else {
      // Fallback to regular handleChange with filtered value
      handleChange({
        ...e,
        target: {
          ...e.target,
          value: capitalizedValue
        }
      });
    }
  }, [setFieldValue, handleChange, onClearFieldError, externalErrors]);

  // Custom onChange handler for number-only fields (Aapar, Aadhar, Phone)
  const handleNumberFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Clear external error for this field when user starts typing
    if (onClearFieldError && externalErrors[name]) {
      onClearFieldError(name);
    }
    
    // Filter out everything except numbers
    let filteredValue = value.replace(/[^0-9]/g, '');
    
    // Apply length limits based on field type
    if (name === 'aadharCardNo') {
      filteredValue = filteredValue.slice(0, 12); // Max 12 digits for Aadhar
    } else if (name === 'phoneNumber') {
      filteredValue = filteredValue.slice(0, 10); // Max 10 digits for Phone
    } else if (name === 'aaparNo') {
      filteredValue = filteredValue.slice(0, 20); // Max 20 digits for Aapar (reasonable limit)
    }
    
    // Use Formik's setFieldValue to update the field
    if (setFieldValue) {
      setFieldValue(name, filteredValue);
    } else {
      // Fallback to regular handleChange with filtered value
      handleChange({
        ...e,
        target: {
          ...e.target,
          value: filteredValue
        }
      });
    }
  }, [setFieldValue, handleChange, onClearFieldError, externalErrors]);

  const renderedFields = useMemo(() => {
    return fields.map((field) => {
      // Conditional visibility for Employee ID field (previously Admission Referred By)
      if (field.name === "employeeId") {
        // Check if the selected quota is "Staff children" by finding the quota option
        const selectedQuotaOption = quotaOptions.find(
          option => option.value === values.quota || option.label === values.quota
        );
        const isStaffChildSelected = selectedQuotaOption?.label === "Staff children" || values.quota === "Staff children";
        if (!isStaffChildSelected) {
          return null;
        }
      }

      // Conditional visibility for PRO Receipt No field
      if (field.name === "proReceiptNo") {
        // Check if the selected admission type is "with pro" by comparing with the label
        const selectedAdmissionTypeLabel = admissionTypeOptions.find(option => option.value === values.admissionType)?.label;
        const isWithProSelected = selectedAdmissionTypeLabel === "with pro" || selectedAdmissionTypeLabel === "With Pro"|| selectedAdmissionTypeLabel === "With pro";
        const category = localStorage.getItem("category");
        const isCollegeCategory = category === "COLLEGE";
        
        // Hide the field if "with pro" is not selected OR if category is COLLEGE
        if (!isWithProSelected || isCollegeCategory) {
          return null;
        }
      }

    return (
      <div key={field.id} >
       
        <Field name={field.name}>
          {({ field: fieldProps, meta }) => {
            const options = getOptions(field.options);
            const stringOptions = options.map(option => option.label || option.value);
            
            
            
            // Get the current selected option to display the label
            const selectedOption = options.find(option => option.value === values[field.name]);
            const displayValue = selectedOption ? selectedOption.label : values[field.name] || "";
            
            // Debug logging for admission type field
            if (field.name === 'admissionType') {
              console.log('🔍 FieldRenderer - admissionType field debug:');
              console.log('🔍 FieldRenderer - field.name:', field.name);
              console.log('🔍 FieldRenderer - values[field.name]:', values[field.name]);
              console.log('🔍 FieldRenderer - options:', options);
              console.log('🔍 FieldRenderer - selectedOption:', selectedOption);
              console.log('🔍 FieldRenderer - displayValue:', displayValue);
              console.log('🔍 FieldRenderer - stringOptions:', stringOptions);
            }
            
            // Custom onChange handler for dropdowns to store the value (ID) instead of label
            const handleDropdownChange = (e) => {
              const selectedLabel = e.target.value;
              console.log('🔍 Dropdown change - Field:', field.name, 'Selected label:', selectedLabel);
              console.log('🔍 Available options:', options);
              
              const selectedOption = options.find(option => option.label === selectedLabel);
              console.log('🔍 Found selected option:', selectedOption);
              
              // Clear external error for this field when user selects an option
              if (onClearFieldError && externalErrors[field.name]) {
                onClearFieldError(field.name);
              }
              
              if (selectedOption) {
                console.log('🔍 Storing value:', selectedOption.value, 'for field:', field.name);
                // Store the value (ID) instead of the label
                handleChange({
                  target: {
                    name: field.name,
                    value: selectedOption.value
                  }
                });
                
                // Also update Formik's field value directly to ensure it's properly tracked
                if (setFieldValue) {
                  setFieldValue(field.name, selectedOption.value);
                }
              } else {
                console.log('❌ No matching option found for label:', selectedLabel);
              }
            };
            
            // Special handling for name fields with capitalization
            const nameFields = ["firstName", "surname", "fatherName"];
            if (nameFields.includes(field.name)) {
              return (
                <Inputbox
                  label={field.label}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] || ""}
                  onChange={handleNameFieldChange}
                  onBlur={handleBlur}
                  type={field.type}
                  error={meta.touched && meta.error}
                  required={field.required}
                />
              );
            }

            // Special handling for number-only fields
            const numberFields = ["aaparNo", "aadharCardNo", "phoneNumber"];
            if (numberFields.includes(field.name)) {
              // Phone number has special styling with icon
              if (field.name === "phoneNumber") {
                return (
                  <div className={personalInfoStyles.phone_icon_wrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={values[field.name] || ""}
                      onChange={handleNumberFieldChange}
                      onBlur={handleBlur}
                      type={field.type}
                      error={meta.touched && meta.error}
                      required={field.required}
                    />
                    <PhoneIcon className={personalInfoStyles.phone_icon} />
                  </div>
                );
              }
              
              return (
                <Inputbox
                  label={field.label}
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] || ""}
                  onChange={handleNumberFieldChange}
                  onBlur={handleBlur}
                  type={field.type}
                  error={meta.touched && meta.error}
                  required={field.required}
                />
              );
            }
            
            return field.type === "dropdown" ? (
              <Dropdown
                dropdownname={field.label}
                id={field.id}
                name={field.name}
                value={displayValue}
                onChange={handleDropdownChange}
                results={stringOptions}
                required={field.required}
                disabled={false}
                dropdownsearch={true}
              />
            ) : (
              <Inputbox
                label={field.label}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                type={field.type}
                error={meta.touched && meta.error}
                required={field.required}
              />
            );
          }}
        </Field>
        <FormError
          name={field.name}
          touched={touched}
          errors={errors}
          className={errorClassName}
          showOnChange={false}
          isSubmitted={isSubmitted}
          externalErrors={externalErrors}
        />
      </div>
    );
    });
  }, [fields, values, handleChange, handleBlur, touched, errors, admissionReferredByOptions, quotaOptions, admissionTypeOptions, genderOptions, authorizedByOptions, errorClassName, setFieldValue, isSubmitted, externalErrors, onClearFieldError]);

  return renderedFields;
};

export default React.memo(FieldRenderer);
