import axios from "axios";
const DISTRIBUTION_POST = "http://localhost:8080/distribution/posts";
// Utility function to convert dd/mm/yyyy to yyyy-mm-dd
const convertToBackendDateFormat = (ddmmyyyy) => {
  if (!ddmmyyyy) return "";
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`; // Convert to yyyy-MM-dd format
};

// Safely get empId
const empFromLocal = localStorage.getItem("empId");
const employeeID = empFromLocal ? Number(empFromLocal) : null;

if (!employeeID) {
  console.error("❌ Employee ID missing. Please log in again.");
}

// DTO Mappings for each form type
const zoneFormDTO = (zoneValues, employeeId) => ({
  academicYearId: zoneValues.academicYearId,
  stateId: zoneValues.stateId,
  cityId: zoneValues.cityId,
  zoneId: zoneValues.zoneId,
  issuedByTypeId: 1, // Static, assuming this is always 1
  issuedToTypeId: 2, // Static, assuming this is always 2
  issuedToEmpId: zoneValues.issuedToEmpId,
  appStartNo: zoneValues.applicationNoFrom,
  appEndNo: zoneValues.applicationNoTo,
  range: zoneValues.range,
  issueDate: convertToBackendDateFormat(zoneValues.issueDate),
  createdBy: employeeId, // User ID or creator ID, assuming it's available
  application_Amount:Number(zoneValues.applicationFee),
});
const dgmFormDTO = (dgmValues,employeeId) => ({
  userId: employeeId,
  academicYearId: dgmValues.academicYearId,
  cityId: dgmValues.cityId,
  zoneId: dgmValues.zoneId,
  campusId: dgmValues.campusId,
  dgmEmployeeId: dgmValues.issuedToEmpId,
  application_Amount:Number(dgmValues.applicationFee),
  applicationNoFrom: dgmValues.applicationNoFrom,
  applicationNoTo: dgmValues.applicationNoTo,
  range: Number(dgmValues.range),
});
const campusFormDTO = (campusValues,employeeId,category) => ({
  userId: employeeId,
  academicYearId: campusValues.academicYearId,
  cityId: campusValues.cityId,
  campaignDistrictId: campusValues.campaignDistrictId,
  branchId: campusValues.campusId,
  receiverId: campusValues.issuedToEmpId,
  issuedToTypeId: 4,
  issueDate:convertToBackendDateFormat(campusValues.issueDate),
  application_Amount:Number(campusValues.applicationFee),
  applicationNoFrom: campusValues.applicationNoFrom,
  applicationNoTo: campusValues.applicationNoTo,
  range: Number(campusValues.range),
  category:category,
});
// Function to send form data using axios
const sendFormData = async ({ formValues, formType, employeeId, category, }) => {
  const t = String(formType ?? "")
    .trim()
    .toLowerCase();
  console.log("Form Data: ", formValues);
  let endpoint;
  let formData;
  // Map values to the respective DTO based on formType
  switch (t) {
    case "zone":
      endpoint = "zone-save";
      formData = zoneFormDTO(formValues,employeeId);
      break;
    case "dgm":
      endpoint = "dgm-save";
      formData = dgmFormDTO(formValues,employeeId);
      break;
    case "campus":
      endpoint = "campus-save";
      formData = campusFormDTO(formValues,employeeId,category);
      break;
    default:
      throw new Error(
        `Invalid formType "${formType}". Expected "zone" | "dgm" | "campus".`
      );
  }
  // Build the full URL
  const fullUrl = `${DISTRIBUTION_POST}/${endpoint}`;
  try {
    // Send the POST request with form data to the backend
    const response = await axios.post(fullUrl, formData);
    return response.data; // Return the response data if successful
  } catch (error) {
    // Handle error, log it to the console, and throw a custom error
    console.error("Error submitting form:", error.response || error);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred during form submission."
    );
  }
};
// Form submission handler
export const handlePostSubmit = async (submissionData) => {
  try {
    // Call sendFormData to submit the form
    const response = await sendFormData(submissionData);
    // Handle success (e.g., show success message, redirect, etc.)
    console.log("Form submitted successfully:", response);
    return response;
    // Additional logic after successful form submission
  } catch (error) {
    // Handle error: Display error message
    console.error("Form submission error:", error.message);
    throw error; // Re-throw the error so it can be caught in the component
  }
};