import { Field } from "formik";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import GenderSelection from "./GenderSelection";
import FormError from "./FormError";
import styles from "./DownSection.module.css";

const DownSection = ({ 
  values, 
  handleChange, 
  handleBlur, 
  touched, 
  errors,
  setFieldValue,
  setFieldTouched,
  formFields,
  genderOptions,
  isSubmitted,
  externalErrors,
  onClearFieldError
}) => {
  // Custom handler for number-only fields
  const handleNumberFieldChange = (e) => {
    const { name, value } = e.target;
    
    // Clear external error for this field when user starts typing
    if (onClearFieldError && externalErrors[name]) {
      onClearFieldError(name);
    }
    
    // Filter out everything except numbers
    const filteredValue = value.replace(/[^0-9]/g, '');
    
    // Use Formik's setFieldValue to update the field
    if (setFieldValue) {
      setFieldValue(name, filteredValue);
    } else {
      // Fallback to regular handleChange with filtered value
      handleChange({
        ...e,
        target: {
          ...e.target,
          value: filteredValue
        }
      });
    }
  };

  return (
    <div className={styles.down_section_container}>
      <div className={styles.down_section_form_row}>
        <GenderSelection
          values={values}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          touched={touched}
          errors={errors}
          genderOptions={genderOptions}
          isSubmitted={isSubmitted}
          externalErrors={externalErrors}
          onClearFieldError={onClearFieldError}
        />
        <div className={styles.down_section_form_field}>
          {(() => {
            const aaparField = formFields.find(field => field.name === "aaparNo");
            return (
              <Field name={aaparField.name}>
                {({ field: fieldProps, meta }) => (
                  <Inputbox
                    label={aaparField.label}
                    id={aaparField.id}
                    name={aaparField.name}
                    placeholder={aaparField.placeholder}
                    value={values[aaparField.name] || ""}
                    onChange={handleNumberFieldChange}
                    onBlur={handleBlur}
                    type={aaparField.type}
                    error={meta.touched && meta.error}
                    required={aaparField.required}
                  />
                )}
              </Field>
            );
          })()}
          <FormError
            name="aaparNo"
            touched={touched}
            errors={errors}
            className={styles.down_section_error}
            showOnChange={false}
            isSubmitted={isSubmitted}
            externalErrors={externalErrors}
          />
        </div>
      </div>
    </div>
  );
};

export default DownSection;
