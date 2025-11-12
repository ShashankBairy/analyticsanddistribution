import * as Yup from "yup";

// Validation schema with comprehensive rules for Orientation Information
export const validationSchema = Yup.object({
  // Academic Year - Required text field
  academicYear: Yup.string()
    .trim()
    .required("Academic Year is required")
    .min(3, "Academic Year must be at least 3 characters")
    .max(20, "Academic Year must be less than 20 characters"),
  
  // Branch - Required dropdown
  branch: Yup.string()
    .required("Branch is required"),
  
  // Branch Type - Optional, auto-populated from API
  branchType: Yup.string()
    .notRequired(),
  
  // City - Optional, auto-populated from API
  city: Yup.string()
    .notRequired(),
  
  // Student Type - Required dropdown with filtering
  studentType: Yup.string()
    .required("Student Type is required"),
  
  // Joining Class - Required dropdown, cascading from branch
  joiningClass: Yup.string()
    .required("Joining Class is required"),
  
  // Orientation Name - Required dropdown, cascading from class
  orientationName: Yup.string()
    .required("Orientation Name is required"),
  
  // Optional fields - not required but validated if provided
  admissionType: Yup.string()
    .notRequired(),
  
  // PRO Receipt No - Optional field, conditional validation handled in component
  proReceiptNo: Yup.string()
    .trim()
    .notRequired()
});
