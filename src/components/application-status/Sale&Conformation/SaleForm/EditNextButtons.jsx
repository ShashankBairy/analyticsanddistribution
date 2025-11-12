import React, { useState } from 'react';
import Button from '../../../../widgets/Button/Button';
import {ReactComponent as TrendingUpIcon} from '../../../../assets/application-status/Trending up.svg';
import {ReactComponent as EditIcon} from '../../../../assets/application-status/EditIcon.svg';
import PaymentModal from './Paymentinfo/PaymentModal';
import Snackbar from '../../../../widgets/Snackbar/Snackbar';
import styles from './EditNextButtons.module.css';

const EditNextButtons = ({ onEdit, onNext, showSingleButton, singleButtonText, onSingleButtonClick, isConfirmationMode = false, onSubmitConfirmation, isSubmitting = false, fieldWiseErrors = {}, preFilledAmount }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleEdit = () => {
    console.log('Edit button clicked');
    if (onEdit) {
      onEdit();
    }
  };

  const handleNext = () => {
    console.log('Next button clicked');
    if (onNext) {
      onNext();
    }
  };

  // Snackbar functions
  const showSnackbar = (message, severity = 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleSingleButton = async () => {
    console.log('Single button clicked - calling parent handler');
    
    // Call the parent's single button handler (which contains validation logic)
    if (onSingleButtonClick) {
      const result = await onSingleButtonClick();
      
      // If validation was successful, open payment modal
      if (result === 'success') {
        console.log('Validation successful - opening payment modal');
        setIsPaymentModalOpen(true);
      } else {
        console.log('Validation failed - showing snackbar with errors');
        // Show snackbar with specific validation errors
        const errorCount = Object.keys(fieldWiseErrors).length;
        
        // Get field labels for better user experience
        const fieldLabels = {
          // Academic Information
          orientationBatch: "Orientation Batch",
          schoolState: "School State", 
          schoolDistrict: "School District",
          schoolName: "School Name",
          scoreMarks: "Score Marks", // Changed from 'marks' to 'scoreMarks'
          bloodGroup: "Blood Group",
          caste: "Caste",
          religion: "Religion",
          foodType: "Food Type",
          schoolType: "School Type",
          
          // Concession Information
          givenBy: "Given By",
          authorizedBy: "Authorized By",
          reason: "Reason",
          
          // Orientation Information
          academicYear: "Academic Year",
          branch: "Branch",
          branchType: "Branch Type",
          city: "City",
          studentType: "Student Type",
          joiningClass: "Joining Class",
          orientationName: "Orientation Name",

          // Family Information
          fatherName: "Father Name",
          fatherPhoneNumber: "Father Phone Number",
          fatherEmail: "Father Email",
          fatherSector: "Father Sector",
          fatherOccupation: "Father Occupation",
          fatherOtherOccupation: "Father Other Occupation",
          motherName: "Mother Name",
          motherPhoneNumber: "Mother Phone Number",
          motherEmail: "Mother Email",
          motherSector: "Mother Sector",
          motherOccupation: "Mother Occupation",
          motherOtherOccupation: "Mother Other Occupation"
        };
        
        // Get missing field names
        const missingFields = Object.keys(fieldWiseErrors).map(field => fieldLabels[field] || field);
        
        // Debug: Log all missing fields to console
        console.log('🔍 All missing fields:', Object.keys(fieldWiseErrors));
        console.log('🔍 Missing field labels:', missingFields);
        console.log('🔍 Field-wise errors:', fieldWiseErrors);
        
        let errorMessage;
        if (errorCount === 0) {
          errorMessage = 'Please complete all required fields before proceeding to payment.';
        } else if (errorCount === 1) {
          errorMessage = `Please complete: ${missingFields[0]}`;
        } else if (errorCount <= 3) {
          errorMessage = `Please complete: ${missingFields.join(", ")}`;
        } else {
          errorMessage = `Please complete ${errorCount} required fields: ${missingFields.slice(0, 3).join(", ")} and ${errorCount - 3} more`;
        }
        
        showSnackbar(errorMessage, 'error');
      }
    } else {
      // Fallback: open payment modal directly if no handler provided
      console.log('No parent handler provided, opening payment modal directly');
      setIsPaymentModalOpen(true);
    }
  };

  const handleCloseModal = (success) => {
    setIsPaymentModalOpen(false);
    if (success) {
      console.log('✅ Payment modal closed with success - confirmation was submitted successfully');
      // Don't call onSingleButtonClick again - the confirmation was already submitted
      // The success page should be shown by the parent component
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    setIsPaymentModalOpen(false);
    if (onSingleButtonClick) {
      onSingleButtonClick();
    }
  };

  // Show single button if showSingleButton is true
  if (showSingleButton) {
    return (
      <>
        <div className={styles.edit_next_buttons_wrapper}>
          <div className={styles.edit_next_buttons_container}>
          <Button
            buttonname={isConfirmationMode ? "Proceed to Payment" : (singleButtonText || "Proceed to payment")}
            righticon={<TrendingUpIcon />}
            onClick={handleSingleButton}
            variant="primary"
            width="auto"
            type="button"
            disabled={isSubmitting}
          />
        </div>
        </div>
        
        <PaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={handleCloseModal}
          onPaymentSuccess={handlePaymentSuccess}
          totalSteps={isConfirmationMode ? 3 : 2}
          isConfirmationMode={isConfirmationMode}
          onSubmitConfirmation={onSubmitConfirmation}
          preFilledAmount={preFilledAmount}
        />
        
        {/* Snackbar for validation errors */}
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={closeSnackbar}
          duration={snackbar.severity === 'success' ? 3000 : 6000}
          position="top-right"
          transition="slideRightToLeft"
          animation="fadeIn"
          width="50%"
        />
      </>
    );
  }

  // Show Edit and Next buttons by default
  return (
    <div className={styles.edit_next_buttons_wrapper}>
      <div className={styles.edit_next_buttons_container}>
      <Button
        buttonname="Edit"
        lefticon={<EditIcon />}
        onClick={handleEdit}
        variant="forth"
        width="auto"
        type="button"
      />
      
      <Button
        buttonname="Next"
        righticon={<TrendingUpIcon />}
        onClick={handleNext}
        variant="third"
        width="auto"
        type="button"
      />
    </div>
    </div>
  );
};

export default EditNextButtons;
