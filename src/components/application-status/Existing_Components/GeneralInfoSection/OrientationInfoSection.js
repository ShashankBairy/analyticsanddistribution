import { useEffect, useState } from "react";
import Inputbox from "../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../widgets/Dropdown/Dropdown";
import Asterisk from "../../../../assets/application-status/Asterisk";
import styles from "./GeneralInfoSection.module.css";

const OrientationInfoSection = ({
  values,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  handleSectionChange,
  shouldShowError,
  getFieldError,
  dropdownOptions,
  loadingStates,
  capitalizeText,
  formatDateForDisplay
}) => {
  const orientationFields = [
    { label: "Student Type", name: "studentType", type: "select", options: dropdownOptions.studentTypes, required: true },
    { label: "Date of Birth", name: "dob", type: "date", required: true },
    { label: "Gender", name: "gender", type: "radio", options: dropdownOptions.genders, required: true },
    { label: "Joined Campus/Branch", name: "joinedCampus", type: "select", options: dropdownOptions.campuses, required: true },
    { label: "Joining Class", name: "joiningClassName", type: "select", options: dropdownOptions.joiningClasses, required: true },
    { label: "Batch Type", name: "batchType", type: "select", options: dropdownOptions.batchTypes, required: true },
    { label: "Orientation Name", name: "orientationName", type: "select", options: dropdownOptions.orientationNames, required: true },
    { label: "Orientation Batch", name: "orientationBatch", type: "select", options: dropdownOptions.orientationBatchesCascading, required: true },
    { label: "Orientation Dates", name: "orientationDates", type: "date", required: true, readOnly: true, placeholder: "Auto-populated from batch selection" },
    { label: "Orientation Fee", name: "OrientationFee", placeholder: "Auto-populated from batch selection", readOnly: true },
    { label: "School State", name: "schoolState", type: "select", options: dropdownOptions.schoolStates, required: true },
    { label: "School District", name: "schoolDistrict", type: "select", options: dropdownOptions.schoolDistricts, required: true },
    { label: "School Type", name: "schoolType", type: "select", options: dropdownOptions.schoolTypes, required: true },
    { label: "School Name", name: "schoolName", placeholder: "Enter School Name" },
    { label: "Additional Orientation Fee", name: "additionalOrientationFee", placeholder: "Enter Fee Details" },
    { label: "Score App No", name: "scoreAppNo", placeholder: "Enter Score App No" },
    { label: "Marks", name: "marks", placeholder: "Enter Marks Details" },
    { label: "Admission Referred By", name: "admissionReferredBy", placeholder: "Enter Name" },
    { label: "Quota", name: "quota", type: "select", options: dropdownOptions.quotas },
  ];

  const renderFieldRows = (fields) => {
    const jsxRows = [];
    for (let i = 0; i < fields.length; i += 3) {
      const row = fields.slice(i, i + 3);
      jsxRows.push(
        <div key={i} className={styles.General_Info_Section_general_form_row}>
          {row.map((field, index) => {
            const options = field.options || [];
            if (field.type === "select") {
              // Determine which dropdown is loading based on field name
              const getLoadingState = (fieldName) => {
                const fieldToLoadingMap = {
                  'studentType': 'studentTypes',
                  'joinedCampus': 'campuses',
                  'joiningClassName': 'joiningClasses',
                  'batchType': 'batchTypes',
                  'orientationName': 'orientationNames',
                  'orientationBatch': 'orientationBatchesCascading',
                  'schoolState': 'schoolStates',
                  'schoolDistrict': 'schoolDistricts',
                  'schoolType': 'schoolTypes',
                  'quota': 'quotas',
                };
                return loadingStates[fieldToLoadingMap[fieldName]] || false;
              };

              const isDropdownLoading = getLoadingState(field.name);

              // Debug logging for dropdown rendering
              if (field.name === "joiningClassName" || field.name === "orientationName" || field.name === "orientationBatch" || field.name === "schoolState" || field.name === "schoolDistrict") {
                console.log(`🔍 Rendering dropdown for ${field.name}:`, {
                  options: options,
                  mappedOptions: options.map((opt) => opt.label || opt),
                  currentValue: values[field.name],
                  selectedOption: options.find((opt) => opt.id === values[field.name]),
                  isLoading: isDropdownLoading,
                  resultsLength: options.length,
                  disabled: isDropdownLoading,
                  fieldName: field.name,
                  fieldLabel: field.label
                });
              
                // Special debugging for school district dropdown
                if (field.name === "schoolDistrict") {
                  console.log("🔍 School District Dropdown Details:", {
                    hasOptions: options.length > 0,
                    optionsData: options,
                    isDisabled: isDropdownLoading,
                    currentValue: values[field.name],
                    loadingState: loadingStates.schoolDistricts,
                    fieldName: field.name,
                    fieldType: field.type,
                    fieldRequired: field.required
                  });
                 
                  // Check if dropdown should be disabled
                  if (isDropdownLoading) {
                    console.log("⚠️ School District dropdown is DISABLED due to loading state");
                  } else if (options.length === 0) {
                    console.log("⚠️ School District dropdown has NO OPTIONS");
                  } else {
                    console.log("✅ School District dropdown should be ENABLED and clickable");
                  }
                }
              }

              return (
                <div key={index} className={styles.General_Info_Section_general_form_field}>
                  <Dropdown
                    dropdownname={field.label}
                    name={field.name}
                    results={Array.isArray(options) ? options.map((opt) => {
                      if (typeof opt === 'string') return opt;
                      if (typeof opt === 'object' && opt !== null) {
                        return opt.label || opt.name || opt.value || opt.text || JSON.stringify(opt);
                      }
                      return String(opt);
                    }) : []}
                    value={Array.isArray(options) ? (options.find((opt) => opt.id === values[field.name])?.label || "") : ""}
                    onChange={(e) => {
                      console.log(`🎯 Dropdown ${field.name} onChange triggered:`, e);
                      handleSectionChange(e);
                    }}
                    error={shouldShowError(field.name)}
                    required={field.required}
                    disabled={isDropdownLoading}
                    loading={isDropdownLoading}
                  />
                  {shouldShowError(field.name) && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError(field.name)}
                    </div>
                  )}
                </div>
              );
            } else if (field.type === "radio" && field.name === "gender") {
              return (
                <div key={index} className={styles.General_Info_Section_general_gender_container}>
                  <div className={styles.General_Info_Section_general_field_label_wrapper}>
                    <span className={styles.General_Info_Section_general_field_label}>
                      {field.label}
                      {field.required && <Asterisk style={{ marginLeft: "4px" }} />}
                    </span>
                  </div>
                  <div className={styles.General_Info_Section_general_gender_options}>
                    {options.map((option, i) => (
                      <label key={i} className={styles.General_Info_Section_general_gender_label_wrapper}>
                        <input
                          type="radio"
                          name={field.name}
                          value={option.label}
                          checked={values[field.name] === option.id}
                          onChange={() => {
                            setFieldValue(field.name, option.id);
                            setFieldTouched(field.name, true);
                          }}
                          className={styles.General_Info_Section_general_gender_radio}
                        />
                        <span
                          className={`${styles.General_Info_Section_general_gender_label} ${
                            values[field.name] === option.id ? styles.General_Info_Section_general_gender_active : ""
                          }`}
                          onClick={() => {
                            setFieldValue(field.name, option.id);
                            setFieldTouched(field.name, true);
                          }}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {shouldShowError(field.name) && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError(field.name)}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <div key={index} className={styles.General_Info_Section_general_form_field}>
                  <Inputbox
                    label={field.label}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={field.type === "date" ? formatDateForDisplay(values[field.name], field.name) : values[field.name] || ""}
                    onChange={field.readOnly ? undefined : handleSectionChange}
                    required={field.required}
                    type={field.type || "text"}
                    error={shouldShowError(field.name)}
                    disabled={field.disabled || field.readOnly || false}
                    readOnly={field.readOnly || false}
                  />
                  {shouldShowError(field.name) && (
                    <div className={styles.General_Info_Section_general_error}>
                      {getFieldError(field.name)}
                    </div>
                  )}
                </div>
              );
            }
          })}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }, (_, padIndex) => (
              <div key={`pad-${i}-${padIndex}`} className={styles.General_Info_Section_general_empty_field}></div>
            ))}
        </div>
      );
    }
    return jsxRows;
  };

  return (
    <div className={styles.General_Info_Section_general_form_row}>
      <div className={`${styles.General_Info_Section_general_sibling_container} ${styles.General_Info_Section_general_full_width}`}>
        <div className={styles.General_Info_Section_general_field_label_wrapper}>
          <span className={styles.General_Info_Section_general_field_label}>Orientation Information</span>
          <div className={styles.General_Info_Section_general_line}></div>
        </div>
        <div className={styles.General_Info_Section_general_form_grid}>
          {renderFieldRows(orientationFields)}
        </div>
      </div>
    </div>
  );
};

export default OrientationInfoSection;
