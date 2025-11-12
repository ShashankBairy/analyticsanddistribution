import React from 'react';

const FormError = ({ error, showOnChange = false, touched, externalErrors = {}, name }) => {
  // Prioritize external errors over Formik errors
  const errorMessage = externalErrors[name] || error;
  
  // Show error if:
  // 1. showOnChange is true (immediate validation)
  // 2. OR showOnChange is false and field has been touched
  // 3. OR external error exists (always show external errors)
  const shouldShowError = externalErrors[name] ? true : (showOnChange ? !!errorMessage : (touched && !!errorMessage));
  
  if (!shouldShowError) return null;

  return (
    <div style={{ 
      color: '#dc2626', 
      fontSize: '12px', 
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }}>
  
      <span>{errorMessage}</span>
    </div>
  );
};

export default FormError;
