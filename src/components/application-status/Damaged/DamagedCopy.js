import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Inputbox from "../../Widgets/Inputbox/Input_box";
import Dropdown from "../../Widgets/Dropdown/Dropdown";
import Button from "../../Widgets/Button/Button";
import { ReactComponent as TrendingUpIcon } from "../../Asserts/ApplicationStatus/Trending up.svg";
import Asterisk from "../../Asserts/ApplicationStatus/Asterisk";
import styles from "./Damaged.module.css";
import {
  getProEmployees,
  getZoneEmployees,
  getDgmEmployees,
  getCampuses,
  getStatuses,
  getApplicationDetails,
  submitApplicationStatus,
} from "../../Bakend/apis";
 
const Damaged = () => {
  const location = useLocation();
  const [dropdownOptions, setDropdownOptions] = useState({
    zoneName: [],
    campusName: [],
    proName: [],
    dgmName: [],
    status: [],
  });
 
  // Map backend status string to frontend display value
  const reverseStatusMap = {
    damaged: "DAMAGED",
    withpro: "AVAILABLE",
    "not confirmed": "UNSOLD",
    confirmed: "CONFIRMED",
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
 
  // Normalize API response fields
  const normalizeApiResponse = (data) => {
    const getFullName = (emp) =>
      emp && emp.first_name && emp.last_name
        ? `${emp.first_name.trim()} ${emp.last_name.trim()}`.trim()
        : emp?.name?.trim() || "";
    return {
      applicationNo: data.applicationNo || data.application_no || "",
      zoneName: (data.zonal_name || data.zone || data.zoneName || getFullName(data.zone_employee) || "").trim(),
      zoneEmpId: data.zoneEmpId || data.zone_emp_id || data.zone_employee?.emp_id || null,
      campusName: (data.cmps_name || data.campus || data.campusName || "").trim(),
      campusId: data.campusId || data.campus_id || null,
      proName: (data.pro || data.proName || data.pro_name || getFullName(data.pro_employee) || "").trim(),
      proId: data.proId || data.pro_id || data.pro_employee?.emp_id || null,
      dgmName: (data.dgm || data.dgmName || data.dgm_name || getFullName(data.dgm_employee) || "").trim(),
      dgmEmpId: data.dgmEmpId || data.dgm_emp_id || data.dgm_employee?.emp_id || null,
      status: data.status || "",
      statusId: data.statusId || data.status_id || null,
      reason: data.reason || "",
    };
  };
 
  // Normalize strings for comparison (remove extra spaces, special characters, case-insensitive)
  const normalizeString = (str) =>
    str
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[^a-z0-9\s]/g, "") || "";
 
  // Find ID by label with robust matching
  const findIdByLabel = (options, label) => {
    const normalizedLabel = normalizeString(label);
    const match = options.find((opt) => normalizeString(opt.label) === normalizedLabel);
    if (!match) {
      console.warn(`No ID found for label: "${label}" (normalized: "${normalizedLabel}") in options:`, options);
    }
    return match?.value || null;
  };
 
  const initialValuesFromState = normalizeApiResponse(location.state?.initialValues || {});
  const initialStatus = initialValuesFromState.status || "";
  const mappedInitialStatus = reverseStatusMap[initialStatus.toLowerCase()] || "UNKNOWN";
 
  const initialValues = {
    applicationNo: initialValuesFromState.applicationNo || "",
    zoneName: initialValuesFromState.zoneName || "",
    zoneEmpId: initialValuesFromState.zoneEmpId || "",
    campusName: initialValuesFromState.campusName || "",
    campusId: initialValuesFromState.campusId || "",
    proName: initialValuesFromState.proName || "",
    proId: initialValuesFromState.proId || "",
    dgmName: initialValuesFromState.dgmName || "",
    dgmEmpId: initialValuesFromState.dgmEmpId || "",
    status: mappedInitialStatus,
    statusId: initialValuesFromState.statusId || "",
    reason: initialValuesFromState.reason || "",
  };
 
  const validationSchema = Yup.object().shape({
    applicationNo: Yup.string().required("Application No is required"),
    zoneName: Yup.string().required("Zone Name is required"),
    campusName: Yup.string().required("Campus Name is required"),
    proName: Yup.string().required("PRO Name is required"),
    dgmName: Yup.string().required("DGM Name is required"),
    status: Yup.string().required("Status is required"),
    reason: Yup.string().when("status", {
      is: "DAMAGED",
      then: (schema) =>
        schema.required("Reason is required when status is Damaged"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
 
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const [proEmployees, zoneEmployees, dgmEmployees, campuses, statuses] =
          await Promise.all([
            getProEmployees(),
            getZoneEmployees(),
            getDgmEmployees(),
            getCampuses(),
            getStatuses(),
          ]);
 
        console.log("API Responses:", {
          proEmployees,
          zoneEmployees,
          dgmEmployees,
          campuses,
          statuses,
        });
 
        setDropdownOptions({
          zoneName: zoneEmployees
            .map((emp) => ({
              label: (emp.first_name && emp.last_name
                ? `${emp.first_name.trim()} ${emp.last_name.trim()}`.trim()
                : emp.name?.trim() || ""),
              value: emp.emp_id || emp.id || emp.zoneEmpId || emp.zone_emp_id || null,
            }))
            .filter((opt) => opt.label && opt.value),
          campusName: campuses
            .map((campus) => ({
              label: (campus.campusName || campus.cmps_name || campus.campus || "").trim(),
              value: campus.id || campus.campusId || campus.campus_id || null,
            }))
            .filter((opt) => opt.label && opt.value),
          proName: proEmployees
            .map((emp) => ({
              label: (emp.first_name && emp.last_name
                ? `${emp.first_name.trim()} ${emp.last_name.trim()}`.trim()
                : emp.pro || emp.proName || emp.pro_name || emp.name || "").trim(),
              value: emp.emp_id || emp.id || emp.proId || emp.pro_id || null,
            }))
            .filter((opt) => opt.label && opt.value),
          dgmName: dgmEmployees
            .map((emp) => ({
              label: (emp.first_name && emp.last_name
                ? `${emp.first_name.trim()} ${emp.last_name.trim()}`.trim()
                : emp.dgm || emp.dgmName || emp.name || "").trim(),
              value: emp.emp_id || emp.id || emp.dgmEmpId || emp.dgm_emp_id || null,
            }))
            .filter((opt) => opt.label && opt.value),
          status: statuses
            .map((s) => {
              const statusName =
                typeof s === "string"
                  ? reverseStatusMap[s.toLowerCase()] || s.toUpperCase()
                  : reverseStatusMap[
                      (s.statusType ||
                        s.status_type ||
                        s.status ||
                        s.name ||
                        "").toLowerCase()
                    ] ||
                    (s.statusType ||
                      s.status_type ||
                      s.status ||
                      s.name ||
                      "").toUpperCase();
              return {
                label: statusName,
                value: s.id || s.statusId || s.status_id || null,
              };
            })
            .filter((opt) => opt.label && opt.value),
        });
 
        console.log("Dropdown Options:", {
          zoneName: dropdownOptions.zoneName,
          campusName: dropdownOptions.campusName,
          proName: dropdownOptions.proName,
          dgmName: dropdownOptions.dgmName,
          status: dropdownOptions.status,
        });
      } catch (error) {
        console.error("Error fetching dropdown options:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        alert("Error loading dropdown options. Please try again.");
      }
    };
 
    fetchDropdownOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const handleApplicationNoChange = async (applicationNo, setFieldValue) => {
    if (applicationNo) {
      try {
        const details = await getApplicationDetails(applicationNo);
        console.log("getApplicationDetails response:", details);
        if (!details) {
          alert("No application found for this Application No.");
          return;
        }
        const normalizedDetails = normalizeApiResponse(details);
        console.log("Normalized Details:", normalizedDetails);
 
        setFieldValue("zoneName", normalizedDetails.zoneName || "");
        setFieldValue("zoneEmpId", normalizedDetails.zoneEmpId || findIdByLabel(dropdownOptions.zoneName, normalizedDetails.zoneName) || "");
        setFieldValue("campusName", normalizedDetails.campusName || "");
        setFieldValue("campusId", normalizedDetails.campusId || findIdByLabel(dropdownOptions.campusName, normalizedDetails.campusName) || "");
        setFieldValue("proName", normalizedDetails.proName || "");
        setFieldValue("proId", normalizedDetails.proId || findIdByLabel(dropdownOptions.proName, normalizedDetails.proName) || "");
        setFieldValue("dgmName", normalizedDetails.dgmName || "");
        setFieldValue("dgmEmpId", normalizedDetails.dgmEmpId || findIdByLabel(dropdownOptions.dgmName, normalizedDetails.dgmName) || "");
        const backendStatus = normalizedDetails.status || "";
        const mappedStatus = reverseStatusMap[backendStatus.toLowerCase()] || "UNKNOWN";
        setFieldValue("status", mappedStatus);
        setFieldValue("statusId", normalizedDetails.statusId || findIdByLabel(dropdownOptions.status, mappedStatus) || "");
        setFieldValue("reason", normalizedDetails.reason || "");
      } catch (error) {
        console.error("Error fetching application details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status === 500 && error.response?.data?.includes("Duplicate row")) {
          alert(
            "Error: Multiple applications found for this Application No. Please contact support to resolve duplicate records."
          );
        } else {
          alert("Error fetching application details: " + (error.response?.data || error.message));
        }
      }
    }
  };
 
  const handleSubmit = async (values, { setSubmitting }) => {
    const updatedValues = {
      applicationNo: parseInt(values.applicationNo, 10) || 0,
      statusId: findIdByLabel(dropdownOptions.status, values.status) || values.statusId,
      reason: values.reason,
      campusId: findIdByLabel(dropdownOptions.campusName, values.campusName) || values.campusId,
      proId: findIdByLabel(dropdownOptions.proName, values.proName) || values.proId,
      zoneEmpId: findIdByLabel(dropdownOptions.zoneName, values.zoneName) || values.zoneEmpId,
      dgmEmpId: findIdByLabel(dropdownOptions.dgmName, values.dgmName) || values.dgmEmpId,
    };
 
    console.log("Submit payload object:", JSON.stringify(updatedValues, null, 2));
 
    // Validate that all required IDs are present and are numbers
    const missingIds = [];
    if (!updatedValues.statusId || isNaN(updatedValues.statusId)) missingIds.push("statusId");
    if (!updatedValues.campusId || isNaN(updatedValues.campusId)) missingIds.push("campusId");
    if (!updatedValues.proId || isNaN(updatedValues.proId)) missingIds.push("proId");
    if (!updatedValues.zoneEmpId || isNaN(updatedValues.zoneEmpId)) missingIds.push("zoneEmpId");
    if (!updatedValues.dgmEmpId || isNaN(updatedValues.dgmEmpId)) missingIds.push("dgmEmpId");
 
    if (missingIds.length > 0) {
      console.error("Missing or invalid IDs:", missingIds);
      alert(
        `Error: The following required IDs are missing or invalid: ${missingIds.join(", ")}. Please check your selections.`
      );
      setSubmitting(false);
      return;
    }
 
    try {
      const details = await getApplicationDetails(updatedValues.applicationNo);
      if (!details) {
        throw new Error("Application not found for this Application No.");
      }
 
      const response = await submitApplicationStatus(updatedValues);
      alert(`Form submitted successfully with status: ${response.status}`);
      console.log("Response from server:", response);
    } catch (error) {
      console.error("Error submitting form:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 500 && error.response?.data?.includes("Duplicate row")) {
        alert(
          "Error: Multiple applications found for this Application No. Please contact support to resolve duplicate records."
        );
      } else {
        alert(
          "Error submitting form: " +
            (error.response?.data || error.message)
        );
      }
    } finally {
      setSubmitting(false);
    }
  };
 
  const fields = [
    [
      {
        name: "applicationNo",
        label: "Application No",
        type: "input",
        required: true,
      },
      {
        name: "zoneName",
        label: "Zone Name",
        type: "select",
        options: dropdownOptions.zoneName.map((opt) => opt.label),
        required: true,
      },
      {
        name: "campusName",
        label: "Campus Name",
        type: "select",
        options: dropdownOptions.campusName.map((opt) => opt.label),
        required: true,
      },
    ],
    [
      {
        name: "proName",
        label: "PRO Name",
        type: "select",
        options: dropdownOptions.proName.map((opt) => opt.label),
        required: true,
      },
      {
        name: "dgmName",
        label: "DGM Name",
        type: "select",
        options: dropdownOptions.dgmName.map((opt) => opt.label),
        required: true,
      },
      {
        name: "status",
        label: "Select Status of Application",
        type: "select",
        options: dropdownOptions.status.map((opt) => opt.label),
        required: true,
      },
    ],
    [
      {
        name: "reason",
        label: "Enter The Reason",
        type: "textarea",
        className: styles.Damaged_damaged_Text_Area,
        required: false,
      },
    ],
  ];
 
  return (
    <div className={styles.Damaged_damaged_Page_Wrapper}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          setFieldValue,
          errors,
          touched,
          submitForm,
          isSubmitting,
        }) => {
          console.log("Form values:", values, "Errors:", errors);
          return (
            <Form className={styles.Damaged_damaged_Form_Wrapper}>
              {fields.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={styles.Damaged_damaged_Field_Row}
                >
                  {row.map((field) => (
                    <div
                      key={field.name}
                      className={styles.Damaged_damaged_Field_Column}
                    >
                      {field.type === "input" && (
                        <>
                          <Inputbox
                            label={field.label}
                            id={field.name}
                            name={field.name}
                            placeholder={`Enter ${field.label}`}
                            value={values[field.name] || ""}
                            onChange={(e) => {
                              handleChange(e);
                              if (field.name === "applicationNo") {
                                handleApplicationNoChange(
                                  e.target.value,
                                  setFieldValue
                                );
                              }
                            }}
                            onBlur={handleBlur}
                            error={touched[field.name] && errors[field.name]}
                            required={field.required}
                          />
                          <ErrorMessage
                            name={field.name}
                            component="div"
                            style={{ color: "red", fontSize: "12px" }}
                          />
                        </>
                      )}
 
                      {field.type === "select" && (
                        <>
                          <Dropdown
                            dropdownname={field.label}
                            name={field.name}
                            results={field.options}
                            value={values[field.name] || ""}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setFieldValue(field.name, selectedValue);
                              // Set corresponding ID field
                              if (field.name === "zoneName") {
                                const id = findIdByLabel(dropdownOptions.zoneName, selectedValue);
                                setFieldValue("zoneEmpId", id || "");
                                console.log(`Selected zoneName: "${selectedValue}", zoneEmpId:`, id);
                              } else if (field.name === "campusName") {
                                const id = findIdByLabel(dropdownOptions.campusName, selectedValue);
                                setFieldValue("campusId", id || "");
                                console.log(`Selected campusName: "${selectedValue}", campusId:`, id);
                              } else if (field.name === "proName") {
                                const id = findIdByLabel(dropdownOptions.proName, selectedValue);
                                setFieldValue("proId", id || "");
                                console.log(`Selected proName: "${selectedValue}", proId:`, id);
                              } else if (field.name === "dgmName") {
                                const id = findIdByLabel(dropdownOptions.dgmName, selectedValue);
                                setFieldValue("dgmEmpId", id || "");
                                console.log(`Selected dgmName: "${selectedValue}", dgmEmpId:`, id);
                              } else if (field.name === "status") {
                                const id = findIdByLabel(dropdownOptions.status, selectedValue);
                                setFieldValue("statusId", id || "");
                                console.log(`Selected status: "${selectedValue}", statusId:`, id);
                              }
                            }}
                            onBlur={handleBlur}
                            required={field.required}
                          />
                          <ErrorMessage
                            name={field.name}
                            component="div"
                            style={{ color: "red", fontSize: "12px" }}
                          />
                        </>
                      )}
 
                      {field.type === "textarea" && (
                        <div
                          className={styles.Damaged_damaged_textarea_container}
                        >
                          <label className={styles.Damaged_damaged_Label}>
                            {field.label}
                            {field.required && values.status === "DAMAGED" && (
                              <Asterisk style={{ marginLeft: "4px" }} />
                            )}
                          </label>
                          <textarea
                            name={field.name}
                            className={
                              field.className || styles.Damaged_damaged_Input
                            }
                            value={values[field.name] || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={`Enter ${field.label}`}
                            rows={4}
                          />
                          <ErrorMessage
                            name={field.name}
                            component="div"
                            style={{ color: "red", fontSize: "12px" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
 
              <Button
                type="submit"
                onClick={submitForm}
                variant="primary"
                buttonname="Submit"
                righticon={<TrendingUpIcon />}
                className={styles.Damaged_damaged_Submit_Button}
                disabled={isSubmitting}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
 
export default Damaged;