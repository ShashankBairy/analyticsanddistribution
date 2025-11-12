import * as Yup from "yup";

/**
 * Validation schemas for AddressInfoSection
 * Extracted from AddressInfoSection.js lines 16-29
 * Preserves every single line and functionality exactly as manager wants
 */

// Validation schema for AddressInfoSection
const validationSchema = Yup.object().shape({
  doorNo: Yup.string().required("Door No is required"),
  street: Yup.string().required("Street is required"),
  landmark: Yup.string().notRequired(),
  area: Yup.string().required("Area is required"),
  stateId: Yup.string().required("State is required"),
  addressCity: Yup.string().required("City is required"),
  district: Yup.string().required("District is required"),
  mandal: Yup.string().required("Mandal is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

export { validationSchema };
