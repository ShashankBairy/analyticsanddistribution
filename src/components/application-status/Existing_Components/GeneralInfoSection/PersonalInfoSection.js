import { useEffect, useState } from "react";
import Inputbox from "../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../widgets/Dropdown/Dropdown";
import { ReactComponent as UploadIcon } from "../../../../assets/application-status/Upload.svg";
import Asterisk from "../../../../assets/application-status/Asterisk";
import CashIcon from "../../../../assets/application-status/Cash (1).svg";
import DDIcon from "../../../../assets/application-status/DD (1).svg";
import styles from "./GeneralInfoSection.module.css";

const PersonalInfoSection = ({
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
  profilePhotoPreview,
  setProfilePhotoPreview,
  capitalizeText
}) => {
  return (
    <div className={styles.custom_flex_container}>
      <div className={styles.custom_left_group}>
        {/* UP DIV - First Name and Surname */}
        <div className={styles.custom_up_section}>
          <div className={styles.General_Info_Section_general_form_row}>
            <div className={styles.General_Info_Section_general_form_field}>
              <Inputbox
                label="First Name"
                id="firstName"
                name="firstName"
                placeholder="Enter Name"
                value={values.firstName || ""}
                onChange={handleSectionChange}
                type="text"
                error={shouldShowError("firstName")}
                required
              />
              {shouldShowError("firstName") && (
                <div className={styles.General_Info_Section_general_error}>
                  {getFieldError("firstName")}
                </div>
              )}
            </div>
            <div className={styles.General_Info_Section_general_form_field}>
              <Inputbox
                label="Surname"
                id="surname"
                name="surname"
                placeholder="Enter Name"
                value={values.surname || ""}
                onChange={handleSectionChange}
                type="text"
                error={shouldShowError("surname")}
                required
              />
              {shouldShowError("surname") && (
                <div className={styles.General_Info_Section_general_error}>
                  {getFieldError("surname")}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* DOWN DIV - Category Field */}
        <div className={styles.custom_down_section}>
          <div className={styles.General_Info_Section_general_form_row}>
            <div className={styles.General_Info_Section_general_form_field}>
              <div className={styles.General_Info_Section_general_category_container}>
                <div className={styles.General_Info_Section_general_field_label_wrapper}>
                  <span className={styles.General_Info_Section_general_field_label}>
                    Category
                    <Asterisk style={{ marginLeft: "4px" }} />
                  </span>
                  <div className={styles.General_Info_Section_general_line}></div>
                </div>
                <div className={styles.General_Info_Section_general_category_options}>
                  {[
                    { value: 1, label: "SSC" },
                    { value: 2, label: "Other" }
                  ].map((option, i) => (
                    <label key={i} className={styles.General_Info_Section_general_category_label_wrapper}>
                      <input
                        type="radio"
                        name="category"
                        value={option.value}
                        checked={values.category === option.value}
                        onChange={() => {
                          setFieldValue("category", option.value);
                          setFieldTouched("category", true);
                        }}
                        className={styles.General_Info_Section_general_category_radio}
                      />
                      <span className={`${styles.General_Info_Section_general_category_label} ${values.category === option.value ? styles.General_Info_Section_general_category_active : ""}`} onClick={() => {
                        setFieldValue("category", option.value);
                        setFieldTouched("category", true);
                      }}>
                        <span className={styles.General_Info_Section_general_category_text_with_icon}>
                          {option.label === "SSC" && <figure className={styles.General_Info_Section_general_category_icon}><img src={CashIcon} alt="cash-icon" style={{ width: "18px", height: "18px" }} /></figure>}
                          {option.label === "Other" && <figure className={styles.General_Info_Section_general_category_icon}><img src={DDIcon} alt="dd-icon" style={{ width: "18px", height: "18px" }} /></figure>}
                          {option.label}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {shouldShowError("category") && (
                  <div className={styles.General_Info_Section_general_error}>
                    {getFieldError("category")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.custom_right_group}>
        <div className={styles.General_Info_Section_general_form_field}>
          <div className={styles.profilePhotoUpload}>
            <label htmlFor="profilePhoto-input" className={styles.profilePhotoLabel}>
              <div className={styles.uploadCircle}>
                {profilePhotoPreview ? (
                  <img src={profilePhotoPreview} alt="Profile Preview" className={styles.previewImage} />
                ) : (
                  <>
                    <figure className={styles.uploadIconFigure}>
                      <UploadIcon className={styles.uploadSvg} />
                    </figure>
                    <span className={styles.uploadText}>Upload image of student</span>
                  </>
                )}
              </div>
            </label>
            <input
              id="profilePhoto-input"
              name="profilePhoto"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleSectionChange}
              style={{ display: 'none' }}
              required
            />
            {shouldShowError("profilePhoto") && (
              <div className={styles.General_Info_Section_general_error}>
                {getFieldError("profilePhoto")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;