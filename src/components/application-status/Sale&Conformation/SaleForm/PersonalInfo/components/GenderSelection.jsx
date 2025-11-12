import { Field } from "formik";
import Asterisk from "../../../../../../assets/application-status/Asterisk";
import FormError from "./FormError";
import styles from "./GenderSelection.module.css";

const GenderSelection = ({ 
  values, 
  setFieldValue, 
  setFieldTouched, 
  touched, 
  errors,
  genderOptions = [], // Receive gender options from parent
  isSubmitted,
  externalErrors,
  onClearFieldError
}) => {

  return (
    <div className={styles.gender_selection_form_field}>
      <div className={styles.gender_selection_container}>
        <div className={styles.gender_selection_field_label_wrapper}>
          <span className={styles.gender_selection_field_label}>
            Gender
            <Asterisk style={{ marginLeft: "4px" }} />
          </span>
        
        </div>
        <div className={styles.gender_selection_options}>
          {genderOptions.map((option, i) => (
            <label key={i} className={styles.gender_selection_label_wrapper}>
              <Field
                type="radio"
                name="gender"
                value={option.value}
                className={styles.gender_selection_radio}
              />
              <span 
                className={`${styles.gender_selection_label} ${
                  values.gender === option.value ? styles.gender_selection_active : ""
                }`} 
                onClick={() => {
                  // Clear external error for this field when user selects an option
                  if (onClearFieldError && externalErrors.gender) {
                    onClearFieldError('gender');
                  }
                  setFieldValue("gender", option.value);
                  setFieldTouched("gender", true);
                }}
              >
                <span className={styles.gender_selection_text_with_icon}>
                  {option.label}
                </span>
              </span>
            </label>
          ))}
        </div>
        <FormError
          name="gender"
          touched={touched}
          errors={errors}
          className={styles.gender_selection_error}
          showOnChange={true}
          isSubmitted={isSubmitted}
          externalErrors={externalErrors}
        />
      </div>
    </div>
  );
};

export default GenderSelection;
