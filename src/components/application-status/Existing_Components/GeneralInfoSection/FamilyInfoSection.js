import { useEffect, useState } from "react";
import Inputbox from "../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../widgets/Dropdown/Dropdown";
import { ReactComponent as EmailIcon } from "../../../../assets/application-status/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "../../../../assets/application-status/PhoneIcon.svg";
import styles from "./GeneralInfoSection.module.css";

const FamilyInfoSection = ({
  values,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  handleSectionChange,
  shouldShowError,
  getFieldError,
  dropdownOptions,
  loadingStates,
  capitalizeText
}) => {
  const fatherFields = [
    { label: "Father Name", name: "fatherName", placeholder: "Enter Father Name", required: true },
    { label: "Occupation", name: "fatherOccupation", placeholder: "Enter Occupation" },
    { label: "Phone Number", name: "fatherPhoneNumber", placeholder: "Enter Phone Number", required: true },
    { label: "Email Id", name: "fatherEmail", placeholder: "Enter Father Mail id" },
  ];

  const motherFields = [
    { label: "Mother Name", name: "motherName", placeholder: "Enter Mother Name", required: true },
    { label: "Occupation", name: "motherOccupation", placeholder: "Enter Occupation" },
    { label: "Phone Number", name: "motherPhoneNumber", placeholder: "Enter Phone Number", required: true },
    { label: "Email Id", name: "motherEmail", placeholder: "Enter Mother Mail id" },
  ];

  return (
    <>
      {/* Father Information */}
      <div className={styles.General_Info_Section_general_form_row}>
        <div className={`${styles.General_Info_Section_general_sibling_container} ${styles.General_Info_Section_general_full_width}`}>
          <div className={styles.General_Info_Section_general_field_label_wrapper}>
            <span className={styles.General_Info_Section_general_field_label}>Father Information</span>
            <div className={styles.General_Info_Section_general_line}></div>
          </div>
          <div className={styles.General_Info_Section_general_form_grid}>
            {fatherFields.map((field, index) => (
              <div key={index} className={styles.General_Info_Section_general_form_field}>
                {field.name === "fatherPhoneNumber" ? (
                  <div className={styles.inputWithIconWrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={values[field.name] || ""}
                      onChange={handleSectionChange}
                      required={field.required}
                      type={field.type || "text"}
                      error={shouldShowError(field.name)}
                    />
                    <PhoneIcon className={styles.inputWithIcon} />
                  </div>
                ) : field.name === "fatherEmail" ? (
                  <div className={styles.inputWithIconWrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={values[field.name] || ""}
                      onChange={handleSectionChange}
                      required={field.required}
                      type={field.type || "text"}
                      error={shouldShowError(field.name)}
                    />
                    <EmailIcon className={styles.inputWithIcon} />
                  </div>
                ) : (
                  <Inputbox
                    label={field.label}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={handleSectionChange}
                    type={field.type || "text"}
                    error={shouldShowError(field.name)}
                    required={field.required}
                  />
                )}
                {shouldShowError(field.name) && (
                  <div className={styles.General_Info_Section_general_error}>
                    {getFieldError(field.name)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing between Father and Mother Information */}
      <div style={{ marginTop: "20px" }}></div>

      {/* Mother Information */}
      <div className={styles.General_Info_Section_general_form_row}>
        <div className={`${styles.General_Info_Section_general_sibling_container} ${styles.General_Info_Section_general_full_width}`}>
          <div className={styles.General_Info_Section_general_field_label_wrapper}>
            <span className={styles.General_Info_Section_general_field_label}>Mother Information</span>
            <div className={styles.General_Info_Section_general_line}></div>
          </div>
          <div className={styles.General_Info_Section_general_form_grid}>
            {motherFields.map((field, index) => (
              <div key={index} className={styles.General_Info_Section_general_form_field}>
                {field.name === "motherPhoneNumber" ? (
                  <div className={styles.inputWithIconWrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={values[field.name] || ""}
                      onChange={handleSectionChange}
                      required={field.required}
                      type={field.type || "text"}
                      error={shouldShowError(field.name)}
                    />
                    <PhoneIcon className={styles.inputWithIcon} />
                  </div>
                ) : field.name === "motherEmail" ? (
                  <div className={styles.inputWithIconWrapper}>
                    <Inputbox
                      label={field.label}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={values[field.name] || ""}
                      onChange={handleSectionChange}
                      required={field.required}
                      type={field.type || "text"}
                      error={shouldShowError(field.name)}
                    />
                    <EmailIcon className={styles.inputWithIcon} />
                  </div>
                ) : (
                  <Inputbox
                    label={field.label}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={handleSectionChange}
                    type={field.type || "text"}
                    error={shouldShowError(field.name)}
                    required={field.required}
                  />
                )}
                {shouldShowError(field.name) && (
                  <div className={styles.General_Info_Section_general_error}>
                    {getFieldError(field.name)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FamilyInfoSection;