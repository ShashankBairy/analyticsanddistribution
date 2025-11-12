import { useEffect } from "react";

export const useFormValidation = (
  values,
  errors,
  touched,
  setFieldTouched,
  setPersistentErrors,
  validationSchema
) => {
  // Auto-mark joinedCampus as touched if it has a value
  useEffect(() => {
    if (values.joinedCampus && !touched.joinedCampus) {
      console.log("🎯 Auto-marking joinedCampus as touched because it has a value");
      setFieldTouched("joinedCampus", true);
    }
  }, [values.joinedCampus, touched.joinedCampus, setFieldTouched]);

  // Force mark joinedCampus as touched when form validation runs
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("🔍 Fields with errors:", Object.keys(errors));
      console.log("🔍 joinedCampus error:", errors.joinedCampus);
      console.log("🔍 joinedCampus current value:", values.joinedCampus);
      console.log("🔍 joinedCampus is empty?", !values.joinedCampus || values.joinedCampus.trim() === '');
      console.log("🔍 Validation schema keys:", Object.keys(validationSchema.fields || {}));
      console.log("🔍 joinedCampus in schema?", 'joinedCampus' in (validationSchema.fields || {}));
      
      // Check if joinedCampus should have an error
      // if (!values.joinedCampus || values.joinedCampus.trim() === '') {
      //   console.log("🚨 joinedCampus is empty but not in errors - validation schema issue!");
      //   console.log("🔧 FORCING joinedCampus validation error manually");
        
      //   // Force add the error manually by setting persistent error
      //   setPersistentErrors(prev => ({
      //     ...prev,
      //     joinedCampus: "Joined Campus/Branch is required"
      //   }));
        
      //   // Also force the field to be touched
      //   setFieldTouched("joinedCampus", true);
      // }
      
      // if (errors.joinedCampus && !touched.joinedCampus) {
      //   console.log("🎯 Force marking joinedCampus as touched because validation error exists");
      //   setFieldTouched("joinedCampus", true);
      // }
    }
    
    // ALWAYS check if joinedCampus should have an error, regardless of other errors
    // if (!values.joinedCampus || values.joinedCampus.trim() === '') {
    //   console.log("🔧 ALWAYS adding joinedCampus error because field is empty");
    //   setPersistentErrors(prev => ({
    //     ...prev,
    //     joinedCampus: "Joined Campus/Branch is required"
    //   }));
    //   setFieldTouched("joinedCampus", true);
    // }
    
    // Force add joinedCampus to the main errors object if it's empty
    // if (!values.joinedCampus || values.joinedCampus.trim() === '') {
    //   console.log("🔧 FORCING joinedCampus into main errors object");
    //   // This will trigger a re-render with joinedCampus in the errors
    //   setFieldTouched("joinedCampus", true);
    // }
  }, [errors, /* touched.joinedCampus, setFieldTouched, values.joinedCampus, */ validationSchema, setPersistentErrors]);

  const shouldShowError = (fieldName, errors, touched, persistentErrors, getAdditionalOrientationFeeError) => {
    // Handle nested field names like siblingInformation.0.fullName
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      if (parts[0] === 'siblingInformation') {
        const index = parseInt(parts[1]);
        const field = parts[2];
        const touchedValue = touched.siblingInformation?.[index]?.[field];
        const errorValue = errors.siblingInformation?.[index]?.[field];
        const persistentError = persistentErrors[fieldName];
        return (touchedValue && errorValue) || persistentError;
      }
    }
   
    // Special handling for additional orientation fee - show error if it exceeds limit
    if (fieldName === "additionalOrientationFee") {
      return getAdditionalOrientationFeeError() !== null || (touched[fieldName] && errors[fieldName]) || persistentErrors[fieldName];
    }
   
    // Special handling for joinedCampus - ALWAYS show error if field is empty
    // if (fieldName === "joinedCampus") {
    //   const hasError = errors[fieldName] || persistentErrors[fieldName];
    //   const isTouched = touched[fieldName];
    //   const hasValue = values[fieldName] && values[fieldName].trim() !== '';
      
    //   // ALWAYS show error if field is empty (like other required fields)
    //   const shouldShow = hasError || (!hasValue && isTouched);
      
    //   console.log("🔍 joinedCampus validation debug:", {
    //     fieldName,
    //     touched: touched[fieldName],
    //     error: errors[fieldName],
    //     persistentError: persistentErrors[fieldName],
    //     hasError,
    //     isTouched,
    //     hasValue,
    //     shouldShow,
    //     currentValue: values[fieldName],
    //     allErrors: errors,
    //     validationSchema: "joinedCampus validation should be working"
    //   });
      
    //   return shouldShow;
    // }
   
    // Show error if field is touched and has error, OR if it has a persistent error
    return (touched[fieldName] && errors[fieldName]) || persistentErrors[fieldName];
  };

  const getFieldError = (fieldName, errors, persistentErrors, getAdditionalOrientationFeeError) => {
    // Handle nested field names like siblingInformation.0.fullName
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      if (parts[0] === 'siblingInformation') {
        const index = parseInt(parts[1]);
        const field = parts[2];
        return errors.siblingInformation?.[index]?.[field] || persistentErrors[fieldName];
      }
    }
   
    // Special handling for additional orientation fee - return custom error message
    if (fieldName === "additionalOrientationFee") {
      const customError = getAdditionalOrientationFeeError();
      if (customError) {
        return customError;
      }
    }
   
    return errors[fieldName] || persistentErrors[fieldName];
  };

  return {
    shouldShowError,
    getFieldError
  };
};
