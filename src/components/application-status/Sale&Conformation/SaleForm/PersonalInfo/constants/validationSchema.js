import * as Yup from "yup";

// Validation schema with comprehensive rules
// Note: Conditional validation (employeeId, proReceiptNo) is handled in PersonalInformation.jsx via customValidate
export const validationSchema = Yup.object({
  // Basic Info
  firstName: Yup.string()
    .trim()
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name must be less than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "First Name must contain only letters")
    .required("First Name is required"),
  
  surname: Yup.string()
    .trim()
    .min(3, "Surname must be at least 3 characters")
    .max(50, "Surname must be less than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Surname must contain only letters")
    .required("Surname is required"),
  
  // Gender (optional)
  gender: Yup.string(),
  
  // Additional Info
  aaparNo: Yup.string()
    .trim()
    .required("Aapar No is required"),
  
  dateOfBirth: Yup.date()
    .nullable()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future")
    .test("age", "Age must be at least 5 years", function(value) {
      if (!value) return false;
      
      const today = new Date();
      const birthDate = new Date(value);
      
      // Calculate exact age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // If birthday hasn't occurred this year, subtract 1
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 5;
    }),
  
  aadharCardNo: Yup.string()
    .trim()
    .matches(/^\d{12}$/, "Aadhar Card No must be exactly 12 digits")
    .required("Aadhar Card No is required"),
  
  // Dropdown Fields
  quota: Yup.string()
    .required("Quota is required"),
  
  admissionType: Yup.string()
    .required("Admission Type is required"),
  
  // Conditionally required fields - validation handled in component via customValidate
  employeeId: Yup.string(),
  proReceiptNo: Yup.string(),
  
  // Parent Info
  fatherName: Yup.string()
    .trim()
    .min(2, "Father Name must be at least 2 characters")
    .max(50, "Father Name must be less than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Father Name must contain only letters")
    .required("Father Name is required"),
  
  phoneNumber: Yup.string()
    .trim()
    .matches(/^[6-9]\d{9}$/, "Phone Number must be exactly 10 digits starting with 6, 7, 8, or 9")
    .required("Phone Number is required"),
  
  // Profile Photo - No validation required
  profilePhoto: Yup.mixed().nullable(),
  
  // Optional field for backward compatibility
  admissionReferredBy: Yup.string()
});
