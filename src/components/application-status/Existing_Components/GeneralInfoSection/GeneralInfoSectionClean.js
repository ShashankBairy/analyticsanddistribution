import { useFormikContext } from "formik";
import { useState } from "react";
import Button from "../../../../widgets/Button/Button";
import Snackbar from "../../../../widgets/Snackbar/Snackbar";
import SkipIcon from "../../../../assets/application-status/SkipIcon.svg";
import { ReactComponent as TrendingUpIcon } from "../../../../assets/application-status/Trending up.svg";
import SiblingInfoSection from "../SiblingInfoSection/SiblingInfoSection";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicInfoSection from "./AcademicInfoSection";
import FamilyInfoSection from "./FamilyInfoSection";
import OrientationInfoSection from "./OrientationInfoSection";
import { useGeneralInfoForm } from "./useGeneralInfoForm";
import { useFormHandlers } from "./hooks/useFormHandlers";
import { useCascadingDropdowns } from "./hooks/useCascadingDropdowns";
import { useFormValidation } from "./hooks/useFormValidation";
import styles from "./GeneralInfoSection.module.css";

const GeneralInfoSection = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  setFieldTouched,
  activeStep,
  setActiveStep,
  steps,
  handleNext,
  handleBack,
  validateForm,
}) => {
  const { setErrors, setTouched: setFormikTouched } = useFormikContext();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  // Use the custom hook for form logic
  const {
    dropdownOptions,
    setDropdownOptions,
    loadingStates,
    setLoadingStates,
    persistentErrors,
    setPersistentErrors,
    profilePhotoPreview,
    setProfilePhotoPreview,
    formatDateForDisplay,
    getMaxAdditionalOrientationFee,
    getAdditionalOrientationFeeError,
    capitalizeText,
    validationSchema
  } = useGeneralInfoForm(setFieldValue, values);

  // Form handlers hook
  const { handleSectionChange: baseHandleSectionChange } = useFormHandlers(
    values,
    setFieldValue,
    setFieldTouched,
    setDropdownOptions,
    setLoadingStates,
    setPersistentErrors,
    capitalizeText,
    formatDateForDisplay,
    dropdownOptions,
    setProfilePhotoPreview
  );

  // Cascading dropdowns hook
  const {
    handleSchoolStateChange,
    handleCampusChange,
    handleJoiningClassChange,
    handleBatchTypeChange,
    handleOrientationNameChange,
    handleOrientationBatchChange
  } = useCascadingDropdowns(
    values,
    setFieldValue,
    setFieldTouched,
    setDropdownOptions,
    setLoadingStates
  );

  // Form validation hook
  const { shouldShowError, getFieldError } = useFormValidation(
    values,
    errors,
    touched,
    setFieldTouched,
    setPersistentErrors,
    validationSchema
  );

  // Enhanced handleSectionChange with cascading logic
  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    
    // Call base handler first
    baseHandleSectionChange(e);
    
    // Handle cascading dropdowns
    if (name === "schoolState") {
      handleSchoolStateChange(value);
    } else if (name === "joinedCampus") {
      handleCampusChange(value);
    } else if (name === "joiningClassName") {
      handleJoiningClassChange(value, values.joinedCampus);
    } else if (name === "batchType") {
      handleBatchTypeChange(value, values.joinedCampus, values.joiningClassName);
    } else if (name === "orientationName") {
      handleOrientationNameChange(value, values.joinedCampus, values.joiningClassName, values.batchType);
    } else if (name === "orientationBatch") {
      handleOrientationBatchChange(value, values.joinedCampus, values.joiningClassName, values.batchType, values.orientationName, formatDateForDisplay, setFieldValue);
    }
  };

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

  const handleProceed = async () => {
    console.log("🔍 Starting handleProceed...");
    console.log("🔍 handleNext function:", handleNext);
    console.log("🔍 setFieldValue function:", setFieldValue);
    console.log("🔍 validateForm function:", validateForm);
    console.log("🔍 setFieldTouched function:", setFieldTouched);
    
    // TEMPORARY: Force navigation for testing (validation disabled)
    console.log("🔧 TEMPORARY: Forcing navigation to next step for testing...");
    console.log("🔧 VALIDATION DISABLED - Allowing navigation without validation");
    setPersistentErrors({});
    if (handleNext) {
      console.log("🔍 Calling handleNext with parameters...");
      const result = handleNext(values, setFieldValue, validateForm, setFieldTouched);
      console.log("✅ handleNext called successfully, result:", result);
    } else {
      console.error("❌ handleNext function is not defined!");
    }
    return;
    
    // Original validation logic (commented out for testing)
    /*
    const errors = await validateForm();
    console.log("🔍 Validation errors:", JSON.stringify(errors, null, 2));
    console.log("🔍 Number of errors:", Object.keys(errors).length);
    
    // // MANUALLY ADD joinedCampus to errors if it's empty
    // if (!values.joinedCampus || values.joinedCampus.trim() === '') {
    //   errors.joinedCampus = "Joined Campus/Branch is required";
    //   console.log("🔧 MANUALLY ADDED joinedCampus to errors:", errors.joinedCampus);
    // }
   
    // Log complete form data object
    console.log("🚀 ===== FINAL SUBMITTING OBJECT =====");
    console.log("📋 Complete Form Data:", JSON.stringify(values, null, 2));
    console.log("🚀 ===== END SUBMITTING OBJECT =====");
   
    if (Object.keys(errors).length === 0) {
      console.log("✅ Validation passed, moving to next step");
      console.log("🔍 Calling handleNext function...");
      setPersistentErrors({});
      if (handleNext) {
        // Call handleNext with the required parameters
        const result = handleNext(values, setFieldValue, validateForm, setFieldTouched);
        console.log("✅ handleNext called successfully, result:", result);
      } else {
        console.error("❌ handleNext function is not defined!");
      }
    } else {
      console.log("❌ Validation failed, marking fields as touched");
      console.log("🔍 Error keys:", Object.keys(errors));
      setErrors(errors);
      setFormikTouched(Object.fromEntries(Object.keys(errors).map(key => [key, true])));
      setPersistentErrors(errors);
    }
    */
  };

  const handleRemoveAnnexure = (removeIndex) => {
    const existingFiles = Array.isArray(values.annexure) ? [...values.annexure] : [];
    const nextFiles = existingFiles.filter((_, i) => i !== removeIndex);
    setFieldValue("annexure", nextFiles);
  };

  return (
    <div className={styles.General_Info_Section_general_form_section}>
      <div className={styles.General_Info_Section_general_section_box}>
        <div style={{ marginBottom: "20px" }}>
          <PersonalInfoSection
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            handleSectionChange={handleSectionChange}
            shouldShowError={(fieldName) => shouldShowError(fieldName, errors, touched, persistentErrors, getAdditionalOrientationFeeError)}
            getFieldError={(fieldName) => getFieldError(fieldName, errors, persistentErrors, getAdditionalOrientationFeeError)}
            dropdownOptions={dropdownOptions}
            loadingStates={loadingStates}
            profilePhotoPreview={profilePhotoPreview}
            setProfilePhotoPreview={setProfilePhotoPreview}
            capitalizeText={capitalizeText}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <AcademicInfoSection
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            handleSectionChange={handleSectionChange}
            shouldShowError={(fieldName) => shouldShowError(fieldName, errors, touched, persistentErrors, getAdditionalOrientationFeeError)}
            getFieldError={(fieldName) => getFieldError(fieldName, errors, persistentErrors, getAdditionalOrientationFeeError)}
            dropdownOptions={dropdownOptions}
            loadingStates={loadingStates}
            capitalizeText={capitalizeText}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <FamilyInfoSection
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            handleSectionChange={handleSectionChange}
            shouldShowError={(fieldName) => shouldShowError(fieldName, errors, touched, persistentErrors, getAdditionalOrientationFeeError)}
            getFieldError={(fieldName) => getFieldError(fieldName, errors, persistentErrors, getAdditionalOrientationFeeError)}
            dropdownOptions={dropdownOptions}
            loadingStates={loadingStates}
            capitalizeText={capitalizeText}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <OrientationInfoSection
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            handleSectionChange={handleSectionChange}
            shouldShowError={(fieldName) => shouldShowError(fieldName, errors, touched, persistentErrors, getAdditionalOrientationFeeError)}
            getFieldError={(fieldName) => getFieldError(fieldName, errors, persistentErrors, getAdditionalOrientationFeeError)}
            dropdownOptions={dropdownOptions}
            loadingStates={loadingStates}
            capitalizeText={capitalizeText}
            formatDateForDisplay={formatDateForDisplay}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <SiblingInfoSection
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            dropdownOptions={dropdownOptions}
            loadingStates={loadingStates}
          />
        </div>
        
        <div className={styles.General_Info_Section_general_form_actions} style={{ justifyContent: "center", marginTop: "20px", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <Button
            type="button"
            variant="primary"
            onClick={handleProceed}
            buttonname="Proceed to Add Concession"
            righticon={<TrendingUpIcon />}
          />
          <a
            href="#"
            className={styles.linkButton}
            onClick={async (e) => {
              e.preventDefault();
              console.log("🔍 Skip button clicked");
              console.log("🔍 setActiveStep function:", setActiveStep);
              
              // TEMPORARY: Force navigation for testing (validation disabled)
              console.log("🔧 TEMPORARY: Forcing skip to step 3 for testing...");
              console.log("🔧 VALIDATION DISABLED - Allowing skip without validation");
              if (setActiveStep) {
                setActiveStep(3);
                console.log("✅ setActiveStep(3) called successfully");
              } else {
                console.error("❌ setActiveStep function is not defined!");
              }
              return;
              
              // Original validation logic (commented out for testing)
              /*
              const errors = await validateForm();
              console.log("🔍 Skip validation errors:", Object.keys(errors).length);
             
              if (Object.keys(errors).length === 0) {
                console.log("🔍 Skip: Validation passed, setting activeStep to 3");
                if (setActiveStep) {
                  setActiveStep(3);
                  console.log("✅ setActiveStep(3) called successfully");
                } else {
                  console.error("❌ setActiveStep function is not defined!");
                }
              } else {
                console.log("🔍 Skip: Validation failed, showing errors");
                setErrors(errors);
                setFormikTouched(Object.fromEntries(Object.keys(errors).map(key => [key, true])));
              }
              */
            }}
          >
            <figure style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <img src={SkipIcon} alt="Skip" style={{ width: 24, height: 24 }} />
            </figure>
            Skip all and proceed to payments
          </a>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
        position="bottom-center"
      />
    </div>
  );
};

export default GeneralInfoSection;
