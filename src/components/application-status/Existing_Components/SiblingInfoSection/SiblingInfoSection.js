import React, { useState, useEffect } from "react";
import { FieldArray } from "formik";
import Inputbox from "../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../widgets/Dropdown/Dropdown";
import { Button as MuiButton } from "@mui/material";
import Button from "../../../../widgets/Button/Button";
import { ReactComponent as Add } from "../../../../assets/application-status/si_add-fill.svg";
import { ReactComponent as UploadIcon } from "../../../../assets/application-status/Upload.svg";
import * as Yup from "yup";
import styles from "./SiblingInfoSection.module.css";
 
const siblingValidationSchema = Yup.array().of(
  Yup.object().shape({
    fullName: Yup.string()
      .required("Full Name is required")
      .matches(/^[a-zA-Z\s]*$/, "Full Name can only contain letters and spaces"),
    relationType: Yup.string().required("Relation Type is required"),
    class: Yup.string().required("Class is required"),
    schoolName: Yup.string().required("School Name is required"),
    gender: Yup.string().required("Gender is required"),
  })
).nullable();
 
const SiblingInfoSection = ({
  values,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  dropdownOptions,
  loadingStates,
}) => {
  const [showSiblings, setShowSiblings] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
 
  // When all siblings are removed, revert to the initial CTA view
  useEffect(() => {
    const count = Array.isArray(values.siblingInformation) ? values.siblingInformation.length : 0;
    if (count === 0 && showSiblings) {
      setShowSiblings(false);
    }
  }, [values.siblingInformation?.length]);
 
  // Local validation function for sibling fields
  const validateSiblingField = async (fieldName, value) => {
    try {
      const siblingData = Array.isArray(values.siblingInformation) ? values.siblingInformation : [];
      await siblingValidationSchema.validateAt(fieldName, { siblingInformation: siblingData });
      // Clear error if validation passes
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error) {
      // Set error if validation fails
      setLocalErrors(prev => ({
        ...prev,
        [fieldName]: error.message
      }));
    }
  };
 
  // Helper function to check if a field should show an error
  const shouldShowSiblingError = (fieldName) => {
    return touched[fieldName] && (errors[fieldName] || localErrors[fieldName]);
  };
 
  // Helper function to get the error message for a field
  const getSiblingFieldError = (fieldName) => {
    return errors[fieldName] || localErrors[fieldName];
  };
 
  const handleRemoveAnnexure = (index) => {
    const updatedFiles = values.annexure.filter((_, i) => i !== index);
    setFieldValue("annexure", updatedFiles);
    setFieldTouched("annexure", true);
  };
 
  return (
    <FieldArray name="siblingInformation">
      {({ push, remove }) => (
        <div className={styles.Sibling_Info_Section_general_form_row}>
          <div className={`${styles.Sibling_Info_Section_general_sibling_container} ${styles.Sibling_Info_Section_general_full_width}`}>
            {showSiblings && (
              <div className={styles.siblingContainer}>
                <div className={styles.Sibling_Info_Section_general_field_label_wrapper}>
                  <span className={styles.Sibling_Info_Section_general_field_label}>Sibling Information</span>
                  <div className={styles.Sibling_Info_Section_general_line}></div>
                </div>
                <div>
                  {Array.isArray(values.siblingInformation) && values.siblingInformation.length > 0 ? (
                    values.siblingInformation.map((sibling, i) => (
                      <div key={i} className={styles.siblingBox}>
                        <div className={styles.siblingHeader}>
                          <span className={styles.siblingTag}>Sibling {i + 1}</span>
                          <div className={styles.actionBtns}>
                            <MuiButton
                              type="button"
                              className={styles.clearBtn}
                              onClick={() =>
                                setFieldValue(`siblingInformation.${i}`, {
                                  fullName: "",
                                  relationType: "",
                                  class: "",
                                  schoolName: "",
                                  gender: "",
                                })
                              }
                            >
                              Clear
                            </MuiButton>
                            <MuiButton
                              type="button"
                              className={styles.closeBtn}
                              onClick={() => {
                                const currentCount = Array.isArray(values.siblingInformation) ? values.siblingInformation.length : 0;
                                remove(i);
                                if (currentCount <= 1) {
                                  // After removing the last sibling, switch back to initial state
                                  setShowSiblings(false);
                                }
                              }}
                            >
                              ✕
                            </MuiButton>
                          </div>
                        </div>
                        <div className={styles.siblingFields}>
                          <Inputbox
                            label="Full Name"
                            name={`siblingInformation.${i}.fullName`}
                            placeholder="Enter Full Name"
                            value={sibling.fullName}
                            onChange={(e) => {
                              setFieldValue(`siblingInformation.${i}.fullName`, e.target.value);
                              setFieldTouched(`siblingInformation.${i}.fullName`, true);
                              validateSiblingField(`siblingInformation.${i}.fullName`, e.target.value);
                            }}
                            error={shouldShowSiblingError(`siblingInformation.${i}.fullName`)}
                            required
                          />
                          {shouldShowSiblingError(`siblingInformation.${i}.fullName`) && (
                            <div className={styles.Sibling_Info_Section_general_error}>
                              {getSiblingFieldError(`siblingInformation.${i}.fullName`)}
                            </div>
                          )}
                          <Dropdown
                            dropdownname="Relation Type"
                            name={`siblingInformation.${i}.relationType`}
                            results={(dropdownOptions.relationTypes || [])
                              .filter((opt) => !['Father', 'Mother', 'Guardian'].includes(opt.label))
                              .map((opt) => opt.label)}
                            value={(dropdownOptions.relationTypes || []).find((opt) => opt.id === sibling.relationType)?.label || ""}
                            onChange={(e) => {
                              const selectedLabel = e.target.value;
                              const selectedOption = dropdownOptions.relationTypes.find((opt) => opt.label === selectedLabel);
                              setFieldValue(`siblingInformation.${i}.relationType`, selectedOption ? selectedOption.id : "");
                              setFieldTouched(`siblingInformation.${i}.relationType`, true);
                              validateSiblingField(`siblingInformation.${i}.relationType`, selectedOption ? selectedOption.id : "");
                            }}
                            error={shouldShowSiblingError(`siblingInformation.${i}.relationType`)}
                            disabled={loadingStates.relationTypes}
                            loading={loadingStates.relationTypes}
                          />
                          {shouldShowSiblingError(`siblingInformation.${i}.relationType`) && (
                            <div className={styles.Sibling_Info_Section_general_error}>
                              {getSiblingFieldError(`siblingInformation.${i}.relationType`)}
                            </div>
                          )}
                          <Dropdown
                            dropdownname="Select Class"
                            name={`siblingInformation.${i}.class`}
                            results={(dropdownOptions.allStudentClasses || []).map((opt) => opt.label)}
                            value={(dropdownOptions.allStudentClasses || []).find((opt) => opt.id === sibling.class)?.label || ""}
                            onChange={(e) => {
                              const selectedLabel = e.target.value;
                              const selectedOption = dropdownOptions.allStudentClasses.find((opt) => opt.label === selectedLabel);
                              setFieldValue(`siblingInformation.${i}.class`, selectedOption ? selectedOption.id : "");
                              setFieldTouched(`siblingInformation.${i}.class`, true);
                              validateSiblingField(`siblingInformation.${i}.class`, selectedOption ? selectedOption.id : "");
                            }}
                            error={shouldShowSiblingError(`siblingInformation.${i}.class`)}
                            disabled={loadingStates.allStudentClasses}
                            loading={loadingStates.allStudentClasses}
                          />
                          {shouldShowSiblingError(`siblingInformation.${i}.class`) && (
                            <div className={styles.Sibling_Info_Section_general_error}>
                              {getSiblingFieldError(`siblingInformation.${i}.class`)}
                            </div>
                          )}
                          <Dropdown
                            dropdownname="Gender"
                            name={`siblingInformation.${i}.gender`}
                            results={(dropdownOptions.genders || []).map((opt) => opt.label)}
                            value={(dropdownOptions.genders || []).find((opt) => opt.id === sibling.gender)?.label || ""}
                            onChange={(e) => {
                              const selectedLabel = e.target.value;
                              const selectedOption = dropdownOptions.genders.find((opt) => opt.label === selectedLabel);
                              setFieldValue(`siblingInformation.${i}.gender`, selectedOption ? selectedOption.id : "");
                              setFieldTouched(`siblingInformation.${i}.gender`, true);
                              validateSiblingField(`siblingInformation.${i}.gender`, selectedOption ? selectedOption.id : "");
                            }}
                            error={shouldShowSiblingError(`siblingInformation.${i}.gender`)}
                            disabled={loadingStates.genders}
                            loading={loadingStates.genders}
                          />
                          {shouldShowSiblingError(`siblingInformation.${i}.gender`) && (
                            <div className={styles.Sibling_Info_Section_general_error}>
                              {getSiblingFieldError(`siblingInformation.${i}.gender`)}
                            </div>
                          )}
                          <div className={styles.siblingFieldRow}>
                            <Inputbox
                              label="School Name"
                              name={`siblingInformation.${i}.schoolName`}
                              placeholder="Enter School Name"
                              value={sibling.schoolName}
                              onChange={(e) => {
                                setFieldValue(`siblingInformation.${i}.schoolName`, e.target.value);
                                setFieldTouched(`siblingInformation.${i}.schoolName`, true);
                                validateSiblingField(`siblingInformation.${i}.schoolName`, e.target.value);
                              }}
                              error={shouldShowSiblingError(`siblingInformation.${i}.schoolName`)}
                            />
                          </div>                          {shouldShowSiblingError(`siblingInformation.${i}.schoolName`) && (
                            <div className={styles.Sibling_Info_Section_general_error}>
                              {getSiblingFieldError(`siblingInformation.${i}.schoolName`)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                  <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
                    <Button
                      type="button"
                      variant="secondary"
                      buttonname="Add Another Sibling"
                      righticon={<Add />}
                      className={styles.addSiblingBtn}
                      onClick={() => {
                        // Ensure siblingInformation array is initialized
                        if (!Array.isArray(values.siblingInformation)) {
                          setFieldValue("siblingInformation", []);
                        }
                        push({
                          fullName: "",
                          relationType: "",
                          class: "",
                          schoolName: "",
                          gender: "",
                        });
                        setShowSiblings(true);
                      }}
                    />
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Button
                      type="button"
                      variant="secondary"
                      buttonname="Add Annexure"
                      righticon={<Add />}
                      className={styles.addSiblingBtn}
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                        input.multiple = true;
                        input.onchange = (e) => {
                          const { files } = e.target;
                          if (files && files.length > 0) {
                            const existingFiles = Array.isArray(values.annexure) ? values.annexure : [];
                            const newFiles = Array.from(files);
                            const finalValue = [...existingFiles, ...newFiles];
                            setFieldValue("annexure", finalValue);
                            setFieldTouched("annexure", true);
                          }
                        };
                        input.click();
                      }}
                    />
                    {Array.isArray(values.annexure) && values.annexure.length > 0 && (
                      <div className={styles.fileList} style={{ marginTop: "10px" }}>
                        <ul>
                          {values.annexure.map((file, i) => (
                            <li key={i} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
                              <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                              <MuiButton
                                type="button"
                                style={{ marginLeft: "10px", color: "red" }}
                                onClick={() => handleRemoveAnnexure(i)}
                              >
                                Remove
                              </MuiButton>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {!showSiblings && (
              <div
                className={styles.Sibling_Info_Section_general_form_row}
                style={{
                  display: "flex",
                  // gridTemplateColumns: "1fr 1fr 1fr", // three equal columns
                  gap: "40px",
                }}
              >
                <div className={styles.Sibling_Info_Section_general_form_field}>
                  <Button
                    type="button"
                    variant="secondary"
                    buttonname="Add Sibling"
                    lefticon={<Add />}
                    width={"100%"}
                    className={styles.addSiblingBtn}
                    onClick={() => {
                      // Ensure siblingInformation array is initialized
                      if (!Array.isArray(values.siblingInformation)) {
                        setFieldValue("siblingInformation", []);
                      }
                      push({
                        fullName: "",
                        relationType: "",
                        class: "",
                        schoolName: "",
                        gender: "",
                      });
                      setShowSiblings(true);
                    }}
                  />
                </div>
                <div className={styles.Sibling_Info_Section_general_form_field}>
                  <Button
                    type="button"
                    variant="secondary"
                    buttonname="Upload Annexure"
                    lefticon={<UploadIcon />}
                    width={"100%"}
                    className={styles.addAnnexures}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept =
                        "application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                      input.multiple = true;
                      input.onchange = (e) => {
                        const { files } = e.target;
                        if (files && files.length > 0) {
                          const existingFiles = Array.isArray(values.annexure) ? values.annexure : [];
                          const newFiles = Array.from(files);
                          const finalValue = [...existingFiles, ...newFiles];
                          setFieldValue("annexure", finalValue);
                          setFieldTouched("annexure", true);
                        }
                      };
                      input.click();
                    }}
                  />
                  {Array.isArray(values.annexure) && values.annexure.length > 0 && (
                    <div className={styles.fileList} style={{ marginTop: "10px" }}>
                      <ul>
                        {values.annexure.map((file, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
                            <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                            <MuiButton
                              type="button"
                              style={{ marginLeft: "10px", color: "red" }}
                              onClick={() => handleRemoveAnnexure(i)}
                            >
                              Remove
                            </MuiButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className={styles.Sibling_Info_Section_general_form_field}></div>
              </div>
            )}
          </div>
        </div>
      )}
    </FieldArray>
  );
};
 
SiblingInfoSection.validationSchema = siblingValidationSchema;
export default SiblingInfoSection;