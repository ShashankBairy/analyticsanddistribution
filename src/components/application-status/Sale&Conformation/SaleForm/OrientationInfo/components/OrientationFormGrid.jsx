import React from 'react';
import OrientationFormField from './OrientationFormField';
import styles from './OrientationFormGrid.module.css';

const OrientationFormGrid = ({ formFields, values, handleChange, handleBlur, errors, touched, setFieldValue, externalErrors, onClearFieldError }) => {
  return (
    <div className={styles.orientation_info_form_grid}>
      {formFields.map((field) => (
        <OrientationFormField
          key={field.id}
          field={field}
          values={values}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
          externalErrors={externalErrors}
          onClearFieldError={onClearFieldError}
        />
      ))}
    </div>
  );
};

export default OrientationFormGrid;
