import * as Yup from "yup";

/**
 * Validation schemas for ConcessionInfoSection
 * Extracted from ConcessionInfoSection.js lines 300-366
 * Preserves every single line and functionality exactly as manager wants
 */

// Base validation schema
const baseValidationSchema = Yup.object().shape({
  givenBy: Yup.string().when("yearConcession1st", {
    is: (val) => val && val.toString().trim() !== "" && Number(val) > 0,
    then: (schema) => schema.required("Given By is required when concession is applied"),
  }),
  givenById: Yup.string().when("yearConcession1st", {
    is: (val) => val && val.toString().trim() !== "" && Number(val) > 0,
    then: (schema) => schema.required("Given By is required when concession is applied"),
  }),
  authorizedBy: Yup.string().when("yearConcession1st", {
    is: (val) => val && val.toString().trim() !== "" && Number(val) > 0,
    then: (schema) => schema.required("Authorized By is required when concession is applied"),
  }),
  authorizedById: Yup.string().when("yearConcession1st", {
    is: (val) => val && val.toString().trim() !== "" && Number(val) > 0,
    then: (schema) => schema.required("Authorized By is required when concession is applied"),
  }),
  reason: Yup.string().when("yearConcession1st", {
    is: (val) => val && val.toString().trim() !== "" && Number(val) > 0,
    then: (schema) => schema.required("Reason is required when concession is applied"),
  }),
  concessionReasonId: Yup.string().when("yearConcession1st", {
    is: (val) => val && val.toString().trim() !== "" && Number(val) > 0,
    then: (schema) => schema.required("Reason is required when concession is applied"),
  }),
  concessionWrittenBy: Yup.string().when("yearConcession1st", {
    is: (val) => val && val.toString().trim() !== "" && Number(val) > 0,
    then: (schema) => schema.required("Written By is required when concession is applied"),
  }),
  concessionWrittenById: Yup.string().when("yearConcession1st", {
    is: (val) => val && val.toString().trim() !== "" && Number(val) > 0,
    then: (schema) => schema.required("Written By is required when concession is applied"),
  }),
  mobileNumber: Yup.string().when("showMobileNumber", {
    is: true,
    then: (schema) => schema.required("Mobile Number is required").matches(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
  }),
  additionalConcession: Yup.boolean(),
  additionalReason: Yup.string().when("additionalConcession", {
    is: true,
    then: (schema) => schema.required("Reason is required when additional concession is selected"),
  }),
});

// Custom validation function to handle mobileNumber conditionally
const customValidate = (values, showMobileNumber) => {
  const errors = {};
  if (showMobileNumber) {
    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(values.mobileNumber)) {
      errors.mobileNumber = "Mobile Number must be exactly 10 digits";
    }
  }
  return errors;
};

// Create the final validation schema that combines base schema with custom validation
const concessionValidationSchema = baseValidationSchema;

export { 
  baseValidationSchema, 
  customValidate, 
  concessionValidationSchema 
};
