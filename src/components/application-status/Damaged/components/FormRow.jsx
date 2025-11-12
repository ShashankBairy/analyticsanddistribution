import React from "react";
import FormField from "./FormField";
import styles from "../Damaged.module.css";

/**
 * Form row component that renders a row of form fields
 */
const FormRow = ({
  row,
  rowIndex,
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
  return (
    <div key={rowIndex} className={styles.Damaged_damaged_Field_Row}>
      {row.map((field) => (
        <FormField
          key={field.name}
          field={field}
          values={values}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
          dropdownOptions={dropdownOptions}
          loadingStates={loadingStates}
          error={error}
          fetchError={fetchError}
          applicationNo={applicationNo}
          setApplicationNo={setApplicationNo}
          resetForm={resetForm}
          initialValues={initialValues}
          onZoneChange={onZoneChange}
          onCampusChange={onCampusChange}
          onProChange={onProChange}
          onDgmChange={onDgmChange}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default FormRow;
