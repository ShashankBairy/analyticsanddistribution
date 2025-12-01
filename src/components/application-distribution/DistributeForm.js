import React, { useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import Dropdown from "../../widgets/Dropdown/Dropdown";
import Inputbox from "../../widgets/Inputbox/InputBox";
import Button from "../../widgets/Button/Button";
import createValidationSchema from "./ValidationSchema";
import styles from "./DistributeForm.module.css";
import rightarrow from "../../assets/application-distribution/rightarrow";
import RangeInputBox from "../../widgets/Range/RangeInputBox";
import { handlePostSubmit } from "../../queries/application-distribution/distributionpostqueries";
import { updateZone, updateDgm,updateCampus,} from "../../queries/application-distribution/distibutionupdatequeries";
import CurrentDate from "../../widgets/DateWidgets/CurrentDate/CurrentDate";
import { fieldLayouts, getFieldsForType } from "./fieldConfigs";
import { getCurrentDate } from "../../utils/getCurrentDate";
import { AutoCalcAppTo, ValuesBridge, BackendPatcher} from "./distributionFormikComponents";
import { buildInitialValues } from "./buildInitialValuesForDistribution";

import Popup from "../../widgets/PopupWidgets/Popup";


const normalizeOptions = (options) =>
  Array.isArray(options) ? options.filter((v) => v != null).map(String) : [];

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
  onApplicationFeeSelect,
  skipAppNoPatch = false,
  onSeriesSelect,
  applicationSeriesList,
}) => {

  const employeeId = localStorage.getItem("empId");
  const category = localStorage.getItem("category");

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
        if (t === "zone") resp = await updateZone(editId, values,employeeId);
        else if (t === "dgm") resp = await updateDgm(editId, values,employeeId);
        else if (t === "campus") resp = await updateCampus(editId, values,employeeId,category);
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
        employeeId: employeeId,
        category: category,
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
            onChange={(e) => {
            const val = e.target.value;
            setFieldValue(cfg.name, val);

            if (cfg.name === "applicationFee") {
              onApplicationFeeSelect?.(Number(val));
            }

            if (cfg.name === "applicationSeries") {
              const found = applicationSeriesList?.find(
                (s) => s.displaySeries === val
              );
              onSeriesSelect?.(found?.displaySeries || null);
            }
          }}
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
        <CurrentDate
        label={"Issued Date"}
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
