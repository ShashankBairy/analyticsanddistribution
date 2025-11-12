import { useDropdownOptions } from "./hooks/useDropdownOptions";
import { useFormHelpers } from "./hooks/useFormHelpers";
import { validationSchema, capitalizeText, generalInfoValidationSchema } from "./hooks/useValidationSchema";

export const useGeneralInfoForm = (setFieldValue, values = {}) => {
  // Use dropdown options hook
  const {
    dropdownOptions,
    setDropdownOptions,
    loadingStates,
    setLoadingStates
  } = useDropdownOptions(setFieldValue);

  // Use form helpers hook
  const {
    persistentErrors,
    setPersistentErrors,
    profilePhotoPreview,
    setProfilePhotoPreview,
    formatDateForDisplay,
    getMaxAdditionalOrientationFee,
    getAdditionalOrientationFeeError
  } = useFormHelpers();

  return {
    dropdownOptions,
    setDropdownOptions,
    loadingStates,
    setLoadingStates,
    persistentErrors,
    setPersistentErrors,
    profilePhotoPreview,
    setProfilePhotoPreview,
    formatDateForDisplay,
    getMaxAdditionalOrientationFee,
    getAdditionalOrientationFeeError: () => getAdditionalOrientationFeeError(values),
    capitalizeText,
    validationSchema
  };
};

// Export validation schema for external use
export { generalInfoValidationSchema };
