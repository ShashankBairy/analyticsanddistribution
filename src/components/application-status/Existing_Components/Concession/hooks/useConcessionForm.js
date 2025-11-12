import { useState, useEffect } from 'react';

/**
 * Custom hook for ConcessionInfoSection form state management
 * Extracted from ConcessionInfoSection.js lines 530-650
 * Preserves every single line and functionality exactly as manager wants
 */
export const useConcessionForm = (values, setFieldTouched, setFieldValue) => {
  const [error, setError] = useState(null);
  const [showMobileNumber, setShowMobileNumber] = useState(false);
  const [persistentErrors, setPersistentErrors] = useState({});

  // Trigger validation when concession amounts change
  useEffect(() => {
    const hasConcession = [values.yearConcession1st, values.yearConcession2nd, values.yearConcession3rd]
      .some((v) => v && v.toString().trim() !== "" && Number(v) > 0);

    if (hasConcession) {
      // Set persistent errors for all required fields when concession is entered
      setPersistentErrors({
        givenBy: "Given By is required when concession is applied",
        givenById: "Given By is required when concession is applied",
        authorizedBy: "Authorized By is required when concession is applied",
        authorizedById: "Authorized By is required when concession is applied",
        reason: "Reason is required when concession is applied",
        concessionReasonId: "Reason is required when concession is applied"
      });
     
      // Mark all concession-related fields as touched to show validation errors
      setFieldTouched("givenBy", true);
      setFieldTouched("givenById", true);
      setFieldTouched("authorizedBy", true);
      setFieldTouched("authorizedById", true);
      setFieldTouched("reason", true);
      setFieldTouched("concessionReasonId", true);
    } else {
      // Clear all concession-related fields when no concession amount is entered
      console.log("🧹 useEffect: Clearing all concession fields as no concession amount is entered");
      setFieldValue("givenBy", "");
      setFieldValue("givenById", "");
      setFieldValue("authorizedBy", "");
      setFieldValue("authorizedById", "");
      setFieldValue("reason", "");
      setFieldValue("concessionReasonId", "");
      setFieldValue("concessionWrittenBy", "");
      setFieldValue("concessionWrittenById", "");
      setFieldValue("additionalReason", "");
      setFieldValue("concessionAmount", "");
      setFieldValue("additionalConcession", false);
     
      // Clear touched state and persistent errors for these fields
      setFieldTouched("givenBy", false);
      setFieldTouched("givenById", false);
      setFieldTouched("authorizedBy", false);
      setFieldTouched("authorizedById", false);
      setFieldTouched("reason", false);
      setFieldTouched("concessionReasonId", false);
      setFieldTouched("concessionWrittenBy", false);
      setFieldTouched("concessionWrittenById", false);
      setFieldTouched("additionalReason", false);
      setFieldTouched("concessionAmount", false);
      setFieldTouched("additionalConcession", false);
     
      // Clear persistent errors
      setPersistentErrors({});
    }
  }, [values.yearConcession1st, values.yearConcession2nd, values.yearConcession3rd, setFieldTouched, setFieldValue]);

  return {
    error,
    setError,
    showMobileNumber,
    setShowMobileNumber,
    persistentErrors,
    setPersistentErrors,
  };
};
