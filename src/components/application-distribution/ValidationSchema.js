import * as Yup from "yup";
 
const isValidDdMmYyyy = (v) => {
  if (!v || typeof v !== "string") return false;
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const [, dd, mm, yyyy] = m;
  const d = parseInt(dd, 10), mth = parseInt(mm, 10) - 1, y = parseInt(yyyy, 10);
  const dt = new Date(y, mth, d);
  return (
    dt.getFullYear() === y &&
    dt.getMonth() === mth &&
    dt.getDate() === d
  );
};
 
const toDate = (v) => {
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  return new Date(parseInt(yyyy,10), parseInt(mm,10)-1, parseInt(dd,10));
};
 
const todayAtMidnight = () => {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};
 
const createValidationSchema = (formType) => {
  const isZone = formType === "Zone";
  const isDgm = formType === "DGM";
  const isCampus = formType === "Campus";
 
  return Yup.object({
    academicYear: Yup.string().required("Academic Year is required"),
    cityName: Yup.string().required("City Name is required"),
    issuedTo: Yup.string().required("Issued To is required"),
 
    applicationNoFrom: Yup.string()
      .required("Application No From is required")
      .matches(/^\d+$/, "Application No From must be a number"),
 
    // If you want Range strictly numeric, use string+regex (keeps your current type)
    range: Yup.string()
      .required("Range is required")
      .matches(/^\d+$/, "Range must be a number"),
 
    // Validate dd/MM/yyyy string instead of Date()
    issueDate: Yup.string()
      .required("Issue Date is required")
      .test(
        "ddmmyyyy-format",
        "Use DD/MM/YYYY (e.g., 14/09/2025)",
        (v) => isValidDdMmYyyy(v || "")
      )
      .test(
        "not-in-future",
        "Issue Date cannot be in the future",
        (v) => {
          if (!isValidDdMmYyyy(v || "")) return false;
          const d = toDate(v);
          return d <= todayAtMidnight();
        }
      ),
 
    // Zone-specific
    stateName: isZone
      ? Yup.string().required("State Name is required")
      : Yup.string().notRequired(),
 
    zoneName: (isZone || isDgm)
      ? Yup.string().required("Zone Name is required")
      : Yup.string().notRequired(),
 
    // DGM/Campus-specific
    campusName: (isDgm || isCampus)
      ? Yup.string().required("Campus Name is required")
      : Yup.string().notRequired(),
 
    // Campus-specific
    campaignDistrictName: isCampus
      ? Yup.string().required("Campaign District is required")
      : Yup.string().notRequired(),
 
    // campaignAreaName: isCampus
    //   ? Yup.string().required("Campaign Area Name is required")
    //   : Yup.string().notRequired(),
  });
};
 
export default createValidationSchema;