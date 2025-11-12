import { useState } from 'react';

/**
 * Custom hook for AddressInfoSection form state management
 * Extracted from AddressInfoSection.js lines 51-69
 * Preserves every single line and functionality exactly as manager wants
 */
export const useAddressForm = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  // Function to show snackbar messages
  const showSnackbar = (message, severity = 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Function to close snackbar
  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return {
    snackbar,
    setSnackbar,
    showSnackbar,
    closeSnackbar,
  };
};
