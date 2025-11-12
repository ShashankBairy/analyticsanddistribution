import { useState } from 'react';
import { saleApi } from '../../services/saleApi';

/**
 * Custom hook for handling orientation form submission
 * Uses saleApi service for backend integration
 */
export const useOrientationSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, onSuccess) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      
      // Validate required fields
      const requiredFields = ['academicYear', 'branch', 'branchType', 'studentType', 'joiningClass', 'orientationName', 'city'];
      const missingFields = requiredFields.filter(field => !values[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Transform data for backend submission
      const orientationData = {
        academicYear: values.academicYear,
        branchId: values.branchId,
        branch: values.branch,
        branchTypeId: values.branchTypeId,
        branchType: values.branchType,
        studentTypeId: values.studentTypeId,
        studentType: values.studentType,
        joiningClassId: values.joiningClassId,
        joiningClass: values.joiningClass,
        orientationId: values.orientationId,
        orientationName: values.orientationName,
        cityId: values.cityId,
        city: values.city,
        admissionType: values.admissionType || '',
        proReceiptNo: values.proReceiptNo || ''
      };

      
      // Submit to backend using saleApi service
      const response = await saleApi.submitFormSection('orientation', orientationData);
      
      setSuccess(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(orientationData);
      }
      
      return { success: true, data: response };
    } catch (err) {
      setError(err.message || 'Orientation submission failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  };

  return {
    isSubmitting,
    error,
    success,
    handleSubmit,
    resetState
  };
};
