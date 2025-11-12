import { Formik, Form } from "formik";
import { useState } from "react";
import { formFields, initialValues } from "./constants/addressConstants";
import { validationSchema } from "./constants/validationSchema";
import { useAddressSubmission } from "./hooks/useAddressSubmission";
import AddressFormTitle from "./components/AddressFormTitle";
import AddressFormGrid from "./components/AddressFormGrid";
import styles from "./AddressInformation.module.css";

const AddressInformation = ({ onSuccess, externalErrors = {}, onClearFieldError, initialValuesOverride }) => {
  
  
  const { isSubmitting, error, handleSubmit } = useAddressSubmission();

  // Track previous values to detect changes
  const [previousValues, setPreviousValues] = useState(initialValues);

  // Function to handle value changes
  const handleValuesChange = (values) => {
    // Check if values have actually changed
    const hasChanged = JSON.stringify(values) !== JSON.stringify(previousValues);
    if (hasChanged && onSuccess) {
      onSuccess(values);
      setPreviousValues(values);
    }
  };


  // Handle form submission with API integration
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      if (onSuccess) {
        onSuccess(values);
      }
      
      setSubmitting(false);
      return { success: true };
    } catch (err) {
      setSubmitting(false);
      return { success: false, error: err.message };
    }
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...(initialValuesOverride || {})
      }}
      validationSchema={validationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
        // Pass data to parent whenever values change
        handleValuesChange(values);

        return (
        <Form>

          {/* Global Error Display */}
          {error && (
            <div className={styles.global_error}>
              {error}
            </div>
          )}

          {/* Address Information Section Title */}
          <AddressFormTitle />

          {/* Form Grid */}
          <AddressFormGrid
            formFields={formFields}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            externalErrors={externalErrors}
            onClearFieldError={onClearFieldError}
          />
        </Form>
        );
      }}
    </Formik>
  );
};

export default AddressInformation;
