// Initial values: keep range numeric-friendly but string works fine for text input
export const buildInitialValues = (fields, initialValues = {}, backendValues = {}) =>
  fields.reduce(
    (acc, f) => {
      return {
        ...acc,
        [f.name]: initialValues[f.name] ?? (f.name === "range" ? "" : ""),
      };
    },
    {
      academicYearId:
        initialValues.academicYearId ?? backendValues.academicYearId ?? "",
      issuedToEmpId:
        initialValues.issuedToEmpId ?? backendValues.issuedToEmpId ?? "",
      campaignDistrictId:
        initialValues.campaignDistrictId ??
        backendValues.campaignDistrictId ??
        "",
      campaignId: initialValues.campaignId ?? backendValues.campaignId ?? "",
      campusId: initialValues.campusId ?? backendValues.campusId ?? "",
    }
  );