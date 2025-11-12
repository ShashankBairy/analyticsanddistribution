import { useState } from "react";

export const useFormHelpers = () => {
  const [persistentErrors, setPersistentErrors] = useState({});
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  // Helper function to format date for display
  const formatDateForDisplay = (dateValue, fieldName) => {
    if (!dateValue) return "";
   
    console.log(`📍 Formatting date for ${fieldName}:`, dateValue);
    console.log(`📍 Date value type:`, typeof dateValue);
   
    try {
      let date;
     
      // Handle different date formats
      if (typeof dateValue === 'string') {
        // Check if it's a timestamp (numbers only)
        if (/^\d+$/.test(dateValue)) {
          // It's a timestamp, convert to number
          const timestamp = parseInt(dateValue);
          if (timestamp > 1000000000000) { // Milliseconds timestamp
            date = new Date(timestamp);
          } else { // Seconds timestamp
            date = new Date(timestamp * 1000);
          }
        } else {
          // Try parsing as date string
          date = new Date(dateValue);
        }
      } else if (typeof dateValue === 'number') {
        // Handle numeric timestamps
        if (dateValue > 1000000000000) { // Milliseconds timestamp
          date = new Date(dateValue);
        } else { // Seconds timestamp
          date = new Date(dateValue * 1000);
        }
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        console.log(`📍 Unknown date format for ${fieldName}:`, dateValue);
        return dateValue; // Return as-is if we can't parse it
      }
     
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log(`📍 Invalid date for ${fieldName}:`, dateValue);
        return dateValue; // Return original value if invalid
      }
     
      // Format to yyyy-mm-dd for HTML date input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
     
      console.log(`📍 Formatted date for ${fieldName}:`, formattedDate);
      return formattedDate;
    } catch (error) {
      console.error(`📍 Error formatting date for ${fieldName}:`, error);
      console.log(`📍 Could not format date, returning original:`, dateValue);
      return dateValue;
    }
  };

  // Helper function to get maximum allowed additional orientation fee
  const getMaxAdditionalOrientationFee = (values) => {
    if (!values || typeof values !== 'object') return null;
    
    const orientationFee = values.OrientationFee;
    if (!orientationFee) return null;
   
    const orientationFeeValue = parseFloat(orientationFee) || 0;
    return Math.floor(orientationFeeValue / 2); // Use Math.floor to ensure it's below 50%
  };

  // Helper function to check if additional orientation fee exceeds limit
  const getAdditionalOrientationFeeError = (values) => {
    if (!values || typeof values !== 'object') return null;
    
    const additionalFee = values.additionalOrientationFee;
    const orientationFee = values.OrientationFee;
   
    if (!additionalFee || !orientationFee) return null;
   
    const additionalFeeValue = parseFloat(additionalFee) || 0;
    const orientationFeeValue = parseFloat(orientationFee) || 0;
    const maxAllowed = Math.floor(orientationFeeValue / 2);
   
    if (additionalFeeValue > maxAllowed) {
      return `Additional orientation fee cannot exceed 50% of orientation fee (Max: ${maxAllowed})`;
    }
   
    return null;
  };

  return {
    persistentErrors,
    setPersistentErrors,
    profilePhotoPreview,
    setProfilePhotoPreview,
    formatDateForDisplay,
    getMaxAdditionalOrientationFee,
    getAdditionalOrientationFeeError
  };
};
