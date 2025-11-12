import { useState } from 'react';
import { saleApi } from '../../services/saleApi';

/**
 * Custom hook for handling address form submission
 * Uses saleApi service for backend integration
 */
export const useAddressSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, onSuccess) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Address Information values:", values);
      
      // Validate required fields
      const requiredFields = ['addressLine1', 'pincode', 'state', 'district'];
      const missingFields = requiredFields.filter(field => !values[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Transform data for backend submission
      const addressData = {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2 || '',
        pincode: values.pincode,
        stateId: values.stateId,
        state: values.state,
        districtId: values.districtId,
        district: values.district,
        mandalId: values.mandalId || '',
        mandal: values.mandal || '',
        cityId: values.cityId || '',
        city: values.city || ''
      };

      console.log("Transformed address data for submission:", addressData);
      
      // Submit to backend using saleApi service
      const response = await saleApi.submitFormSection('address', addressData);
      
      console.log("Address submission response:", response);
      setSuccess(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(addressData);
      }
      
      return { success: true, data: response };
    } catch (err) {
      console.error('Address submission error:', err);
      setError(err.message || 'Address submission failed. Please try again.');
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
