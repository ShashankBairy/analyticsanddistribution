import React from 'react';
import { Button as MUIButton } from "@mui/material";
import Button from "../../../../../widgets/Button/Button";
import Dropdown from "../../../../../widgets/Dropdown/Dropdown";
import InputBox from "../../../../../widgets/Inputbox/InputBox";
import { ReactComponent as BackArrow } from "../../../../../assets/application-status/Backarrow.svg";
import { ReactComponent as PhoneIcon } from "../../../../../assets/application-status/PhoneIcon.svg";
import SkipIcon from "../../../../../assets/application-status/SkipIcon.svg";
import { ReactComponent as TrendingUpIcon } from "../../../../../assets/application-status/Trending up.svg";
import styles from "../ConcessionInfoSection.module.css";

/**
 * ConcessionFields component for rendering concession form fields
 * Extracted from ConcessionInfoSection.js lines 930-1177
 * Preserves every single line and functionality exactly as manager wants
 */
const ConcessionFields = ({
  values,
  errors,
  touched,
  handleSectionChange,
  handleEmployeeChange,
  handleReasonChange,
  handleApplyCoupon,
  handleSubmit,
  setFieldValue,
  setFieldTouched,
  setActiveStep,
  validateForm,
  showMobileNumber,
  setShowMobileNumber,
  flatfields,
  concessionMapping,
  loadingStates,
  shouldShowError,
  getFieldError,
  persistentErrors,
  snackbar,
  closeSnackbar,
  joiningClassName,
  handleBack,
  showSnackbar
}) => {
  return (
    <div key={`concession-${joiningClassName || 'default'}`} className={styles.Concession_Info_Section_concessionsContainer}>
      <div className={styles.Concession_Info_Section_applyCoupon}>
        <div>
          <div className={styles.Concession_Info_Section_applyCouponLabel}>
            <span className={styles.Concession_Info_Section_applyCouponLabelName}>Apply Coupon</span>
            <div className={styles.Concession_Info_Section_line}></div>
          </div>
          <div className={styles.Concession_Info_Section_couponSection}>
            <InputBox
              name="coupon"
              placeholder="Enter Coupon"
              className={styles.Concession_Info_Section_couponInput}
              onChange={handleSectionChange}
              value={values.coupon || ""}
            />
            <MUIButton
              variant="contained"
              className={styles.Concession_Info_Section_applyBtn}
              onClick={handleApplyCoupon}
            >
              Apply Coupon
            </MUIButton>
          </div>
        </div>
      </div>
      <div className={styles.Concession_Info_Section_concessionsFields}>
        {showMobileNumber && (
          <>
            <div className={styles.Concession_Info_Section_concessionInput}>
              <div className={styles.ConcessioninputWithIconWrapper}>
                <InputBox
                  label={flatfields[0]?.label || "Mobile Number"}
                  name={flatfields[0]?.name || "mobileNumber"}
                  placeholder={flatfields[0]?.placeholder || "Enter Mobile Number"}
                  value={values[flatfields[0]?.name] || ""}
                  required={flatfields[0]?.required || false}
                  onChange={handleSectionChange}
                />
                <PhoneIcon className={styles.ConcessioninputWithIcon} />
              </div>
              {touched[flatfields[0]?.name] && errors[flatfields[0]?.name] && (
                <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[0]?.name]}</div>
              )}
            </div>
            <div className={styles.Concession_Info_Section_emptyField}></div>
            <div className={styles.Concession_Info_Section_emptyField}></div>
          </>
        )}
        {flatfields.slice(1, 8).map((field, index) => {
          // Check if this field should be shown based on concession mapping
          const shouldShowField = () => {
            if (field.name === 'yearConcession1st' || field.name === 'yearConcession2nd' || field.name === 'yearConcession3rd') {
              const fieldMapping = concessionMapping.fields.find(f => f.name === field.name);
              return fieldMapping ? fieldMapping.show : true;
            }
            return true; // Show all other fields
          };
          
          if (!shouldShowField()) {
            return null; // Don't render this field
          }
          
          return (
            <div
              key={index + 1}
              className={styles.Concession_Info_Section_concessionInput}
            >
              {field.type === "select" ? (
                <Dropdown
                  dropdownname={field.label}
                  name={field.name}
                  results={field.options?.map((opt) => opt.label) || []}
                  value={values[field.name] || ""}
                  onChange={field.name.includes("givenBy") || field.name.includes("authorizedBy")
                    ? handleEmployeeChange(field.name)
                    : field.name === "reason"
                    ? handleReasonChange
                    : handleSectionChange}
                  required={field.required}
                  disabled={field.name === "reason" ? loadingStates.reasons : loadingStates.employees}
                  loading={field.name === "reason" ? loadingStates.reasons : loadingStates.employees}
                />
              ) : (
                <InputBox
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] || ""}
                  required={field.required}
                  onChange={handleSectionChange}
                />
              )}
              {shouldShowError(field.name) || (touched[field.name] && (errors[field.name] || errors[`${field.name}Id`])) || persistentErrors[field.name] || persistentErrors[`${field.name}Id`] ? (
                <div className={styles.Concession_Info_Section_concessionError}>
                  {getFieldError(field.name) || errors[field.name] || errors[`${field.name}Id`] || persistentErrors[field.name] || persistentErrors[`${field.name}Id`]}
                </div>
              ) : null}
            </div>
          );
        })}
        <div className={styles.Concession_Info_Section_emptyField}></div>
        <div className={styles.Concession_Info_Section_emptyField}></div>
        <div className={styles.Concession_Info_Section_extraConcession}>
          <label className={styles.ConcessionInfoSection_squareCheckbox}>
            <input
              type="checkbox"
              name="additionalConcession"
              checked={values.additionalConcession || false}
              onChange={(e) => setFieldValue("additionalConcession", e.target.checked)}
            />
            <span className={styles.ConcessionInfoSection_checkmark}></span>
            Additional Concession Written on Application
          </label>
          <div className={styles.line}></div>
        </div>
        {values.additionalConcession && (
          <>
            <div className={styles.Concession_Info_Section_concessionInput}>
              <InputBox
                label={flatfields[8]?.label || "Concession Amount"}
                name={flatfields[8]?.name || "concessionAmount"}
                placeholder={flatfields[8]?.placeholder || "Enter Concession Amount"}
                value={values[flatfields[8]?.name] || ""}
                required={true}
                onChange={handleSectionChange}
              />
              {touched[flatfields[8]?.name] && errors[flatfields[8]?.name] && (
                <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[8]?.name]}</div>
              )}
            </div>
            <div className={styles.Concession_Info_Section_concessionInput}>
              <Dropdown
                dropdownname={flatfields[9]?.label || "Concession Written By"}
                name={flatfields[9]?.name || "concessionWrittenBy"}
                results={flatfields[9]?.options?.map((opt) => opt.label) || []}
                value={values[flatfields[9]?.name] || ""}
                onChange={handleEmployeeChange(flatfields[9]?.name || "concessionWrittenBy")}
                required={true}
                disabled={loadingStates.employees}
                loading={loadingStates.employees}
              />
              {(touched[flatfields[9]?.name] && (errors[flatfields[9]?.name] || errors[`${flatfields[9]?.name}Id`])) || persistentErrors[flatfields[9]?.name] || persistentErrors[`${flatfields[9]?.name}Id`] ? (
                <div className={styles.Concession_Info_Section_concessionError}>
                  {errors[flatfields[9]?.name] || errors[`${flatfields[9]?.name}Id`] || persistentErrors[flatfields[9]?.name] || persistentErrors[`${flatfields[9]?.name}Id`]}
                </div>
              ) : null}
            </div>
            <div className={styles.Concession_Info_Section_concessionInput}>
              <InputBox
                label={flatfields[10]?.label || "Additional Reason"}
                name={flatfields[10]?.name || "additionalReason"}
                placeholder={flatfields[10]?.placeholder || "Enter Additional Reason"}
                value={values[flatfields[10]?.name] || ""}
                required={true}
                onChange={handleSectionChange}
              />
              {touched[flatfields[10]?.name] && errors[flatfields[10]?.name] && (
                <div className={styles.Concession_Info_Section_concessionError}>{errors[flatfields[10]?.name]}</div>
              )}
            </div>
          </>
        )}
      </div>
      <div className={styles.Concession_Info_Section_buttonRow}>
        <Button
          type="button"
          variant="secondary"
          buttonname="Back"
          lefticon={<BackArrow />}
          onClick={handleBack}
          width={"100%"}
        />
        <Button
          type="button"
          variant="primary"
          buttonname="Proceed To Add Address"
          righticon={<TrendingUpIcon />}
          onClick={handleSubmit}
        />
      </div>
      <a
        href="#"
        className={styles.concessionLinkButton}
        onClick={async (e) => {
          e.preventDefault();
         
          // Log complete form data object for skip to payments
          console.log("🚀 ===== CONCESSION SKIP TO PAYMENTS - FINAL SUBMITTING OBJECT =====");
          console.log("📋 Complete Form Data:", JSON.stringify(values, null, 2));
          console.log("📊 Form Data Summary:", {
            totalFields: Object.keys(values).length,
            filledFields: Object.keys(values).filter(key => values[key] !== "" && values[key] != null).length,
            emptyFields: Object.keys(values).filter(key => values[key] === "" || values[key] == null).length,
            formValues: values
          });
          console.log("🔍 Field-by-Field Data:");
          Object.entries(values).forEach(([key, value]) => {
            console.log(`  ${key}:`, value);
          });
          console.log("🚀 ===== END CONCESSION SKIP TO PAYMENTS OBJECT =====");
         
          const errors = await validateForm();
          const touchedFields = Object.keys(errors).reduce((acc, field) => {
            acc[field] = true;
            return acc;
          }, {});
          setFieldTouched(touchedFields);
          if (Object.keys(errors).length === 0) {
            setActiveStep && setActiveStep(3);
          } else {
            const errorMessage = "Please correct the following errors before proceeding to payments:\n" +
              Object.entries(errors)
                .map(([field, error]) => `${field}: ${error}`)
                .join("\n");
            showSnackbar(errorMessage, 'error');
          }
        }}
      >
        <figure style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <img src={SkipIcon} alt="Skip" style={{ width: 24, height: 24 }} />
        </figure>
        Skip all and proceed to payments
      </a>
    </div>
  );
};

export default ConcessionFields;
