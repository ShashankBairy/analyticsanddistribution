import React from "react";
import SuccessPage from "../../Sale&Conformation/ConformationPage/SuccessPage";
import ProgressHeader from "../../../../widgets/ProgressHeader/ProgressHeader";
import styles from "../Damaged.module.css";

/**
 * Wrapper component for the success page
 */
const SuccessPageWrapper = ({ submittedData, onBack }) => {
  if (!submittedData) return null;

  // Determine if we should show reverse order
  // If status is "AVAILABLE" or "WITH PRO", show reverse order (Red star first, Blue star second)
  const shouldReverseOrder = submittedData.status === "AVAILABLE" || submittedData.status === "WITH PRO";
  
  return (
    <div className={styles.Damaged_damaged_Page_Wrapper}>
      {/* Application Damage Header - Always visible */}
      <div className={styles.Damaged_Header_Wrapper}>
        <h1 className={styles.Damaged_Header_Title}>Application Damage</h1>
        <ProgressHeader step={1} totalSteps={2} />
      </div>
      
      <div className={styles.Damaged_Success_Page_Wrapper}>
        <SuccessPage
          applicationNo={submittedData.applicationNo}
          studentName={submittedData.proName} // Using PRO name as student name
          amount="" // No amount for damaged status
          campus={submittedData.campusName}
          zone={submittedData.zoneName}
          onBack={onBack}
          statusType="damaged"
          reverseOrder={shouldReverseOrder}
        />
      </div>
    </div>
  );
};

export default SuccessPageWrapper;
