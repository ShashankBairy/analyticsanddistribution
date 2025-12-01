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
const zoneFormDTO = (v) => ({
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
  createdBy: v.createdBy,
  application_Amount: v.applicationFee,
});
 
const dgmFormDTO = (v) => ({
  userId: v.userId,
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
 
const campusFormDTO = (v) => ({
  userId: v.userId ,
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
   category: v.category,
});
 
// --- core sender (axios only) ---
/**
 * @param {Object} params
 * @param {"zone"|"dgm"|"campus"} params.formType
 * @param {string|number} params.id
 * @param {Object} params.formValues
 * @param {Object} [params.config] axios config (headers, etc.)
 */
export async function sendUpdate({ formType, id, formValues, config }) {
  const t = String(formType ?? "").trim().toLowerCase();
 
  let endpoint;
  let payload;
 
  switch (t) {
    case "zone":
      endpoint = `update-zone/${id}`;
      payload = zoneFormDTO(formValues);
      break;
    case "dgm":
      endpoint = `update-dgm/${id}`;
      payload = dgmFormDTO(formValues);
      break;
    case "campus":
      endpoint = `update-campus/${id}`;
      payload = campusFormDTO(formValues);
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
export const updateZone = (id, values, config) =>
  sendUpdate({ formType: "zone", id, formValues: values, config });
 
export const updateDgm = (id, values, config) =>
  sendUpdate({ formType: "dgm", id, formValues: values, config });
 
export const updateCampus = (id, values, config) =>
  sendUpdate({ formType: "campus", id, formValues: values, config });