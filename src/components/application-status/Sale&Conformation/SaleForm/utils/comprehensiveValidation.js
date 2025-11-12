import * as Yup from "yup";

// Comprehensive validation schema for all forms combined
export const comprehensiveValidationSchema = Yup.object({
  // Personal Information Fields
  firstName: Yup.string()
    .trim()
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name must be less than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "First Name must contain only letters")
    .required("First Name is required"),
  
  surname: Yup.string()
    .trim()
    .min(2, "Surname must be at least 2 characters")
    .max(50, "Surname must be less than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Surname must contain only letters")
    .required("Surname is required"),
  
  gender: Yup.string()
    .required("Gender is required"),
  
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
  
  quota: Yup.string()
    .required("Quota is required"),
  
  admissionType: Yup.string()
    .required("Admission Type is required"),
  
  // Family Information Fields
  fatherName: Yup.string()
    .trim()
    .min(2, "Father Name must be at least 2 characters")
    .max(50, "Father Name must be less than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Father Name must contain only letters")
    .required("Father Name is required"),
  
  fatherPhoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Father phone number must be exactly 10 digits")
    .required("Father phone number is required"),
  
  fatherEmail: Yup.string()
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
  
  fatherSector: Yup.string()
    .max(100, "Sector must not exceed 100 characters"),
  
  fatherOccupation: Yup.string()
    .max(100, "Occupation must not exceed 100 characters"),
  
  fatherOtherOccupation: Yup.string()
    .max(100, "Other occupation must not exceed 100 characters"),
  
  motherName: Yup.string()
    .trim()
    .min(2, "Mother Name must be at least 2 characters")
    .max(50, "Mother Name must be less than 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Mother Name must contain only letters")
    .required("Mother Name is required"),
  
  motherPhoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Mother phone number must be exactly 10 digits")
    .required("Mother phone number is required"),
  
  motherEmail: Yup.string()
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
  
  motherSector: Yup.string()
    .max(100, "Sector must not exceed 100 characters"),
  
  motherOccupation: Yup.string()
    .max(100, "Occupation must not exceed 100 characters"),
  
  motherOtherOccupation: Yup.string()
    .max(100, "Other occupation must not exceed 100 characters"),
  
  // Academic Information Fields
  orientationBatch: Yup.string()
    .required("Orientation Batch is required"),
  
  schoolState: Yup.string()
    .required("School State is required"),
  
  schoolDistrict: Yup.string()
    .required("School District is required"),
  
  schoolName: Yup.string()
    .trim()
    .min(2, "School Name must be at least 2 characters")
    .max(100, "School Name must be less than 100 characters")
    .required("School Name is required"),
  
  marks: Yup.string()
    .required("Marks are required"),
  
  bloodGroup: Yup.string()
    .required("Blood Group is required"),
  
  caste: Yup.string()
    .required("Caste is required"),
  
  religion: Yup.string()
    .required("Religion is required"),
  
  foodType: Yup.string()
    .required("Food Type is required"),
  
  schoolType: Yup.string()
    .required("School Type is required"),
  
  // Concession Information Fields (optional)
  // givenBy: Yup.string()
  //   .required("Given By is required"), // Removed - optional field
  
  // authorizedBy: Yup.string()
  //   .required("Authorized By is required"), // Removed - optional field
  
  // reason: Yup.string()
  //   .required("Reason is required"), // Removed - optional field
  
  phoneNumber: Yup.string()
    .trim()
    .matches(/^[6-9]\d{9}$/, "Phone Number must be exactly 10 digits starting with 6, 7, 8, or 9")
    .required("Phone Number is required"),

  // Orientation Information Fields
  academicYear: Yup.string()
    .trim()
    .required("Academic Year is required")
    .min(3, "Academic Year must be at least 3 characters")
    .max(20, "Academic Year must be less than 20 characters"),
  
  branch: Yup.string()
    .required("Branch is required"),
  
  branchType: Yup.string()
    .required("Branch Type is required"),
  
  city: Yup.string()
    .required("City is required"),
  
  studentType: Yup.string()
    .required("Student Type is required"),
  
  joiningClass: Yup.string()
    .required("Joining Class is required"),
  
  orientationName: Yup.string()
    .required("Orientation Name is required"),

  // Address Information Fields
  doorNo: Yup.string()
    .trim()
    .required("Door No is required")
    .min(1, "Door No must be at least 1 character")
    .max(20, "Door No must be less than 20 characters"),
  
  streetName: Yup.string()
    .trim()
    .required("Street Name is required")
    .min(2, "Street Name must be at least 2 characters")
    .max(100, "Street Name must be less than 100 characters"),
  
  area: Yup.string()
    .trim()
    .required("Area is required")
    .min(2, "Area must be at least 2 characters")
    .max(100, "Area must be less than 100 characters"),
  
  pincode: Yup.string()
    .trim()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  
  state: Yup.string()
    .required("State is required"),
  
  district: Yup.string()
    .required("District is required"),
  
  mandal: Yup.string()
    .required("Mandal is required")
});

// Function to validate all form data comprehensively
export const validateAllForms = async (formData, currentStep = 2, category = 'COLLEGE') => {
  try {
    // Add defensive check for formData
    if (!formData || typeof formData !== 'object') {
      console.error('Invalid formData provided:', formData);
      return {
        isValid: false,
        errors: { general: 'No form data provided for validation' }
      };
    }

    console.log('Starting validation with formData:', formData);
    console.log('🔍 Orientation Name in formData:', formData.orientationName);
    console.log('🔍 Current Step:', currentStep);
    console.log('🔍 Category:', category);
    
    // Debug: Log specific fields being validated
    console.log('🔍 Validation Debug - Academic Fields:', {
      orientationBatch: formData.orientationBatch,
      schoolState: formData.schoolState,
      schoolDistrict: formData.schoolDistrict,
      schoolName: formData.schoolName,
      scoreMarks: formData.scoreMarks, // Changed from 'marks' to 'scoreMarks'
      bloodGroup: formData.bloodGroup,
      caste: formData.caste,
      religion: formData.religion,
      foodType: formData.foodType,
      schoolType: formData.schoolType
    });
    
    console.log('🔍 Validation Debug - Concession Fields:', {
      givenBy: formData.givenBy,
      authorizedBy: formData.authorizedBy,
      reason: formData.reason
    });
    
    // Since both OrientationInfo and AddressInfo use 'city' field, we need to handle this conflict
    // We'll validate each form section separately and then combine the results
    
    // Personal Information validation
    const personalFields = {
      firstName: formData.firstName || '',
      surname: formData.surname || '',
      gender: formData.gender || '',
      aaparNo: formData.aaparNo || '',
      dateOfBirth: formData.dateOfBirth || '',
      aadharCardNo: formData.aadharCardNo || '',
      quota: formData.quota || '',
      admissionType: formData.admissionType || '',
      fatherName: formData.fatherName || '',
      fatherPhoneNumber: formData.fatherPhoneNumber || '',
      fatherEmail: formData.fatherEmail || '',
      fatherSector: formData.fatherSector || '',
      fatherOccupation: formData.fatherOccupation || '',
      fatherOtherOccupation: formData.fatherOtherOccupation || '',
      motherName: formData.motherName || '',
      motherPhoneNumber: formData.motherPhoneNumber || '',
      motherEmail: formData.motherEmail || '',
      motherSector: formData.motherSector || '',
      motherOccupation: formData.motherOccupation || '',
      motherOtherOccupation: formData.motherOtherOccupation || '',
      // phoneNumber: formData.phoneNumber || '', // Removed - not part of Family Information
      // Academic Information fields
      orientationName: formData.orientationName || '',
      orientationBatch: formData.orientationBatch || '',
      schoolState: formData.schoolState || '',
      schoolDistrict: formData.schoolDistrict || '',
      schoolName: formData.schoolName || '',
      scoreMarks: formData.scoreMarks || '', // Changed from 'marks' to 'scoreMarks'
      bloodGroup: formData.bloodGroup || '',
      caste: formData.caste || '',
      religion: formData.religion || '',
      foodType: formData.foodType || '',
      schoolType: formData.schoolType || '',
      // Concession Information fields
      givenBy: formData.givenBy || '',
      authorizedBy: formData.authorizedBy || '',
      reason: formData.reason || ''
    };
    
    // Address Information validation (we'll check if address city exists separately)
    const addressFields = {
      doorNo: formData.doorNo || '',
      streetName: formData.streetName || '',
      area: formData.area || '',
      pincode: formData.pincode || '',
      state: formData.state || '',
      district: formData.district || '',
      mandal: formData.mandal || ''
    };
    
    // Only validate forms that are relevant to the current step
    const personalErrors = {};
    const addressErrors = {};
    
    if (currentStep === 1) {
      // Step 1: Personal Information + Orientation Information + Address Information
      // Create a separate object with only Step 1 fields
      const step1Fields = {
        // Personal Information fields
        firstName: formData.firstName || '',
        surname: formData.surname || '',
        gender: formData.gender || '',
        aaparNo: formData.aaparNo || '',
        dateOfBirth: formData.dateOfBirth || null,
        aadharCardNo: formData.aadharCardNo || '',
        quota: formData.quota || '',
        admissionType: formData.admissionType || '',
        phoneNumber: formData.phoneNumber || '',
        fatherName: formData.fatherName || '',
        // Orientation Information fields
        academicYear: formData.academicYear || '',
        branch: formData.branch || '',
        branchType: formData.branchType || '',
        city: formData.city || '',
        studentType: formData.studentType || '',
        joiningClass: formData.joiningClass || '',
        orientationName: formData.orientationName || '',
        // Address Information fields
        doorNo: formData.doorNo || '',
        streetName: formData.streetName || '',
        area: formData.area || '',
        pincode: formData.pincode || '',
        mandal: formData.mandal || '',
        addressCity: formData.city || '' // Address city field
      };
      
      try {
        console.log('Validating Step 1 forms (Personal + Orientation + Address)');
        console.log('🔍 Step 1 fields being validated:', step1Fields);
        console.log('🔍 admissionType debug - formData.admissionType:', formData.admissionType);
        console.log('🔍 admissionType debug - typeof formData.admissionType:', typeof formData.admissionType);
        console.log('🔍 admissionType debug - step1Fields.admissionType:', step1Fields.admissionType);
        console.log('🔍 admissionType debug - typeof step1Fields.admissionType:', typeof step1Fields.admissionType);
        console.log('🔍 dateOfBirth debug - formData.dateOfBirth:', formData.dateOfBirth);
        console.log('🔍 dateOfBirth debug - typeof formData.dateOfBirth:', typeof formData.dateOfBirth);
        console.log('🔍 dateOfBirth debug - step1Fields.dateOfBirth:', step1Fields.dateOfBirth);
        console.log('🔍 dateOfBirth debug - typeof step1Fields.dateOfBirth:', typeof step1Fields.dateOfBirth);
        console.log('🔍 city debug - formData.city:', formData.city);
        console.log('🔍 city debug - typeof formData.city:', typeof formData.city);
        console.log('🔍 city debug - step1Fields.city:', step1Fields.city);
        console.log('🔍 city debug - typeof step1Fields.city:', typeof step1Fields.city);
        console.log('🔍 addressCity debug - formData.city:', formData.city);
        console.log('🔍 addressCity debug - step1Fields.addressCity:', step1Fields.addressCity);
        
        await Yup.object({
          // Personal Information fields
          firstName: Yup.string().trim().min(2).max(50).matches(/^[A-Za-z\s]+$/).required(),
          surname: Yup.string().trim().min(3).max(50).matches(/^[A-Za-z\s]+$/).required(),
          // gender is optional per requirement
          gender: Yup.string(),
          aaparNo: Yup.string().trim().required(),
          dateOfBirth: Yup.date()
          .nullable()
          .required("Date of Birth is required")
          .max(new Date(), "Date of Birth cannot be in the future")
          .test("age", "Invalid age for the selected category", function(value) {
            if (!value) return true; // Let required handle it
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (category === 'SCHOOL') {
                if (age <= 3) {
                  return this.createError({ path: 'dateOfBirth', message: 'Age must be more than 3 years for School' });
                }
            } else if (category === 'COLLEGE' || category === 'DEGREE') {
                if (age <= 15) {
                  return this.createError({ path: 'dateOfBirth', message: 'Age must be more than 15 years for College/Degree' });
                }
            }
            return true;
          }),
          aadharCardNo: Yup.string().trim().matches(/^\d{12}$/).required(),
          quota: Yup.string().required(),
          admissionType: Yup.mixed().test('required', 'Admission Type is required', function(value) {
            return value !== undefined && value !== null && value !== '';
          }),
          phoneNumber: Yup.string().trim().matches(/^[6-9]\d{9}$/).required(),
          fatherName: Yup.string().trim().min(2).max(50).matches(/^[A-Za-z\s]+$/).required(),
          // Orientation Information fields
          academicYear: Yup.string().trim().required(),
          branch: Yup.string().required(),
          studentType: Yup.string().required(),
          joiningClass: Yup.string().required(),
          orientationName: Yup.string().required(),
          // Address Information fields
          doorNo: Yup.string().trim().required(),
          streetName: Yup.string().trim().required(),
          area: Yup.string().trim().required(),
          pincode: Yup.string().trim().matches(/^\d{6}$/).required(),
          mandal: Yup.string().required(),
          addressCity: Yup.string().required()
        }).validate(step1Fields, { abortEarly: false });
      } catch (error) {
        console.log('Step 1 validation error:', error);
        console.log('🔍 Step 1 validation error details:', {
          message: error.message,
          inner: error.inner,
          innerCount: error.inner ? error.inner.length : 0
        });
        if (error.inner) {
          error.inner.forEach(err => {
        console.log('🔍 Step 1 validation field error:', err.path, ':', err.message);
        if (err.path === 'addressCity') {
          console.log('🔍 ADDRESS CITY FIELD ERROR DETECTED:', err.message);
        }
        personalErrors[err.path] = err.message;
          });
        } else {
          personalErrors.general = error.message;
        }
        console.log('🔍 Step 1 personalErrors after processing:', personalErrors);
      }
    } else if (currentStep === 2) {
      // Step 2: Family Information + Academic Information + Concession Information
      // Create a separate object with only Step 2 fields
      const step2Fields = {
        // Family Information fields
        fatherName: formData.fatherName || '',
        fatherPhoneNumber: formData.fatherPhoneNumber || '',
        fatherEmail: formData.fatherEmail || '',
        fatherSector: formData.fatherSector || '',
        fatherOccupation: formData.fatherOccupation || '',
        fatherOtherOccupation: formData.fatherOtherOccupation || '',
        motherName: formData.motherName || '',
        motherPhoneNumber: formData.motherPhoneNumber || '',
        motherEmail: formData.motherEmail || '',
        motherSector: formData.motherSector || '',
        motherOccupation: formData.motherOccupation || '',
        motherOtherOccupation: formData.motherOtherOccupation || '',
        // Academic Information fields
        orientationBatch: formData.orientationBatch || '',
        schoolState: formData.schoolState || '',
        schoolDistrict: formData.schoolDistrict || '',
        schoolName: formData.schoolName || '',
        scoreMarks: formData.scoreMarks || '',
        bloodGroup: formData.bloodGroup || '',
        caste: formData.caste || '',
        religion: formData.religion || '',
        foodType: formData.foodType || '',
        schoolType: formData.schoolType || '',
        // Concession Information fields
        yearConcession1st: formData.yearConcession1st || '',
        yearConcession2nd: formData.yearConcession2nd || '',
        yearConcession3rd: formData.yearConcession3rd || '',
        admissionFee: formData.admissionFee || '',
        tuitionFee: formData.tuitionFee || '',
        givenBy: formData.givenBy || '',
        authorizedBy: formData.authorizedBy || '',
        reason: formData.reason || ''
      };
      
      try {
        console.log('Validating Step 2 forms (Family + Academic + Concession)');
        console.log('🔍 Step 2 fields being validated:', step2Fields);
        console.log('🔍 Category for validation:', category);
        
        // Create conditional validation schema based on category
        // NOTE: Family Information fields are deliberately NOT validated here (per requirement)
        let validationSchema = {
          // Academic Information fields - conditional based on category
          // orientationName: Yup.string().required(), // Removed - handled by Formik
          // scoreMarks: Yup.string().required(), // Removed - validation not required
          bloodGroup: Yup.string().required(),
          caste: Yup.string().required(),
          religion: Yup.string().required(),
          foodType: Yup.string().required(),

          // Concession Information fields - conditional validation
          // If any concession amount is entered, Given By, Authorized By, and Reason become required
          // Concession amount fields should only contain numbers (and optional decimal point)
          yearConcession1st: Yup.string().matches(/^$|^[0-9]+(\.[0-9]+)?$/, "Only numbers are allowed"),
          yearConcession2nd: Yup.string().matches(/^$|^[0-9]+(\.[0-9]+)?$/, "Only numbers are allowed"),
          yearConcession3rd: Yup.string().matches(/^$|^[0-9]+(\.[0-9]+)?$/, "Only numbers are allowed"),
          admissionFee: Yup.string().matches(/^$|^[0-9]+(\.[0-9]+)?$/, "Only numbers are allowed"),
          tuitionFee: Yup.string().matches(/^$|^[0-9]+(\.[0-9]+)?$/, "Only numbers are allowed"),
          givenBy: Yup.string().when(['yearConcession1st', 'yearConcession2nd', 'yearConcession3rd', 'admissionFee', 'tuitionFee'], {
            is: (yearConcession1st, yearConcession2nd, yearConcession3rd, admissionFee, tuitionFee) => {
              const checkValue = (val) => val && String(val).trim() !== '';
              const hasConcession = 
                checkValue(yearConcession1st) ||
                checkValue(yearConcession2nd) ||
                checkValue(yearConcession3rd) ||
                checkValue(admissionFee) ||
                checkValue(tuitionFee);
              return hasConcession;
            },
            then: (schema) => schema.required("Given By is required when concession information is provided"),
            otherwise: (schema) => schema
          }),
          authorizedBy: Yup.string().when(['yearConcession1st', 'yearConcession2nd', 'yearConcession3rd', 'admissionFee', 'tuitionFee'], {
            is: (yearConcession1st, yearConcession2nd, yearConcession3rd, admissionFee, tuitionFee) => {
              const checkValue = (val) => val && String(val).trim() !== '';
              const hasConcession = 
                checkValue(yearConcession1st) ||
                checkValue(yearConcession2nd) ||
                checkValue(yearConcession3rd) ||
                checkValue(admissionFee) ||
                checkValue(tuitionFee);
              return hasConcession;
            },
            then: (schema) => schema.required("Authorized By is required when concession information is provided"),
            otherwise: (schema) => schema
          }),
          reason: Yup.string() // Reason is optional even when concession amounts are entered
        };
        
        // Add school-specific fields only for COLLEGE category
        if (category === 'COLLEGE') {
          console.log('🏫 COLLEGE category - adding school-specific validations');
          validationSchema = {
            ...validationSchema,
            orientationBatch: Yup.string().required(),
            schoolState: Yup.string().required(),
            schoolDistrict: Yup.string().required(),
            schoolName: Yup.string().trim().min(2).max(100).required(),
            schoolType: Yup.string().required()
          };
        } else {
          console.log('🏫 SCHOOL category - skipping school-specific validations');
        }
        
        await Yup.object(validationSchema).validate(step2Fields, { abortEarly: false });
      } catch (error) {
        console.log('Step 2 validation error:', error);
        if (error.inner) {
          error.inner.forEach(err => {
            personalErrors[err.path] = err.message;
          });
        } else {
          personalErrors.general = error.message;
        }
      }
    }
    
    // Skip Orientation Information validation - let Formik handle it locally
    console.log('Skipping orientation fields validation - using local Formik validation instead');
    // Orientation fields will be validated by their respective Formik forms
    
    // Combine all errors (excluding orientation errors - handled by Formik)
    const allErrors = { ...personalErrors, ...addressErrors };
    
    // Additional custom validations
    // Employee ID validation (if Staff children quota is selected)
    if (formData.quota && typeof formData.quota === 'string' && formData.quota.includes("Staff children") && !formData.employeeId) {
      allErrors.employeeId = "Employee ID is required when Staff children quota is selected";
    }
    
    // PRO Receipt No validation (if admission type includes "pro")
    if (formData.admissionType && typeof formData.admissionType === 'string' && 
        (formData.admissionType.toLowerCase().includes("pro") || 
         formData.admissionType.toLowerCase().includes("with pro")) &&
        !formData.proReceiptNo) {
      allErrors.proReceiptNo = "PRO Receipt No is required when admission type includes 'pro'";
    }
    
    // Return validation result
    if (Object.keys(allErrors).length > 0) {
      return {
        isValid: false,
        errors: allErrors
      };
    }
    
    return {
      isValid: true,
      errors: {}
    };
    
  } catch (error) {
    console.error('Validation error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      formData: formData
    });
    return {
      isValid: false,
      errors: { general: `Validation error: ${error.message}` }
    };
  }
};

// Function to get missing required fields for user-friendly error messages
export const getMissingFieldsMessage = (errors) => {
  const fieldLabels = {
    // Personal Information
    firstName: "First Name",
    surname: "Surname", 
    gender: "Gender",
    aaparNo: "Aapar No",
    dateOfBirth: "Date of Birth",
    aadharCardNo: "Aadhar Card No",
    quota: "Quota",
    admissionType: "Admission Type",
    fatherName: "Father Name",
    fatherPhoneNumber: "Father Phone Number",
    fatherEmail: "Father Email",
    fatherSector: "Father Sector",
    fatherOccupation: "Father Occupation",
    fatherOtherOccupation: "Father Other Occupation",
    motherName: "Mother Name",
    motherPhoneNumber: "Mother Phone Number",
    motherEmail: "Mother Email",
    motherSector: "Mother Sector",
    motherOccupation: "Mother Occupation",
    motherOtherOccupation: "Mother Other Occupation",
    phoneNumber: "Phone Number",
    
    // Academic Information
    orientationBatch: "Orientation Batch",
    schoolState: "School State",
    schoolDistrict: "School District",
    schoolName: "School Name",
    marks: "Marks",
    bloodGroup: "Blood Group",
    caste: "Caste",
    religion: "Religion",
    foodType: "Food Type",
    schoolType: "School Type",
    
    // Concession Information
    givenBy: "Given By",
    authorizedBy: "Authorized By",
    reason: "Reason",
    
    // Orientation Information
    academicYear: "Academic Year",
    branch: "Branch",
    branchType: "Branch Type",
    city: "City",
    studentType: "Student Type",
    joiningClass: "Joining Class",
    orientationName: "Orientation Name",
    
    // Address Information
    doorNo: "Door No",
    streetName: "Street Name",
    area: "Area",
    pincode: "Pincode",
    state: "State",
    district: "District",
    mandal: "Mandal",
    addressCity: "City",
    
    // General error
    general: "Validation Error"
  };
  
  const missingFields = Object.keys(errors).map(field => fieldLabels[field] || field);
  
  if (missingFields.length === 0) {
    return "All required fields are completed.";
  } else if (missingFields.length === 1) {
    return `Please complete: ${missingFields[0]}`;
  } else if (missingFields.length <= 3) {
    return `Please complete: ${missingFields.join(", ")}`;
  } else {
    return `Please complete ${missingFields.length} required fields: ${missingFields.slice(0, 3).join(", ")} and ${missingFields.length - 3} more`;
  }
};
