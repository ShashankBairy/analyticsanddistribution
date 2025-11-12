import { Formik, Form } from "formik";
import { useState, useEffect, useCallback } from "react";
import { formFields, initialValues } from "./constants/orientationConstants";
import { validationSchema } from "./constants/validationSchema";
import { useOrientationSubmission } from "./hooks/useOrientationSubmission";
import OrientationFormTitle from "./components/OrientationFormTitle";
import OrientationFormGrid from "./components/OrientationFormGrid";
import styles from "./OrientationInformation.module.css";

const OrientationInformation = ({ onSuccess, externalErrors = {}, onClearFieldError, onValidationRef, allFormData, academicYear, academicYearId, initialValuesOverride }) => {
  // Debug logging for external errors
  console.log('🔍 OrientationInformation received externalErrors:', externalErrors);
  
  const { isSubmitting, error, handleSubmit } = useOrientationSubmission();

  // Track previous values to detect changes
  const [previousValues, setPreviousValues] = useState(initialValues);

  // Enhanced initial values with data from props and localStorage
  const getEnhancedInitialValues = () => {
    const academicYearFromStorage = localStorage.getItem('academicYear');
    const academicYearIdFromStorage = localStorage.getItem('academicYearId');
    
    // Priority: Props > localStorage > initialValues
    return {
      ...initialValues,
      ...(initialValuesOverride || {}),
      academicYear: academicYear || academicYearFromStorage || initialValues.academicYear,
      academicYearId: academicYearId || academicYearIdFromStorage || null
    };
  };

  const [enhancedInitialValues] = useState(getEnhancedInitialValues());

  // Update academicYear when props change
  useEffect(() => {
    if (academicYear && academicYear !== enhancedInitialValues.academicYear) {
      console.log('📅 Academic Year updated from StatusHeader:', academicYear);
      // The form will automatically update when the component re-renders with new props
    }
  }, [academicYear, academicYearId]);

  // Custom validation function for conditional fields
  const customValidate = (values) => {
    const errors = {};

    // Check if proReceiptNo should be required (when admission type includes "pro")
    if (values.admissionType && 
        (values.admissionType.toLowerCase().includes("pro") || 
         values.admissionType.toLowerCase().includes("with pro")) &&
        !values.proReceiptNo) {
      errors.proReceiptNo = "PRO Receipt No is required when admission type includes 'pro'";
    }

    return errors;
  };

  // Function to handle value changes
  const handleValuesChange = (values) => {
    // Check if values have actually changed
    const hasChanged = JSON.stringify(values) !== JSON.stringify(previousValues);
    if (hasChanged && onSuccess) {
      onSuccess(values);
      setPreviousValues(values);
    }
  };

  // Handle form submission with API integration
  const onSubmit = async (values, { setSubmitting }) => {
    
    try {
      // Just validate and pass data to parent (matching existing pattern)
      if (onSuccess) {
        onSuccess(values);
      }
      
      setSubmitting(false);
      return { success: true };
    } catch (err) {
      setSubmitting(false);
      return { success: false, error: err.message };
    }
  };

  // Function to validate orientation form and return errors
  const validateOrientationForm = useCallback(async () => {
    // Get current form values from the form data
    const currentValues = {
      academicYear: allFormData.academicYear || enhancedInitialValues.academicYear,
      branch: allFormData.branch || enhancedInitialValues.branch,
      branchType: allFormData.branchType || enhancedInitialValues.branchType,
      city: allFormData.city || enhancedInitialValues.city,
      studentType: allFormData.studentType || enhancedInitialValues.studentType,
      joiningClass: allFormData.joiningClass || enhancedInitialValues.joiningClass,
      orientationName: allFormData.orientationName || enhancedInitialValues.orientationName,
      admissionType: allFormData.admissionType || enhancedInitialValues.admissionType,
      proReceiptNo: allFormData.proReceiptNo || enhancedInitialValues.proReceiptNo
    };
    
    try {
      // Validate using the same schema as Formik
      await validationSchema.validate(currentValues, { abortEarly: false });
      return {}; // No errors
    } catch (error) {
      const errors = {};
      if (error.inner) {
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
      }
      return errors;
    }
  }, [allFormData, enhancedInitialValues]);

  // Pass validation function to parent
  useEffect(() => {
    if (onValidationRef) {
      onValidationRef(validateOrientationForm);
    }
  }, [onValidationRef, validateOrientationForm]);

  return (
    <Formik
      initialValues={enhancedInitialValues}
      validationSchema={validationSchema}
      validate={customValidate}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
        // Pass data to parent whenever values change
        handleValuesChange(values);

        return (
        <Form>

          {/* Global Error Display */}
          {error && (
            <div className={styles.global_error}>
              {error}
            </div>
          )}

          {/* Orientation Information Section Title */}
          <OrientationFormTitle />

          {/* Form Grid */}
          <OrientationFormGrid
            formFields={formFields}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            externalErrors={externalErrors}
            onClearFieldError={onClearFieldError}
          />
        </Form>
        );
      }}
    </Formik>
  );
};

export default OrientationInformation;
