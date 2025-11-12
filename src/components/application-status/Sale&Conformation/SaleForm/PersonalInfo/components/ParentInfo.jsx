import FieldRenderer from "./FieldRenderer";
import styles from "./ParentInfo.module.css";

const ParentInfo = ({ 
  values, 
  handleChange, 
  handleBlur, 
  touched, 
  errors,
  admissionReferredByOptions,
  quotaOptions,
  formFields,
  setFieldValue,
  isSubmitted,
  externalErrors,
  onClearFieldError
}) => {
  return (
    <div className={styles.parent_info_grid_container}>
      {/* Parent Information Section Title */}
      <div className={`${styles.parent_info_field_label_wrapper} ${styles.parent_info_full_width}`}>
        <span className={styles.parent_info_field_label}>
          Parent Information
        </span>
        <div className={styles.parent_info_line}></div>
      </div>

      {/* Parent Information Fields */}
      <div className={styles.parent_info_form_row}>
        <FieldRenderer
          fields={formFields.slice(9, 11)}
          values={values}
          handleChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
          admissionReferredByOptions={admissionReferredByOptions}
          quotaOptions={quotaOptions}
          errorClassName={styles.parent_info_error}
          setFieldValue={setFieldValue}
          isSubmitted={isSubmitted}
          externalErrors={externalErrors}
          onClearFieldError={onClearFieldError}
        />

        {/* Empty field for grid alignment */}
        <div className={styles.parent_info_form_field}>
          {/* Empty field to maintain grid structure */}
        </div>
      </div>
    </div>
  );
};

export default ParentInfo;
