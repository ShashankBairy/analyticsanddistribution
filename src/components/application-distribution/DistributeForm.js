import React, { useMemo, useEffect, useState } from "react";
import { Formik, Form, Field, useFormikContext } from "formik";
import Dropdown from "../../widgets/Dropdown/Dropdown";
import Inputbox from "../../widgets/Inputbox/InputBox";
import Button from "../../widgets/Button/Button";
import createValidationSchema from "./ValidationSchema";
import styles from "./DistributeForm.module.css";
import rightarrow from "../../assets/application-distribution/rightarrow";
import RangeInputBox from "../../widgets/Range/RangeInputBox";
import { handlePostSubmit } from "../../queries/application-distribution/distributionpostqueries";
import {
  updateZone,
  updateDgm,
  updateCampus,
} from "../../queries/application-distribution/distibutionupdatequeries";

// Utility function to get today's date in "dd/mm/yyyy" format
const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`; // Format: dd/mm/yyyy
};

const convertToInputFormat = (ddmmyyyy) => {
  if (!ddmmyyyy) return "";
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`; // Convert to yyyy-mm-dd
};

const convertToDisplayFormat = (yyyymmdd) => {
  if (!yyyymmdd) return "";
  const [year, month, day] = yyyymmdd.split("-");
  return `${day}/${month}/${year}`; // Convert to dd/mm/yyyy
};

// DatePickerWrapper component for handling date format conversion
const DatePickerWrapper = ({
  cfg,
  values,
  setFieldValue,
  disabled,
  errorMessage,
}) => {
  const isIssueDate = cfg.name === "issueDate";
  const inputValue =
    isIssueDate && values[cfg.name]
      ? convertToInputFormat(values[cfg.name])
      : "";
  const handleDateChange = (e) => {
    const inputValue = e.target.value;
    if (isIssueDate) {
      const displayValue = convertToDisplayFormat(inputValue);
      setFieldValue(cfg.name, displayValue);
    } else {
      setFieldValue(cfg.name, inputValue);
    }
  };
  return (
    <>
      <Inputbox
        key={cfg.name}
        label={cfg.label}
        id={cfg.name}
        name={cfg.name}
        placeholder={cfg.placeholder || ""}
        type="date"
        value={inputValue}
        onChange={handleDateChange}
        disabled={disabled}
      />
      {/* {isIssueDate && values[cfg.name] && (
        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          Selected: {values[cfg.name]}
        </div>
      )} */}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </>
  );
};

/* --- field configs --- */
const commonFields = [
  { name: "academicYear", label: "Academic Year", options: ["2021", "2022"] },
  {
    name: "cityName",
    label: "City Name",
    options: ["Hitect City", "Madhapur"],
  },
  { name: "issuedTo", label: "Issued To", options: ["Person 1", "Person 2"] },
  {
    name: "availableAppNoFrom",
    label: "Available Appno From",
    type: "text",
    disabled: true,
    placeholder: "Available Appno From",
  },
  {
    name: "availableAppNoTo",
    label: "Available Appno To",
    type: "text",
    disabled: true,
    placeholder: "Available Appno To",
  },
  {
    name: "applicationNoFrom",
    label: "Application No From",
    type: "text",
    placeholder: "Enter Application no From",
  },
  { name: "range", label: "Range", component: RangeInputBox },
  {
    name: "applicationNoTo",
    label: "Application No To",
    type: "text",
    disabled: true,
    placeholder: "Application No To",
  },
  { name: "issueDate", label: "Issue Date", type: "date" },
  {
    name: "mobileNumber",
    label: "Mobile Number",
    type: "tel",
    disabled: true,
    placeholder: "Mobile Number",
  },
];

const zoneFields = [
  {
    name: "stateName",
    label: "State Name",
    options: ["Telangana", "Andhra Pradesh"],
  },
  { name: "zoneName", label: "Zone Name", options: ["Zone 1", "Zone 2"] },
];

const dgmFields = [
  {
    name: "campusName",
    label: "Branch Name",
    options: ["Campus 1", "Campus 2"],
  },
  { name: "zoneName", label: "Zone Name", options: ["Zone 1", "Zone 2"] },
];

const campusFields = [
  {
    name: "campusName",
    label: "Branch Name",
    options: ["Campus 1", "Campus 2"],
  },
  {
    name: "campaignDistrictName",
    label: "Campaign District",
    options: ["District 1", "District 2"],
  },
  // {
  //   name: "campaignAreaName",
  //   label: "Campaign Area Name",
  //   options: ["Area 1", "Area 2"],
  // },
];

const fieldLayouts = {
  Zone: [
    { id: "row-1", fields: ["academicYear", "stateName"] },
    { id: "row-2", fields: ["cityName", "zoneName"] },
    { id: "row-3", fields: ["availableAppNoFrom", "availableAppNoTo"] },
    { id: "row-4", fields: ["issuedTo", "applicationNoFrom"] },
    { id: "row-5", fields: ["range", "applicationNoTo"] },
    { id: "row-6", fields: ["issueDate", "mobileNumber"] },
  ],
  DGM: [
    { id: "row-1", fields: ["academicYear", "cityName"] },
    { id: "row-2", fields: ["zoneName", "campusName"] },
    { id: "row-3", fields: ["issuedTo", "availableAppNoFrom"] },
    { id: "row-4", fields: ["availableAppNoTo", "applicationNoFrom"] },
    { id: "row-5", fields: ["range", "applicationNoTo"] },
    { id: "row-6", fields: ["issueDate", "mobileNumber"] },
  ],
  Campus: [
    { id: "row-1", fields: ["academicYear", "campaignDistrictName"] },
    { id: "row-2", fields: ["cityName", "campusName"] },
    { id: "row-3", fields: ["issuedTo", "availableAppNoFrom"] },
    { id: "row-4", fields: ["availableAppNoTo", "applicationNoFrom"] },
    { id: "row-5", fields: ["range", "applicationNoTo"] },
    { id: "row-6", fields: ["issueDate", "mobileNumber"] },
    // { id: "row-7", fields: ["", ""] },
  ],
};

const getFieldsForType = (formType) => {
  switch (formType) {
    case "Zone":
      return [...commonFields, ...zoneFields];
    case "DGM":
      return [...commonFields, ...dgmFields];
    case "Campus":
      return [...commonFields, ...campusFields];
    default:
      return commonFields;
  }
};

// Initial values: keep range numeric-friendly but string works fine for text input
const buildInitialValues = (fields, initialValues = {}, backendValues = {}) =>
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

/* --- helpers --- */
const AutoCalcAppTo = () => {
  const { values, setFieldValue } = useFormikContext();
  useEffect(() => {
    const from = Number(values.applicationNoFrom);
    const range = Number(values.range);
    console.log("AutoCalc: from=", from, "range=", range);
    if (Number.isFinite(from) && Number.isFinite(range) && range > 0) {
      const to = from + range;
      setFieldValue("applicationNoTo", String(to), false);
    } else {
      setFieldValue("applicationNoTo", "", false);
    }
  }, [values.applicationNoFrom, values.range, setFieldValue]);
  return null;
};

const ValuesBridge = ({ onValuesChange }) => {
  const { values } = useFormikContext();
  useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);
  return null;
};

const normalizeOptions = (options) =>
  Array.isArray(options) ? options.filter((v) => v != null).map(String) : [];

/** Patch only backend-driven fields into Formik without reinitializing the whole form */
const BackendPatcher = ({
  appNoFormMode,
  middlewareAppNoFrom,
  backendValues = {},
  skipAppNoPatch = false,
}) => {
  const { values, setFieldValue } = useFormikContext();
  console.log("Backend Values:", backendValues);
  // applicationNoFrom
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
    setFieldValue,
    values.applicationNoFrom,
    skipAppNoPatch,
  ]);
  // mobileNumber
  useEffect(() => {
    if (backendValues.mobileNumber != null) {
      const nextVal = String(backendValues.mobileNumber);
      if (values.mobileNumber !== nextVal) {
        setFieldValue("mobileNumber", nextVal, false);
      }
    }
  }, [backendValues.mobileNumber, setFieldValue, values.mobileNumber]);
  // availableAppNoFrom
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
    setFieldValue,
    values.availableAppNoFrom,
    skipAppNoPatch,
  ]);
  // availableAppNoTo
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
    setFieldValue,
    values.availableAppNoTo,
    skipAppNoPatch,
  ]);
  // issuedToEmpId
  useEffect(() => {
    if (backendValues.issuedToEmpId != null) {
      const nextVal = Number(backendValues.issuedToEmpId);
      if (values.issuedToEmpId !== nextVal) {
        setFieldValue("issuedToEmpId", nextVal, false);
      }
    }
  }, [backendValues.issuedToEmpId, setFieldValue, values.issuedToEmpId]);
  // academicYearId
  useEffect(() => {
    if (backendValues.academicYearId != null) {
      const nextVal = Number(backendValues.academicYearId);
      if (values.academicYearId !== nextVal) {
        setFieldValue("academicYearId", nextVal, false);
      }
    }
  }, [backendValues.academicYearId, setFieldValue, values.academicYearId]);
  // stateId
  useEffect(() => {
    if (backendValues.stateId != null) {
      const nextVal = Number(backendValues.stateId);
      if (values.stateId !== nextVal) {
        setFieldValue("stateId", nextVal, false);
      }
    }
  }, [backendValues.stateId, setFieldValue, values.stateId]);
  // cityId
  useEffect(() => {
    if (backendValues.cityId != null) {
      const nextVal = Number(backendValues.cityId);
      if (values.cityId !== nextVal) {
        setFieldValue("cityId", nextVal, false);
      }
    }
  }, [backendValues.cityId, setFieldValue, values.cityId]);
  // zoneId
  useEffect(() => {
    if (backendValues.zoneId != null) {
      const nextVal = Number(backendValues.zoneId);
      if (values.zoneId !== nextVal) {
        setFieldValue("zoneId", nextVal, false);
      }
    }
  }, [backendValues.zoneId, setFieldValue, values.zoneId]);
  // campusId
  useEffect(() => {
    if (backendValues.campusId != null) {
      const nextVal = Number(backendValues.campusId);
      if (values.campusId !== nextVal) {
        setFieldValue("campusId", nextVal, false);
      }
    }
  }, [backendValues.campusId, setFieldValue, values.campusId]);
  // campaignDistrictId
  useEffect(() => {
    if (backendValues.campaignDistrictId != null) {
      const nextVal = Number(backendValues.campaignDistrictId);
      if (values.campaignDistrictId !== nextVal) {
        setFieldValue("campaignDistrictId", nextVal, false);
      }
    }
  }, [
    backendValues.campaignDistrictId,
    setFieldValue,
    values.campaignDistrictId,
  ]);
  // campaignId
  useEffect(() => {
    if (backendValues.campaignId != null) {
      const nextVal = Number(backendValues.campaignId);
      if (values.campaignId !== nextVal) {
        setFieldValue("campaignId", nextVal, false);
      }
    }
  }, [backendValues.campaignId, setFieldValue, values.campaignId]);
  // issuedToId
  useEffect(() => {
    if (backendValues.issuedToId != null) {
      const nextVal = Number(backendValues.issuedToId);
      if (values.issuedToId !== nextVal) {
        setFieldValue("issuedToId", nextVal, false);
      }
    }
  }, [backendValues.issuedToId, setFieldValue, values.issuedToId]);
  // selectedBalanceTrackId
  useEffect(() => {
    if (backendValues.selectedBalanceTrackId != null) {
      const nextVal = Number(backendValues.selectedBalanceTrackId);
      if (values.selectedBalanceTrackId !== nextVal) {
        setFieldValue("selectedBalanceTrackId", nextVal, false);
      }
    }
  }, [
    backendValues.selectedBalanceTrackId,
    setFieldValue,
    values.selectedBalanceTrackId,
  ]);
  return null;
};

// Put this helper above DistributeForm (or inside it before handleSubmit)
const extractApiError = (err) => {
  // axios-style
  const data = err?.response?.data;

  // plain string body
  if (typeof data === "string") return data;

  // common { message } shape
  if (data?.message && typeof data.message === "string") return data.message;

  // { errors: [...] } or { errors: { field: [..] } }
  if (Array.isArray(data?.errors)) return data.errors.join(" • ");
  if (data?.errors && typeof data.errors === "object") {
    const parts = Object.entries(data.errors).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((m) => `${k}: ${m}`) : `${k}: ${v}`
    );
    if (parts.length) return parts.join(" • ");
  }

  // generic object body -> stringify a little
  if (data && typeof data === "object") {
    try {
      return JSON.stringify(data);
    } catch (_) {}
  }

  // fallback to normal Error.message
  if (err?.message) return err.message;

  return "An unexpected error occurred.";
};

/* --- DistributeForm --- */
const DistributeForm = ({
  formType = "Zone",
  onSubmit,
  initialValues = {},
  setIsInsertClicked,
  backendValues = {},
  appNoFormMode = "manual",
  middlewareAppNoFrom,
  dynamicOptions,
  searchOptions,
  onValuesChange,
  isUpdate = false,
  editId,
  skipAppNoPatch = false,
}) => {
  const [formError, setFormError] = useState(null);
  console.log("Form Type:", formType);
  const fieldsForType = useMemo(() => getFieldsForType(formType), [formType]);
  const fieldMap = useMemo(() => {
    const m = {};
    fieldsForType.forEach((f) => (m[f.name] = f));
    return m;
  }, [fieldsForType]);
  const formInitialValues = useMemo(() => {
    const baseValues = buildInitialValues(
      fieldsForType,
      initialValues,
      backendValues
    );
    if (!baseValues.issueDate && !isUpdate) {
      baseValues.issueDate = getCurrentDate();
    }
    return baseValues;
  }, [fieldsForType, initialValues, backendValues, isUpdate]);
  const buttonLabel = isUpdate ? "Update" : "Insert";
  const handleSubmit = async (rawValues) => {
    setFormError(null);

    try {
      const values = { ...rawValues };
      console.log("Values: ", values);

      // Force middleware app-from if used
      if (
        appNoFormMode === "middleware" &&
        middlewareAppNoFrom != null &&
        middlewareAppNoFrom !== ""
      ) {
        values.applicationNoFrom = String(middlewareAppNoFrom);
      }

      // light guards (Yup still validates)
      if (!values.academicYearId) {
        throw new Error("Please select a valid Academic Year.");
      }
      if (!values.issuedToEmpId && !values.issuedToId) {
        throw new Error("Please select a valid employee for 'Issued To'.");
      }

      const t = String(formType || "")
        .trim()
        .toLowerCase();

      if (isUpdate) {
        if (editId === undefined || editId === null) {
          throw new Error("Missing editId for update call.");
        }

        let resp;
        if (t === "zone") resp = await updateZone(editId, values);
        else if (t === "dgm") resp = await updateDgm(editId, values);
        else if (t === "campus") resp = await updateCampus(editId, values);
        else throw new Error(`Unknown formType "${formType}" for update.`);

        onSubmit?.({ ...values, id: editId, _mode: "update" });
        setIsInsertClicked?.(false);
        return resp;
      }

      // console.log("Form Values Before sending to middleware: ", formValues);
      // Create flow
      const resp = await handlePostSubmit({
        formValues: values,
        formType: t,
      });

      onSubmit?.({ ...values, _mode: "create" });
      setIsInsertClicked?.(true);
      return resp;
    } catch (err) {
      // <-- show the raw backend error (string body, message, or errors array/map)
      const msg = extractApiError(err);
      setFormError(msg);
      console.error("handleSubmit error:", err);
      // No rethrow so the UI can keep the message visible under the button
      return null;
    }
  };

  const renderField = (name, values, setFieldValue, touched, errors) => {
    const cfg = fieldMap[name];
    if (!cfg) return null;
    const errorMessage = touched[name] && errors[name] ? errors[name] : null;
    if (cfg.name === "range") {
      return (
        <>
          <Field
            name={cfg.name}
            component={RangeInputBox}
            label={cfg.label}
            value={values[cfg.name] || ""}
          />
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </>
      );
    }
    const hasDropdownConfig =
      Array.isArray(cfg.options) ||
      (dynamicOptions && dynamicOptions[cfg.name]);
    const rawOptions = dynamicOptions ? dynamicOptions[cfg.name] : cfg.options;
    const options = normalizeOptions(rawOptions);
    if (hasDropdownConfig) {
      const dropdownDisabled = !!cfg.disabled || options.length === 0;
      const searchResults =
        searchOptions && searchOptions[cfg.name]
          ? searchOptions[cfg.name]
          : options;
      return (
        <>
          <Dropdown
            key={cfg.name}
            dropdownname={cfg.label}
            name={cfg.name}
            results={options}
            value={String(values[cfg.name] ?? "")}
            searchResults={searchResults}
            onChange={(e) => setFieldValue(cfg.name, e.target.value)}
            disabled={dropdownDisabled}
          />
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </>
      );
    }
    const isAppFrom = cfg.name === "applicationNoFrom";
    const isAppTo = cfg.name === "applicationNoTo";
    const isMobile = cfg.name === "mobileNumber";
    const isIssueDate = cfg.name === "issueDate";
    const isAvailableAppFrom = cfg.name === "availableAppNoFrom";
    const isAvailableAppTo = cfg.name === "availableAppNoTo";
    const disabled =
      (isAppFrom && appNoFormMode === "middleware") ||
      isAppTo ||
      isMobile ||
      isAvailableAppFrom ||
      isAvailableAppTo ||
      !!cfg.disabled;
    if (isIssueDate) {
      return (
        <DatePickerWrapper
          cfg={cfg}
          values={values}
          setFieldValue={setFieldValue}
          disabled={disabled}
          errorMessage={errorMessage}
        />
      );
    }
    const handleChange = isAppFrom
      ? (e) => {
          if (appNoFormMode === "middleware") return;
          const onlyDigits = e.target.value.replace(/\D/g, "");
          setFieldValue(cfg.name, onlyDigits);
        }
      : (e) => setFieldValue(cfg.name, e.target.value);
    return (
      <>
        <Inputbox
          key={cfg.name}
          label={cfg.label}
          id={cfg.name}
          name={cfg.name}
          placeholder={cfg.placeholder || ""}
          type={cfg.type || "text"}
          value={String(values[cfg.name] ?? "")}
          onChange={handleChange}
          disabled={disabled}
        />
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      </>
    );
  };
  const validationSchema = useMemo(
    () => createValidationSchema(formType),
    [formType]
  );
  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      validationContext={{ formType }}
      onSubmit={(values, actions) => {
        console.log("Formik onSubmit called with values:", values);
        handleSubmit(values);
      }}
      enableReinitialize={false}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <Form className="distribute-form">
          <BackendPatcher
            appNoFormMode={appNoFormMode}
            middlewareAppNoFrom={middlewareAppNoFrom}
            backendValues={backendValues}
          />
          <AutoCalcAppTo />
          <ValuesBridge onValuesChange={onValuesChange} />
          <div className={styles.form_rows}>
            {fieldLayouts[formType].map((row) => (
              <div key={row.id} className={styles.field_row}>
                {row.fields.map((fname) => (
                  <div key={fname} className={styles.field_cell}>
                    {renderField(fname, values, setFieldValue, touched, errors)}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Button
            type="submit"
            buttonname={buttonLabel}
            righticon={rightarrow}
            margin={"0"}
            variant="primary"
            disabled={false}
          />
          {formError && <div className={styles.error}>{formError}</div>}
        </Form>
      )}
    </Formik>
  );
};

export default DistributeForm;
