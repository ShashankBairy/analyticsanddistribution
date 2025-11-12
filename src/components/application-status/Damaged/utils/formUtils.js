/**
 * Utility functions for form data processing and validation
 */

/**
 * Normalize strings for matching by trimming, lowercasing, and removing special characters
 * @param {string} str - String to normalize
 * @returns {string} Normalized string
 */
export const normalizeString = (str) =>
  str
    ?.trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/g, "") || "";

/**
 * Find ID by label in dropdown options
 * @param {Array} options - Array of dropdown options
 * @param {string} label - Label to search for
 * @param {string} fieldName - Name of the field for error logging
 * @returns {string|null} Found ID or null
 */
export const findIdByLabel = (options, label, fieldName) => {
  if (!Array.isArray(options) || !options.length || !label) {
    // Only log warning if we actually have a label but no options
    if (label && (!Array.isArray(options) || !options.length)) {
      console.warn(`No valid options for ${fieldName}:`, { label, options });
    }
    return null;
  }
  
  const normalizedLabel = normalizeString(label);
  const match = options.find((opt) => normalizeString(opt.label) === normalizedLabel);
  
  if (!match) {
    console.warn(
      `No exact match for ${fieldName} label: "${label}" (normalized: "${normalizedLabel}") in options:`,
      options.map((opt) => opt.label)
    );
    return null;
  }
  
  return match.value || null;
};

/**
 * Status mapping for reverse lookup
 */
export const reverseStatusMap = {
  damaged: "DAMAGED",
  withpro: "AVAILABLE",
  "not confirmed": "UNSOLD",
  "with pro": "AVAILABLE",
  with_pro: "AVAILABLE",
  available: "AVAILABLE",
  unsold: "UNSOLD",
  "not sold": "UNSOLD",
  notsold: "UNSOLD",
  "un sold": "UNSOLD",
  approved: "CONFIRMED",
  broken: "DAMAGED",
  "": "UNKNOWN",
};

/**
 * Map API data to dropdown options format
 * @param {Array} data - Raw API data
 * @param {string} labelField - Field name for label
 * @param {string} valueField - Field name for value
 * @param {string} fallbackLabel - Fallback label if label is missing
 * @returns {Array} Mapped dropdown options
 */
export const mapToDropdownOptions = (data, labelField, valueField, fallbackLabel = "Unknown") => {
  if (!Array.isArray(data)) return [];
  
  return data
    .map((item) => ({
      label: item[labelField]?.trim() || fallbackLabel,
      value: item[valueField] || null,
    }))
    .filter((opt) => opt.label && opt.value);
};

/**
 * Validate form submission data
 * @param {Object} values - Form values
 * @param {Object} dropdownOptions - Available dropdown options
 * @returns {Object} Validation result with isValid and missingIds
 */
// Global storage for backend IDs
let storedBackendIds = null;

export const storeBackendIds = (ids) => {
  console.log("=== STORING BACKEND IDS ===");
  console.log("Storing IDs:", ids);
  storedBackendIds = ids;
  console.log("Stored IDs:", storedBackendIds);
  console.log("=== END STORING BACKEND IDS ===");
};

export const getStoredBackendIds = () => {
  console.log("=== GETTING STORED BACKEND IDS ===");
  console.log("Retrieved IDs:", storedBackendIds);
  console.log("=== END GETTING STORED BACKEND IDS ===");
  return storedBackendIds;
};

export const validateSubmissionData = (values, dropdownOptions) => {
  console.log("=== FORM SUBMISSION VALIDATION DEBUG ===");
  console.log("Form values:", values);
  console.log("Form values keys:", Object.keys(values));
  console.log("Form values with IDs:", {
    zoneId: values.zoneId,
    campusId: values.campusId,
    proId: values.proId,
    dgmEmpId: values.dgmEmpId,
    statusId: values.statusId
  });
  console.log("Dropdown options:", dropdownOptions);
  
  // Get the stored backend IDs
  const backendIds = getStoredBackendIds();
  console.log("Using stored backend IDs:", backendIds);
  
  // Use stored backend IDs if available, otherwise fall back to form values
  const updatedValues = {
    applicationNo: parseInt(values.applicationNo, 10) || 0,
    statusId: backendIds?.statusId || values.statusId || null,
    reason: values.reason,
    campusId: backendIds?.campusId || values.campusId || null,
    proId: backendIds?.proId || values.proId || null,
    zoneId: backendIds?.zoneId || values.zoneId || null,
    dgmEmpId: backendIds?.dgmEmpId || values.dgmEmpId || null,
  };

  console.log("Updated values for submission:", updatedValues);

  const missingIds = [];
  if (!updatedValues.statusId || isNaN(updatedValues.statusId)) missingIds.push("statusId");
  if (!updatedValues.campusId || isNaN(updatedValues.campusId)) missingIds.push("campusId");
  if (!updatedValues.proId) missingIds.push("proId");
  if (!updatedValues.zoneId || isNaN(updatedValues.zoneId)) missingIds.push("zoneId");
  if (!updatedValues.dgmEmpId) missingIds.push("dgmEmpId");

  console.log("Missing IDs:", missingIds);
  console.log("Validation result:", {
    isValid: missingIds.length === 0,
    missingIds,
    updatedValues,
  });
  console.log("=== END FORM SUBMISSION VALIDATION DEBUG ===");

  return {
    isValid: missingIds.length === 0,
    missingIds,
    updatedValues,
  };
};
