import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitApplicationStatus } from "../../../../queries/application-status/apis";
import { validateSubmissionData } from "../utils/formUtils";

/**
 * Custom hook for handling form submission
 */
export const useFormSubmission = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = async (values, dropdownOptions, { setSubmitting }) => {
    const validation = validateSubmissionData(values, dropdownOptions);

    if (!validation.isValid) {
      alert(
        `Error: The following required IDs are missing or invalid: ${validation.missingIds.join(
          ", "
        )}. Please check your selections.`
      );
      setSubmitting(false);
      return;
    }

    try {
      const response = await submitApplicationStatus(validation.updatedValues);
      
      // Store submitted data for success page
      setSubmittedData({
        applicationNo: values.applicationNo,
        zoneName: values.zoneName,
        campusName: values.campusName,
        proName: values.proName,
        dgmName: values.dgmName,
        status: values.status,
        reason: values.reason
      });
      
      // Show success page
      setShowSuccess(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error submitting form: " + (err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToStatus = () => {
    navigate("/scopes/application/status");
  };

  return {
    showSuccess,
    submittedData,
    handleSubmit,
    handleBackToStatus,
  };
};
