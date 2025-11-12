import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../../../queries/application-status/SaleFormapis';
import { transformFormDataToApiFormat } from '../utils/dataTransformation';

export const useFormHandlers = (initialData = {}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saleData, setSaleData] = useState(null);
  const [applicationData, setApplicationData] = useState(null);

  // Handle form submission
  const handleSubmit = useCallback(async (values, { setSubmitting, setFieldError }) => {
    setIsSubmitting(true);
    setSubmitting(true);

    try {
      // Transform form data to API format
      const apiData = transformFormDataToApiFormat(values);

      // Submit to backend
      const response = await apiService.submitApplication(apiData);

      // Handle success
      if (response && response.success) {
        setApplicationData({
          ...values,
          applicationNo: response.applicationNo || values.applicationNo
        });
        return response;
      } else {
        throw new Error(response?.message || "Submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFieldError('general', error.message || "An error occurred during submission");
      throw error;
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  }, []);

  // Handle step navigation
  const handleStepChange = useCallback((step) => {
    // This function should be implemented by the parent component
  }, []);

  // Handle next step
  const handleNext = useCallback(async (values, setFieldValue, validateForm, setTouched) => {
    // TEMPORARY: Skip validation for testing
    return true;
    
    // Original validation logic (commented out for testing)
    /*
    try {
      // Validate current step
      const errors = await validateForm();
      if (Object.keys(errors).length > 0) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Step validation error:", error);
      return false;
    }
    */
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Handle coupon submission
  const handleCouponSubmit = useCallback((setFieldValue) => {
    // Implement coupon logic here
  }, []);

  // Handle confirmation success
  const handleConfirmationSuccess = useCallback((data) => {
    setSaleData(data);
  }, []);

  // Get application data
  const getApplicationData = useCallback(() => {
    return applicationData || initialData;
  }, [applicationData, initialData]);

  return {
    handleSubmit,
    handleStepChange,
    handleNext,
    handleBack,
    handleCouponSubmit,
    handleConfirmationSuccess,
    getApplicationData,
    isSubmitting,
    saleData,
    applicationData
  };
};
