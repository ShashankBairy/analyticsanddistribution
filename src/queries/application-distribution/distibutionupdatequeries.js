import axios from "axios";
const DISTRIBUTION_UPDATE = "http://localhost:8080/distribution/updates";
 
// --- utils ---
const convertToBackendDateFormat = (ddmmyyyy) => {
  if (!ddmmyyyy) return "";
  const [day, month, year] = String(ddmmyyyy).split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month}-${day}`; // yyyy-MM-dd
};
 
// --- DTO mappers ---
const zoneFormDTO = (v,employeeId) => ({
  academicYearId: v.academicYearId,
  stateId: v.stateId,
  cityId: v.cityId,
  zoneId: v.zoneId,
  issuedByTypeId: 1,
  issuedToTypeId: 2,
  issuedToEmpId: v.issuedToEmpId,
  appStartNo: v.applicationNoFrom,
  appEndNo: v.applicationNoTo,
  range: v.range,
  issueDate: convertToBackendDateFormat(v.issueDate),
  createdBy: employeeId,
  application_Amount: v.applicationFee,
});
 
const dgmFormDTO = (v,employeeId) => ({
  userId: employeeId,
  academicYearId: v.academicYearId,
  cityId: v.cityId,
  zoneId: v.zoneId,
  campusId: v.campusId,
  dgmEmployeeId: v.issuedToId,
  application_Amount: v.applicationFee,
  applicationNoFrom: v.applicationNoFrom,
  applicationNoTo: v.applicationNoTo,
  range: v.range,
});
 
const campusFormDTO = (v,employeeId,category) => ({
  userId: employeeId,
  academicYearId: v.academicYearId,
  cityId: v.cityId,
  campaignDistrictId: v.campaignDistrictId,
  branchId: v.campusId,
  receiverId: v.issuedToEmpId,
  issuedToTypeId: 4,
  issueDate: convertToBackendDateFormat(v.issueDate),
  application_Amount: v.applicationFee,
  applicationNoFrom: v.applicationNoFrom,
  applicationNoTo: v.applicationNoTo,
  range: v.range,
  category: category,
});
 
// --- core sender (axios only) ---
/**
 * @param {Object} params
 * @param {"zone"|"dgm"|"campus"} params.formType
 * @param {string|number} params.id
 * @param {Object} params.formValues
 * @param {Object} [params.config] axios config (headers, etc.)
 */
export async function sendUpdate({ formType, id, formValues,employeeId,category, config }) {
  const t = String(formType ?? "").trim().toLowerCase();
 
  let endpoint;
  let payload;
 
  switch (t) {
    case "zone":
      endpoint = `update-zone/${id}`;
      payload = zoneFormDTO(formValues,employeeId);
      break;
    case "dgm":
      endpoint = `update-dgm/${id}`;
      payload = dgmFormDTO(formValues,employeeId);
      break;
    case "campus":
      endpoint = `update-campus/${id}`;
      payload = campusFormDTO(formValues,employeeId,category);
      break;
    default:
      throw new Error(
        `Invalid formType "${formType}". Expected "zone" | "dgm" | "campus".`
      );
  }
 
  const url = `${DISTRIBUTION_UPDATE}/${endpoint}`;
 
  // NOTE: axios.put(url, data, config) — do not pass `id` as the 3rd arg.
  const { data } = await axios.put(url, payload);
  return data;
}
 
// --- convenience wrappers (optional) ---
export const updateZone = (id, values, employeeId,config) =>
  sendUpdate({ formType: "zone", id, formValues: values,employeeId, config });
 
export const updateDgm = (id, values,employeeId, config) =>
  sendUpdate({ formType: "dgm", id, formValues: values,employeeId, config });
 
export const updateCampus = (id, values,employeeId,category, config) =>
  sendUpdate({ formType: "campus", id, formValues: values,employeeId,category, config });