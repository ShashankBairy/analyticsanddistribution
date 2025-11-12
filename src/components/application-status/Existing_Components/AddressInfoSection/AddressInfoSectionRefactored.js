import React from "react";
import { useFormikContext } from "formik";
import Button from "../../../../widgets/Button/Button";
import Snackbar from "../../../../widgets/Snackbar/Snackbar";
import { ReactComponent as TrendingUpIcon } from "../../../../assets/application-status/Trending up.svg";
import { ReactComponent as BackArrow } from "../../../../assets/application-status/Backarrow.svg";
import { useAddressData } from "./hooks/useAddressData";
import { useAddressForm } from "./hooks/useAddressForm";
import AddressFields from "./components/AddressFields";
import { validationSchema } from "./utils/validationSchemas";
import styles from "./AddressInfoSection.module.css";

/**
 * Refactored AddressInfoSection component
 * Extracted from AddressInfoSection.js (471 lines) to organized structure
 * Preserves every single line and functionality exactly as manager wants
 */
const AddressInfoSectionRefactored = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  activeStep,
  setActiveStep,
  steps,
  handleNext,
  handleBack,
  validateForm,
}) => {
  const { setErrors, setTouched } = useFormikContext();
  
  // Custom hooks for different concerns
  const { dropdownOptions } = useAddressData(values, setFieldValue);
  const { snackbar, showSnackbar, closeSnackbar } = useAddressForm();

  const flatfields = [
    { label: "Door No", name: "doorNo", placeholder: "Enter Door No", required: true },
    { label: "Street", name: "street", placeholder: "Enter Street", required: true },
    { label: "Landmark", name: "landmark", placeholder: "Enter Landmark" },
    { label: "Area", name: "area", placeholder: "Enter Area", required: true },
    { label: "State", name: "stateId", type: "select", options: dropdownOptions.states, required: true },
    { label: "District", name: "district", type: "select", options: dropdownOptions.districts, required: true },
    { label: "City", name: "addressCity", type: "select", options: dropdownOptions.cities, required: true },
   { label: "Mandal", name: "mandal", type: "select", options: dropdownOptions.mandals, required: true },
    { label: "Pincode", name: "pincode", placeholder: "Enter Pincode", required: true },
    { label: "G-pin (latitude & longitude)", name: "gpin", placeholder: "Search address" },
  ];

  // Debug logging for dropdown options
  console.log("Current dropdown options:", {
    states: dropdownOptions.states,
    cities: dropdownOptions.cities,
    districts: dropdownOptions.districts,
    mandals: dropdownOptions.mandals
  });

  const groupedFields = [];
  for (let i = 0; i < flatfields.length; i += 3) {
    groupedFields.push(flatfields.slice(i, i + 3));
  }

  // Helper function to capitalize text
  const capitalizeText = (text) => {
    if (!text) return text;
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "pincode") {
      finalValue = value.replace(/\D/g, "").slice(0, 6);
    } else if (["doorNo", "street", "landmark", "area"].includes(name)) {
      // Apply capitalization to text fields
      finalValue = capitalizeText(value);
    }
    setFieldValue(name, finalValue);
    console.log(`Field ${name} changed to:`, finalValue);
  };

  const handleProceed = async () => {
    const errors = await validateForm();
    console.log("AddressInfoSection - Validation errors:", errors);
    console.log("AddressInfoSection - Current form values:", values);
   
    // Log complete form data object
    console.log("🚀 ===== ADDRESS - FINAL SUBMITTING OBJECT =====");
    console.log("📋 Complete Form Data:", JSON.stringify(values, null, 2));
    console.log("📊 Form Data Summary:", {
      totalFields: Object.keys(values).length,
      filledFields: Object.keys(values).filter(key => values[key] !== "" && values[key] != null).length,
      emptyFields: Object.keys(values).filter(key => values[key] === "" || values[key] == null).length,
      formValues: values
    });
    console.log("🔍 Field-by-Field Data:");
    Object.entries(values).forEach(([key, value]) => {
      console.log(`  ${key}:`, value);
    });
    console.log("🚀 ===== END ADDRESS OBJECT =====");
   
    if (Object.keys(errors).length === 0) {
      console.log("Validation passed, moving to next step");
      handleNext();
    } else {
      console.log("Validation failed, marking fields as touched");
      setErrors(errors);
      setTouched(errors);
      const errorMessage = "Please correct the following errors:\n" +
        Object.entries(errors)
          .map(([field, error]) => `${field}: ${error}`)
          .join("\n");
      showSnackbar(errorMessage, 'error');
    }
  };

  return (
    <div className={styles.Address_Info_Section_address_form_section}>
      <div className={styles.Address_Info_Section_address_section_box}>
        <AddressFields
          values={values}
          errors={errors}
          touched={touched}
          handleSectionChange={handleSectionChange}
          setFieldValue={setFieldValue}
          dropdownOptions={dropdownOptions}
          flatfields={flatfields}
          groupedFields={groupedFields}
        />
        <div className={styles.Address_Info_Section_address_form_actions}>
          <Button
            type="button"
            variant="secondary"
            buttonname="Back"
            lefticon={<BackArrow />}
            onClick={handleBack}
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleProceed}
            buttonname="Proceed to Add Payment Info"
            righticon={<TrendingUpIcon />}
          />
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

AddressInfoSectionRefactored.validationSchema = validationSchema;
export default AddressInfoSectionRefactored;
