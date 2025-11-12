import * as Yup from "yup";

// Validation schema with comprehensive rules for Address Information
export const validationSchema = Yup.object({
  // Door No - Required text field
  doorNo: Yup.string()
    .trim()
    .required("Door No is required")
    .min(1, "Door No must be at least 1 character")
    .max(20, "Door No must be less than 20 characters"),
  
  // Street Name - Required text field
  streetName: Yup.string()
    .trim()
    .required("Street Name is required")
    .min(2, "Street Name must be at least 2 characters")
    .max(100, "Street Name must be less than 100 characters"),
  
  // Landmark - Optional text field
  landmark: Yup.string()
    .trim()
    .notRequired()
    .max(100, "Landmark must be less than 100 characters"),
  
  // Area - Required text field
  area: Yup.string()
    .trim()
    .required("Area is required")
    .min(2, "Area must be at least 2 characters")
    .max(100, "Area must be less than 100 characters"),
  
  // Pincode - Required, exactly 6 digits
  pincode: Yup.string()
    .trim()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  
  // State - Optional dropdown (auto-populated from pincode)
  state: Yup.string()
    .notRequired(),
  
  // District - Optional dropdown (auto-populated from pincode)
  district: Yup.string()
    .notRequired(),
  
  // Mandal - Required dropdown (cascading from district)
  mandal: Yup.string()
    .required("Mandal is required"),
  
  // City - Required dropdown (cascading from district)
  city: Yup.string()
    .required("City is required"),
  
  // G-pin - Optional search field
  gpin: Yup.string()
    .trim()
    .notRequired()
    .max(200, "G-pin must be less than 200 characters")
});
