import React from 'react';

const FormError = ({ name, touched, errors, className, showOnChange = false, isSubmitted = false, externalErrors = {} }) => {
  // Enhanced debug logging for external errors
  console.log(`🔍 FormError for ${name}:`, {
    externalError: externalErrors[name],
    touched: touched[name],
    formikError: errors[name],
    externalErrorsKeys: Object.keys(externalErrors),
    externalErrorsCount: Object.keys(externalErrors).length,
    shouldShow: !!(externalErrors[name]),
    hasExternalError: !!externalErrors[name],
    hasFormikError: !!errors[name],
    isTouched: !!touched[name],
    isSubmitted
  });
  
  
  // Show error if field is touched AND has error
  // OR if showOnChange is true AND field has error (for immediate validation)
  // OR if form is submitted AND field has error (for submission validation)
  // OR if external error exists for this field (for external validation)
  const shouldShowError = (touched[name] && errors[name]) || 
                         (showOnChange && errors[name]) || 
                         (isSubmitted && errors[name]) ||
                         (externalErrors[name]);
  
  // Priority: external error > formik error
  const errorMessage = externalErrors[name] || errors[name];
  
  console.log(`🔍 FormError ${name} decision:`, {
    shouldShowError,
    errorMessage,
    hasExternalError: !!externalErrors[name],
    hasFormikError: !!errors[name],
    isTouched: !!touched[name],
    isSubmitted
  });
  
  if (!shouldShowError) {
    console.log(`❌ FormError ${name} NOT showing - shouldShowError is false`);
    return null;
  }
  
  console.log(`✅ FormError ${name} SHOWING error:`, errorMessage);
  return (
    <div className={className}>
      {errorMessage}
    </div>
  );
};

export default FormError;
