import { useState } from 'react';

/**
 * Custom hook for handling personal information form state
 * No API calls - just form state management
 */
export const usePersonalInfoSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, onSuccess) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Just validate and pass data to parent
      setSuccess(true);
      
      // Call success callback to pass data to parent
      if (onSuccess) {
        onSuccess(values);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Personal information validation error:', err);
      setError(err.message || 'Personal information validation failed.');
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
