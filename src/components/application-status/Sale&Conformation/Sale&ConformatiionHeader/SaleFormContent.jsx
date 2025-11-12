import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import StatusHeader from '../StatusHeader/StatusHeader';
import ProgressHeader from '../../../../widgets/ProgressHeader/ProgressHeader';
import backButton from '../../../../assets/application-status/BakArrow.svg';
import styles from './SaleFormContent.module.css';

const SaleFormContent = ({ status, onBack, initialData = {}, showSuccess = false, showConfirmation = false, currentStep = 1, onStatusHeaderDataFetched }) => {
  const navigate = useNavigate();
  const { applicationNo } = useParams();
  const location = useLocation();
  
  console.log('🏗️ SaleFormContent Render - Status:', status, 'ShowConfirmation:', showConfirmation);
  
  const locationInitialValues = (location && location.state && location.state.initialValues) ? location.state.initialValues : {};
  
  const [persistentData, setPersistentData] = useState({ campus: "", zone: "" });
  const [activeStep, setActiveStep] = useState(showSuccess ? 1 : 0);

  // Update activeStep when showSuccess or showConfirmation changes
  useEffect(() => {
    if (showConfirmation) {
      setActiveStep(currentStep - 1); // Use passed currentStep (convert from 1-based to 0-based)
    } else if (showSuccess) {
      // For success page, show all steps filled
      if (status === "confirmation") {
        setActiveStep(2); // Step 3 for confirmation success
      } else {
        setActiveStep(1); // Step 2 for sale success
      }
    } else {
      setActiveStep(0); // Step 1 for normal
    }
  }, [showSuccess, showConfirmation, currentStep, status]);

  // Dynamic title based on status and confirmation state
  const getTitle = () => {
    if (showConfirmation) {
      return "Application Confirmation";
    } else if (status === "sale") {
      return "Application Sale";
    } else if (status === "confirmation") {
      return "Application Sale & Confirmation";
    } 
  };

  // Dynamic steps based on status and confirmation state
  const getTotalSteps = () => {
    if (showConfirmation) {
      return 3; // Confirmation mode - 3 steps
    } else if (status === "sale") {
      return 2; // From "to sold" - 2 steps
    } else if (status === "confirmation") {
      return 3; // To confirm - 3 steps
    }
    return 2; // Default
  };

  // Handle back navigation
  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/scopes/application/status");
    }
  };

  // Header data
  const headerCampus = locationInitialValues.campusName || locationInitialValues.campus || locationInitialValues.joinedCampus || persistentData.campus || "";
  const headerZone = locationInitialValues.zoneName || locationInitialValues.zone || locationInitialValues.district || persistentData.zone || "";
  
  // Determine category from location state or props
  const category = locationInitialValues.category || initialData.category || "college"; // Default to college

  return (
    <div className={styles.saleFormContentContainer}>
      {/* Header with Back Button and Title */}
      <div className={styles.saleFormHeader}>
        <figure className={styles.saleFormHeaderFigure}>
          <img src={backButton} alt="back" onClick={handleBackClick} />
        </figure>
        <div className={styles.saleFormHeaderTitle}>
          <h2>{getTitle()}</h2>
        </div>
        <div className={styles.saleFormHeaderStatusHeader}>
          <StatusHeader
            applicationNo={applicationNo || ""}
            campusName={headerCampus}
            zoneName={headerZone}
            academicYear={locationInitialValues.academicYear || ""}
            applicationFee={locationInitialValues.applicationFee || ""}
            category={category}
            onDataFetched={onStatusHeaderDataFetched}
          />
        </div>
       
      </div>
      
      {/* Progress Header */}
      <div className={styles.saleFormProgressSection}>
        <ProgressHeader 
          step={activeStep} 
          totalSteps={getTotalSteps()} 
        />
      </div>
      
    
    </div>
  );
};

export default SaleFormContent;

