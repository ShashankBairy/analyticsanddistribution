import * as Yup from "yup";
import { generalInfoValidationSchema } from "../../GeneralInfoSection/useGeneralInfoForm";
import { validationSchema as addressValidationSchema } from "../../../Existing_Components/AddressInfoSection/utils/validationSchemas";

// Combined validation schema for all sections
export const createCombinedValidationSchema = () => {
  console.log("🔧 VALIDATION ENABLED - Creating combined schema");
  return Yup.object().shape({
    ...(generalInfoValidationSchema?.fields || {}),
    ...(addressValidationSchema?.fields || {}),
    // Add other section validation schemas here
    // ...(ConcessionInfoSection.validationSchema?.fields || {}),
    // ...(PaymentInfoSection.validationSchema?.fields || {}),
  });
};

// Section-specific validation schemas
export const sectionValidationSchemas = {
  0: generalInfoValidationSchema, // General Information
  // 1: ConcessionInfoSection.validationSchema, // Concession Information
  2: addressValidationSchema, // Address Information
  // 3: PaymentInfoSection.validationSchema, // Payment Information
};

// Get validation schema for specific step
export const getValidationSchemaForStep = (step) => {
  return sectionValidationSchemas[step] || Yup.object().shape({});
};

// Get combined validation schema for all steps
export const getCombinedValidationSchema = () => {
  return createCombinedValidationSchema();
};
