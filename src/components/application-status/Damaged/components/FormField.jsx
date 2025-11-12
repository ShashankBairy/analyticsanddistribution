import React from "react";
import { ErrorMessage } from "formik";
import Inputbox from "../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../widgets/Dropdown/Dropdown";
import Asterisk from "../../../../assets/application-status/Asterisk";
import styles from "../Damaged.module.css";

/**
 * Individual form field component
 */
const FormField = ({
  field,
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  errors,
  touched,
  dropdownOptions,
  loadingStates,
  error,
  fetchError,
  applicationNo,
  setApplicationNo,
  resetForm,
  initialValues,
  onZoneChange,
  onCampusChange,
  onProChange,
  onDgmChange,
  onStatusChange,
}) => {
  const renderInputField = () => (
    <>
      <Inputbox
        label={field.label}
        id={field.name}
        name={field.name}
        placeholder={`Enter ${field.label}`}
        value={values[field.name] || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          if (field.name === "applicationNo" && newValue !== applicationNo) {
            resetForm({ values: { ...initialValues, applicationNo: newValue } });
            setApplicationNo(newValue);
          } else {
            setFieldValue(field.name, newValue);
          }
        }}
        onBlur={handleBlur}
        error={touched[field.name] && errors[field.name]}
        required={field.required}
      />
      <ErrorMessage name={field.name} component="div" style={{ color: "red", fontSize: "12px" }} />
      {field.name === "applicationNo" && fetchError && (
        <div style={{ color: "red", fontSize: "12px" }}>
          Failed to fetch details. Please enter manually or re-enter Application No.
        </div>
      )}
    </>
  );

  const renderSelectField = () => (
    <>
      <Dropdown
        dropdownname={field.label}
        name={field.name}
        results={field.options}
        value={values[field.name] || ""}
        disabled={
          field.name === "zoneName"
            ? loadingStates.zones
            : field.name === "campusName"
            ? loadingStates.campuses
            : field.name === "proName"
            ? loadingStates.proEmployees
            : field.name === "dgmName"
            ? loadingStates.dgmEmployees
            : field.name === "status"
            ? loadingStates.statuses
            : false
        }
        loading={
          field.name === "zoneName"
            ? loadingStates.zones
            : field.name === "campusName"
            ? loadingStates.campuses
            : field.name === "proName"
            ? loadingStates.proEmployees
            : field.name === "dgmName"
            ? loadingStates.dgmEmployees
            : field.name === "status"
            ? loadingStates.statuses
            : false
        }
        onChange={(e) => {
          const selectedValue = e.target.value;
          console.log(`FormField onChange - Field: ${field.name}, Value: ${selectedValue}`);
          setFieldValue(field.name, selectedValue);

          // Handle field-specific logic
          switch (field.name) {
            case "zoneName":
              console.log("Calling onZoneChange with:", selectedValue);
              onZoneChange(selectedValue);
              break;
            case "campusName":
              console.log("Calling onCampusChange with:", selectedValue);
              onCampusChange(selectedValue);
              break;
            case "proName":
              console.log("Calling onProChange with:", selectedValue);
              onProChange(selectedValue);
              break;
            case "dgmName":
              console.log("Calling onDgmChange with:", selectedValue);
              onDgmChange(selectedValue);
              break;
            case "status":
              console.log("Calling onStatusChange with:", selectedValue);
              onStatusChange(selectedValue);
              break;
            default:
              break;
          }
        }}
        onBlur={handleBlur}
        required={field.required}
      />
      <ErrorMessage name={field.name} component="div" style={{ color: "red", fontSize: "12px" }} />
      {field.name === "campusName" && error && dropdownOptions.campusName.length === 0 && (
        <div style={{ color: "red", fontSize: "12px" }}>{error}</div>
      )}
    </>
  );

  const renderTextareaField = () => (
    <div className={styles.Damaged_damaged_textarea_container}>
      <label className={styles.Damaged_damaged_Label}>
        {field.label}
        {field.required && values.status === "DAMAGED" && <Asterisk style={{ marginLeft: "4px" }} />}
      </label>
      <textarea
        name={field.name}
        className={field.className || styles.Damaged_damaged_Input}
        value={values[field.name] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={`Enter ${field.label}`}
        rows={4}
      />
      <ErrorMessage name={field.name} component="div" style={{ color: "red", fontSize: "12px" }} />
    </div>
  );

  return (
    <div className={styles.Damaged_damaged_Field_Column}>
      {field.type === "input" && renderInputField()}
      {field.type === "select" && renderSelectField()}
      {field.type === "textarea" && renderTextareaField()}
    </div>
  );
};

export default FormField;
