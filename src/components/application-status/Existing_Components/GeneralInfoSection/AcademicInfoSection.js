import { useEffect, useState } from "react";
import Inputbox from "../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../widgets/Dropdown/Dropdown";
import styles from "./GeneralInfoSection.module.css";

const AcademicInfoSection = ({
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
  capitalizeText
}) => {
  const beforeAppSaleFields = [
    { label: "HT No", name: "htNo", placeholder: "Enter Hall Ticket No" },
    { label: "Aadhar Card No", name: "aadhar", placeholder: "Enter Aaadhar Number", required: true },
    { label: "Aapar Number", name: "aapar", placeholder: "Enter Apaar Number" },
    { label: "Religion", name: "religion", type: "select", options: dropdownOptions.religions },
    { label: "Caste", name: "caste", type: "select", options: dropdownOptions.castes },
    { label: "Blood Group", name: "bloodGroup", type: "select", options: dropdownOptions.bloodGroups },
    { label: "Admission Type", name: "admissionType", type: "select", options: dropdownOptions.appTypes, required: true },
    { label: "Application Fee", name: "applicationFee", placeholder: "Enter Application Fee amount" },
  ];

  const renderFieldRows = (fields) => {
    const jsxRows = [];
    for (let i = 0; i < fields.length; i += 3) {
      const row = fields.slice(i, i + 3);
      jsxRows.push(
        <div key={i} className={styles.General_Info_Section_general_form_row}>
          {row.map((field, index) => {
            const options = field.options || [];
            
            // Debug religion field specifically
            if (field.name === 'religion') {
              console.log("🔍 === RELIGION FIELD DEBUG ===");
              console.log("🔍 Field:", field);
              console.log("🔍 Options:", options);
              console.log("🔍 Options type:", typeof options);
              console.log("🔍 Is options array:", Array.isArray(options));
              console.log("🔍 Options length:", options?.length);
              console.log("🔍 === END RELIGION FIELD DEBUG ===");
            }
            
            if (field.type === "select") {
              // Determine which dropdown is loading based on field name
              const getLoadingState = (fieldName) => {
                const fieldToLoadingMap = {
                  'admissionType': 'appTypes',
                  'religion': 'religions',
                  'caste': 'castes',
                  'bloodGroup': 'bloodGroups',
                };
                return loadingStates[fieldToLoadingMap[fieldName]] || false;
              };

              const isDropdownLoading = getLoadingState(field.name);

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
                      console.log(`🎯 Current field value:`, values[field.name]);
                      console.log(`🎯 Available options:`, options);
                      console.log(`🎯 Selected option:`, options.find((opt) => opt.id === values[field.name]));
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
            } else {
              return (
                <div key={index} className={styles.General_Info_Section_general_form_field}>
                  <Inputbox
                    label={field.label}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={handleSectionChange}
                    required={field.required}
                    type={field.type || "text"}
                    error={shouldShowError(field.name)}
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
    <div className={styles.General_Info_Section_general_form_grid}>
      {renderFieldRows(beforeAppSaleFields)}
    </div>
  );
};

export default AcademicInfoSection;