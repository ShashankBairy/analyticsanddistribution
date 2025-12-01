import { useEffect } from "react";
import { useFormikContext } from "formik";


export const AutoCalcAppTo = () => {
  const { values, setFieldValue, setFieldError } = useFormikContext();

  useEffect(() => {
    const from = Number(values.applicationNoFrom);
    const range = Number(values.range);
    const appCount = Number(values.applicationCount);
    const availableTo = Number(values.availableAppNoTo);

    // reset errors
    setFieldError("range", "");
    setFieldError("applicationNoTo", "");

    if (!Number.isFinite(from) || !Number.isFinite(range) || range <= 0) {
      setFieldValue("applicationNoTo", "", false);
      return;
    }

    const computedTo = from + range;

    // -----------------------
    //  RULE 1: RANGE LIMIT
    // -----------------------
    if (appCount && range > appCount) {
      setFieldError(
        "range",
        `Range cannot exceed Application Count (${appCount}).`
      );
      setFieldValue("applicationNoTo", "", false);
      return;
    }

    // -----------------------
    //  RULE 2: END NO LIMIT
    // -----------------------
    if (availableTo && computedTo > availableTo) {
      setFieldError(
        "applicationNoTo",
        `Application No To cannot exceed available range (${availableTo}).`
      );
      setFieldValue("applicationNoTo", "", false);
      return;
    }

    // VALID → update value
    setFieldValue("applicationNoTo", String(computedTo), false);

  }, [
    values.applicationNoFrom,
    values.range,
    values.applicationCount,
    values.availableAppNoTo,
    setFieldValue,
    setFieldError,
  ]);

  return null;
};

export const ValuesBridge = ({ onValuesChange }) => {
  const { values } = useFormikContext();
  useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);
  return null;
};


export const BackendPatcher = ({
  appNoFormMode,
  middlewareAppNoFrom,
  backendValues = {},
  skipAppNoPatch = false,
}) => {
  const { values, setFieldValue } = useFormikContext();

  console.log("Backend Values:", backendValues);

  // ------------------ APPLICATION NO FROM ------------------
  useEffect(() => {
    if (skipAppNoPatch) return;

    const src =
      appNoFormMode === "middleware" && middlewareAppNoFrom != null
        ? middlewareAppNoFrom
        : backendValues.applicationNoFrom;

    if (src != null) {
      const nextVal = String(src);
      if (values.applicationNoFrom !== nextVal) {
        setFieldValue("applicationNoFrom", nextVal, false);
      }
    }
  }, [
    appNoFormMode,
    middlewareAppNoFrom,
    backendValues.applicationNoFrom,
    values.applicationNoFrom,
    skipAppNoPatch,
    setFieldValue,
  ]);

  // ------------------ MOBILE NUMBER ------------------
  useEffect(() => {
    if (backendValues.mobileNumber != null) {
      const nextVal = String(backendValues.mobileNumber);
      if (values.mobileNumber !== nextVal) {
        setFieldValue("mobileNumber", nextVal, false);
      }
    }
  }, [backendValues.mobileNumber, values.mobileNumber, setFieldValue]);

  // ------------------ AVAILABLE APP NO FROM ------------------
  useEffect(() => {
    if (skipAppNoPatch) return;

    if (backendValues.availableAppNoFrom != null) {
      const nextVal = String(backendValues.availableAppNoFrom);
      if (values.availableAppNoFrom !== nextVal) {
        setFieldValue("availableAppNoFrom", nextVal, false);
      }
    }
  }, [
    backendValues.availableAppNoFrom,
    values.availableAppNoFrom,
    skipAppNoPatch,
    setFieldValue,
  ]);

  // ------------------ AVAILABLE APP NO TO ------------------
  useEffect(() => {
    if (skipAppNoPatch) return;

    if (backendValues.availableAppNoTo != null) {
      const nextVal = String(backendValues.availableAppNoTo);
      if (values.availableAppNoTo !== nextVal) {
        setFieldValue("availableAppNoTo", nextVal, false);
      }
    }
  }, [
    backendValues.availableAppNoTo,
    values.availableAppNoTo,
    skipAppNoPatch,
    setFieldValue,
  ]);

  // ------------------ IDS ------------------
  const patchNumber = (field, backendVal) => {
    if (backendVal != null && values[field] !== Number(backendVal)) {
      setFieldValue(field, Number(backendVal), false);
    }
  };

  useEffect(() => patchNumber("issuedToEmpId", backendValues.issuedToEmpId), [
    backendValues.issuedToEmpId,
  ]);
  useEffect(() => patchNumber("academicYearId", backendValues.academicYearId), [
    backendValues.academicYearId,
  ]);
  useEffect(() => patchNumber("stateId", backendValues.stateId), [
    backendValues.stateId,
  ]);
  useEffect(() => patchNumber("cityId", backendValues.cityId), [
    backendValues.cityId,
  ]);
  useEffect(() => patchNumber("zoneId", backendValues.zoneId), [
    backendValues.zoneId,
  ]);
  useEffect(() => patchNumber("campusId", backendValues.campusId), [
    backendValues.campusId,
  ]);
  useEffect(
    () => patchNumber("campaignDistrictId", backendValues.campaignDistrictId),
    [backendValues.campaignDistrictId]
  );
  useEffect(() => patchNumber("campaignId", backendValues.campaignId), [
    backendValues.campaignId,
  ]);
  useEffect(() => patchNumber("issuedToId", backendValues.issuedToId), [
    backendValues.issuedToId,
  ]);
  useEffect(
    () =>
      patchNumber(
        "selectedBalanceTrackId",
        backendValues.selectedBalanceTrackId
      ),
    [backendValues.selectedBalanceTrackId]
  );

  // --------------------------------------------------------------
  //          🔥 PATCH APPLICATION SERIES RELATED FIELDS
  // --------------------------------------------------------------
  useEffect(() => {
    if (!backendValues) return;

    // Application Series string
    if (backendValues.applicationSeries != null) {
      if (values.applicationSeries !== backendValues.applicationSeries) {
        setFieldValue(
          "applicationSeries",
          backendValues.applicationSeries,
          false
        );
      }
    }

    // Application Count
    if (backendValues.applicationCount != null) {
      const nextVal = String(backendValues.applicationCount);
      if (values.applicationCount !== nextVal) {
        setFieldValue("applicationCount", nextVal, false);
      }
    }

    // Start No (applicationNoFrom)
    if (backendValues.applicationNoFrom != null) {
      const nextVal = String(backendValues.applicationNoFrom);
      if (values.applicationNoFrom !== nextVal) {
        setFieldValue("applicationNoFrom", nextVal, false);
      }
    }

    // AVAILABLE RANGE
    if (backendValues.availableAppNoFrom != null) {
      const nextVal = String(backendValues.availableAppNoFrom);
      if (values.availableAppNoFrom !== nextVal) {
        setFieldValue("availableAppNoFrom", nextVal, false);
      }
    }

    if (backendValues.availableAppNoTo != null) {
      const nextVal = String(backendValues.availableAppNoTo);
      if (values.availableAppNoTo !== nextVal) {
        setFieldValue("availableAppNoTo", nextVal, false);
      }
    }
  }, [backendValues, values, setFieldValue]);

  return null;
};
