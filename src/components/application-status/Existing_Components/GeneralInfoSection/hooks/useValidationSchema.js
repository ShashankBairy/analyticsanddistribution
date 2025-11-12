import * as Yup from "yup";

// Helper function to capitalize text
export const capitalizeText = (text) => {
  if (!text) return text;
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Validation schema
export const validationSchema = Yup.object().shape({
  // category: Yup.string().required("Category is required"),
  // htNo: Yup.string().matches(/^\d+$/, "HT No must be numeric"),
  // aadhar: Yup.string()
  //   .required("Aadhaar Card No is required")
  //   .matches(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
  // admissionType: Yup.string().required("Admission Type is required"),
  // surname: Yup.string().required("Surname is required"),
  // firstName: Yup.string().required("First Name is required"),
  // fatherName: Yup.string().required("Father Name is required"),
  // fatherPhoneNumber: Yup.string()
  //   .required("Phone Number is required")
  //   .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
  // motherPhoneNumber: Yup.string()
  //   .required("Phone Number is required")
  //   .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
  // dob: Yup.date()
  //   .required("Date of Birth is required")
  //   .nullable()
  //   .max(new Date(), "Date of Birth cannot be in the future")
  //   .test("age-range", "Student must be between 5 and 18 years old", (value) => {
  //     if (!value) return false;
  //     const today = new Date();
  //     const birthDate = new Date(value);
  //     const age = today.getFullYear() - birthDate.getFullYear();
  //     const monthDiff = today.getMonth() - birthDate.getMonth();
  //     const dayDiff = today.getDate() - birthDate.getDate();
  //     const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  //     return adjustedAge >= 5 && adjustedAge <= 18;
  //   }),
  // gender: Yup.string().required("Gender is required"),
  // studentType: Yup.string().required("Student Type is required"),
  // joinedCampus: Yup.string()
  //   .required("Joined Campus/Branch is required")
  //   .test('campus-validation', 'Joined Campus/Branch is required', function(value) {
  //     return value && value.trim() !== '';
  //   }),
  // joiningClassName: Yup.string().required("Joining Class is required"),
  // batchType: Yup.string().required("Batch Type is required"),
  // orientationName: Yup.string().required("Orientation Name is required"),
  // orientationBatch: Yup.string().required("Orientation Batch is required"),
  // orientationDates: Yup.date().required("Orientation Dates is required"),
  // OrientationFee: Yup.string().required("Orientation Fee is required"),
  // schoolState: Yup.string().required("School State is required"),
  // schoolDistrict: Yup.string().required("School District is required"),
  // schoolType: Yup.string().required("School Type is required"),
  // additionalOrientationFee: Yup.string()
  //   .test('additional-fee-validation', 'Additional orientation fee cannot exceed 50% of orientation fee', function(value) {
  //     const orientationFee = this.parent.OrientationFee;
  //     if (!value || !orientationFee) return true;
      
  //     const additionalFee = parseFloat(value) || 0;
  //     const orientationFeeValue = parseFloat(orientationFee) || 0;
  //     const maxAllowed = Math.floor(orientationFeeValue / 2);
      
  //     return additionalFee <= maxAllowed;
  //   }),
  // // Sibling information validation
  // "siblingInformation.0.fullName": Yup.string().when("siblingInformation.0.relationType", {
  //   is: (val) => val && val.trim() !== "",
  //   then: (schema) => schema.required("Sibling Full Name is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // "siblingInformation.0.relationType": Yup.string().notRequired(),
  // "siblingInformation.0.schoolName": Yup.string().when("siblingInformation.0.relationType", {
  //   is: (val) => val && val.trim() !== "",
  //   then: (schema) => schema.required("Sibling School Name is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // // Additional fields
  // religion: Yup.string().notRequired(),
  // caste: Yup.string().notRequired(),
  // bloodGroup: Yup.string().notRequired(),
  // appFee: Yup.string().notRequired(),
  // fee: Yup.string().notRequired(),
  // totalFee: Yup.string().notRequired(),
  // scoreAppNo: Yup.string().notRequired(),
  // marks: Yup.string().notRequired(),
  // admissionReferredBy: Yup.string().notRequired(),
  // quota: Yup.string().notRequired(),
  // motherName: Yup.string().notRequired(),
  // motherOccupation: Yup.string().notRequired(),
  // fatherOccupation: Yup.string().notRequired(),
  // foodprefrence: Yup.string().notRequired(),
  // schoolName: Yup.string().notRequired(),
});

// Export validation schema for external use
export const generalInfoValidationSchema = Yup.object().shape({
  // htNo: Yup.string().matches(/^\d+$/, "HT No must be numeric"),
  // aadhar: Yup.string()
  //   .required("Aadhaar Card No is required")
  //   .matches(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
  // admissionType: Yup.string().required("Admission Type is required"),
  // surname: Yup.string().required("Surname is required"),
  // firstName: Yup.string().required("First Name is required"),
  // fatherName: Yup.string().required("Father Name is required"),
  // fatherPhoneNumber: Yup.string()
  //   .required("Phone Number is required")
  //   .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
  // motherPhoneNumber: Yup.string()
  //   .required("Phone Number is required")
  //   .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
  // dob: Yup.date()
  //   .required("Date of Birth is required")
  //   .nullable()
  //   .max(new Date(), "Date of Birth cannot be in the future")
  //   .test("age-range", "Student must be between 5 and 18 years old", (value) => {
  //     if (!value) return false;
  //     const today = new Date();
  //     const birthDate = new Date(value);
  //     const age = today.getFullYear() - birthDate.getFullYear();
  //     const monthDiff = today.getMonth() - birthDate.getMonth();
  //     const dayDiff = today.getDate() - birthDate.getDate();
  //     const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  //     return adjustedAge >= 5 && adjustedAge <= 18;
  //   }),
  // gender: Yup.string().required("Gender is required"),
  // studentType: Yup.string().required("Student Type is required"),
  // joinedCampus: Yup.string()
  //   .required("Joined Campus/Branch is required")
  //   .test('campus-validation', 'Joined Campus/Branch is required', function(value) {
  //     return value && value.trim() !== '';
  //   }),
  // joiningClassName: Yup.string().required("Joining Class is required"),
  // batchType: Yup.string().required("Batch Type is required"),
  // orientationName: Yup.string().required("Orientation Name is required"),
  // orientationBatch: Yup.string().required("Orientation Batch is required"),
  // orientationDates: Yup.date().required("Orientation Dates is required"),
  // OrientationFee: Yup.string().required("Orientation Fee is required"),
  // schoolState: Yup.string().required("School State is required"),
  // schoolDistrict: Yup.string().required("School District is required"),
  // schoolType: Yup.string().required("School Type is required"),
  // additionalOrientationFee: Yup.string()
  //   .test('additional-fee-validation', 'Additional orientation fee cannot exceed 50% of orientation fee', function(value) {
  //     const orientationFee = this.parent.OrientationFee;
  //     if (!value || !orientationFee) return true;
      
  //     const additionalFee = parseFloat(value) || 0;
  //     const orientationFeeValue = parseFloat(orientationFee) || 0;
  //     const maxAllowed = Math.floor(orientationFeeValue / 2);
      
  //     return additionalFee <= maxAllowed;
  //   }),
  // // Sibling information validation
  // "siblingInformation.0.fullName": Yup.string().when("siblingInformation.0.relationType", {
  //   is: (val) => val && val.trim() !== "",
  //   then: (schema) => schema.required("Sibling Full Name is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // "siblingInformation.0.relationType": Yup.string().notRequired(),
  // "siblingInformation.0.schoolName": Yup.string().when("siblingInformation.0.relationType", {
  //   is: (val) => val && val.trim() !== "",
  //   then: (schema) => schema.required("Sibling School Name is required"),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // // Additional fields
  // religion: Yup.string().notRequired(),
  // caste: Yup.string().notRequired(),
  // bloodGroup: Yup.string().notRequired(),
  // appFee: Yup.string().notRequired(),
  // fee: Yup.string().notRequired(),
  // totalFee: Yup.string().notRequired(),
  // scoreAppNo: Yup.string().notRequired(),
  // marks: Yup.string().notRequired(),
  // admissionReferredBy: Yup.string().notRequired(),
  // quota: Yup.string().notRequired(),
  // motherName: Yup.string().notRequired(),
  // motherOccupation: Yup.string().notRequired(),
  // fatherOccupation: Yup.string().notRequired(),
  // foodprefrence: Yup.string().notRequired(),
  // schoolName: Yup.string().notRequired(),
});
