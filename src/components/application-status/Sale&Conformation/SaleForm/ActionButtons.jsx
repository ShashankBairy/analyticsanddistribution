import React, { useState } from "react";
import Button from "../../../../widgets/Button/Button";
import Snackbar from "../../../../widgets/Snackbar/Snackbar";
import { ReactComponent as StarTickIcon } from "../../../../assets/application-status/starTick.svg";
import { ReactComponent as BlueArrowIcon } from "../../../../assets/application-status/blue color arrow.svg";
import PaymentModal from "./Paymentinfo/PaymentModal";
import {
  validateAllForms,
  getMissingFieldsMessage,
} from "./utils/comprehensiveValidation";
import styles from "./ActionButtons.module.css";

const ActionButtons = ({
  onPaymentSuccess,
  onSaleAndConform,
  onSubmitCompleteSale,
  onSubmitSaleOnly,
  isSubmitting,
  formData,
  onPaymentInfoSuccess,
  onFieldWiseErrors,
  onClearFieldWiseErrors,
  onValidateOrientation,
  category = "COLLEGE",
  showSaveContinue = false,
  onSaveAndContinue,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleProceedToSale = async () => {
    try {
      // Validate all forms comprehensively (excluding orientation fields)
      const validationResult = await validateAllForms(formData, 1, category);

      // Validate orientation fields locally using Formik
      let orientationErrors = {};
      if (
        onValidateOrientation &&
        typeof onValidateOrientation === "function"
      ) {
        orientationErrors = await onValidateOrientation();
      }

      // Combine all errors
      const allErrors = { ...validationResult.errors, ...orientationErrors };
      const isValid =
        validationResult.isValid && Object.keys(orientationErrors).length === 0;

      if (isValid) {
        showSnackbar(
          "All forms validated successfully! Opening payment modal...",
          "success"
        );
        // Clear any existing field-wise errors
        if (onClearFieldWiseErrors) {
          onClearFieldWiseErrors();
        }
        setIsPaymentModalOpen(true);
      } else {
        const errorMessage = getMissingFieldsMessage(allErrors);

        // Set field-wise errors for display
        if (onFieldWiseErrors) {
          onFieldWiseErrors(allErrors);
        }

        // Show user-friendly error message using Snackbar
        showSnackbar(
          `Please complete all required fields before proceeding to sale. Missing: ${errorMessage}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Validation error:", error);
      showSnackbar(
        "An error occurred during validation. Please try again.",
        "error"
      );
    }
  };

  const handleSaleAndConform = async () => {
    console.log("🔄 ===== ACTION BUTTONS: SALE & CONFORM CLICKED =====");
    console.log("Sale & Conform clicked");
    console.log("Current form data before submission:", formData);
    console.log("Form data keys:", Object.keys(formData));
    console.log("Form data values:", Object.values(formData));
    console.log("Timestamp:", new Date().toISOString());

    // Check if all required form data is available (excluding payment fields)
    const requiredFields = ["firstName", "academicYear", "doorNo"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    console.log("Required fields:", requiredFields);
    console.log("Missing fields:", missingFields);

    if (missingFields.length > 0) {
      const errorMessage = `Please complete all form sections before proceeding. Missing: ${missingFields.join(
        ", "
      )}`;
      console.log("❌ Validation failed:", errorMessage);

      // Create field-wise errors for missing fields
      const fieldErrors = {};
      missingFields.forEach((field) => {
        fieldErrors[field] = `${field} is required`;
      });

      // Set field-wise errors for display
      if (onFieldWiseErrors) {
        onFieldWiseErrors(fieldErrors);
      }

      showSnackbar(errorMessage, "error");
      return;
    }

    console.log("✅ Validation passed, proceeding with submission");

    // Submit sale-only form (without payment data) - don't show success page
    if (onSubmitSaleOnly) {
      console.log("🔄 Calling onSubmitSaleOnly...");
      const result = await onSubmitSaleOnly(null, false); // Pass false to not show success page
      console.log("🔄 onSubmitSaleOnly result:", result);

      if (result && result.success) {
        console.log(
          "✅ Data submission successful, calling onSaleAndConform..."
        );
        if (onSaleAndConform) {
          onSaleAndConform();
          console.log("🔄 ===== NAVIGATION CALLED FROM ACTION BUTTONS =====");
        } else {
          console.log("❌ onSaleAndConform function not provided");
        }
      } else {
        console.log("❌ Data submission failed:", result);
      }
    } else {
      console.log("❌ onSubmitSaleOnly function not provided");
    }
  };

  const handleCloseModal = (success) => {
    setIsPaymentModalOpen(false);
    // Close any open snackbar
    closeSnackbar();

    // Only trigger success page if database submission was successful
    if (success && onPaymentSuccess) {
      console.log("✅ Modal closed with success - showing success page");
      onPaymentSuccess(true);
    } else {
      console.log("❌ Modal closed without success - not showing success page");
    }
  };

  const handlePaymentInfoSuccess = (paymentData) => {
    // Pass payment data to parent orchestration
    if (onPaymentInfoSuccess) {
      onPaymentInfoSuccess(paymentData);
    }
  };

  // Calculate pre-filled amount for payment modal
  const calculatePreFilledAmount = () => {
    if (formData?.totalAmountDue != null) {
      return Number(formData.totalAmountDue) || 0;
    }
    const appFee = Number(formData?.applicationFee) || 0;
    const baseAmount = Number(formData?.amount) || 0;
    return appFee + baseAmount;
  };

  return (
    <>
      <div className={styles.action_buttons_wrapper}>
        <div className={styles.action_buttons_container}>
          {/* Debug Box for ActionButtons */}
          {showSaveContinue ? (
            <Button
              buttonname="Save & Continue"
              lefticon={<StarTickIcon />}
              onClick={onSaveAndContinue || handleSaleAndConform}
              variant="primary"
              width="auto"
              type="button"
              disabled={isSubmitting}
            />
          ) : (
            <>
              <Button
                buttonname="Proceed to Sale"
                righticon={<BlueArrowIcon />}
                onClick={handleProceedToSale}
                variant="secondary"
                width="auto"
                type="button"
                disabled={isSubmitting}
              />

              <Button
                buttonname="Sale & Conform"
                lefticon={<StarTickIcon />}
                onClick={handleSaleAndConform}
                variant="primary"
                width="auto"
                type="button"
                disabled={isSubmitting}
              />
            </>
          )}
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleCloseModal}
        onPaymentSuccess={handlePaymentInfoSuccess}
        onSubmitCompleteSale={onSubmitCompleteSale}
        preFilledAmount={calculatePreFilledAmount()}
      />

      {/* Snackbar for validation errors */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
        duration={snackbar.severity === "success" ? 3000 : 6000}
        position="top-right"
        transition="slideRightToLeft"
        animation="fadeIn"
        width="50%"
      />
    </>
  );
};

export default ActionButtons;
