import React from 'react';

const FormError = ({ name, touched, errors, className, showOnChange = false, externalErrors = {} }) => {
  // Priority: external error > formik error
  // If external error exists, show it regardless of other conditions
  if (externalErrors[name]) {
    return (
      <div className={className}>
        {externalErrors[name]}
      </div>
    );
  }
  
  // If no external error, show Formik error only when field is touched (not on change)
  const shouldShowError = touched[name] && errors[name];
  
  if (!shouldShowError) return null;
  
  return (
    <div className={className}>
      {errors[name]}
    </div>
  );
};

export default FormError;
