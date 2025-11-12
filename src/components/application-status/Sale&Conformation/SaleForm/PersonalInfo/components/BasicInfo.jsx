import { Field } from "formik";
import Inputbox from "../../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../../widgets/Dropdown/Dropdown";
import FormError from "./FormError";
import { capitalizeWords } from "../../../../../../utils/textUtils";
import styles from "./BasicInfo.module.css";

const BasicInfo = ({ 
  values, 
  handleChange, 
  handleBlur, 
  touched, 
  errors,
  admissionReferredByOptions,
  quotaOptions,
  admissionTypeOptions,
  genderOptions,
  authorizedByOptions,
  formFields,
  setFieldValue,
  isSubmitted,
  externalErrors,
  onClearFieldError
}) => {
  // Helper function to get options based on field type
  const getOptions = (optionsKey) => {
    switch (optionsKey) {
      case "quotaOptions":
        return quotaOptions || [];
      case "admissionReferredByOptions":
        return admissionReferredByOptions || [];
      case "admissionTypeOptions":
        return admissionTypeOptions || [];
      case "genderOptions":
        return genderOptions || [];
      case "authorizedByOptions":
        return authorizedByOptions || [];
      default:
        return [];
    }
  };

  // Custom handler for name fields to filter numbers and capitalize
  const handleNameFieldChange = (e) => {
    const { name, value } = e.target;
    
    // Clear external error for this field when user starts typing
    if (onClearFieldError && externalErrors[name]) {
      onClearFieldError(name);
    }
    
    // Filter out numbers and special characters, only allow letters and spaces
    const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
    const capitalizedValue = capitalizeWords(filteredValue);
    
    // Use Formik's setFieldValue to update the field
    if (setFieldValue) {
      setFieldValue(name, capitalizedValue);
    } else {
      // Fallback to regular handleChange with filtered value
      handleChange({
        ...e,
        target: {
          ...e.target,
          value: capitalizedValue
        }
      });
    }
  };

  return (
    <div className={styles.basic_info_up_section}>
      <div className={styles.basic_info_form_row}>
        {formFields.slice(0, 2).map((field) => (
          <div key={field.id} className={styles.basic_info_form_field}>
            <Field name={field.name}>
              {({ field: fieldProps, meta }) => {
                const options = getOptions(field.options);
                const stringOptions = options.map(option => option.label || option.value);
                
                return field.type === "dropdown" ? (
                  <Dropdown
                    dropdownname={field.label}
                    id={field.id}
                    name={field.name}
                    value={(() => {
                      if (field.name === 'admissionType' && values[field.name]) {
                        // For admission type, display the label instead of the stored value (ID)
                        const selectedOption = options.find(option => option.value === values[field.name]);
                        return selectedOption ? selectedOption.label : values[field.name];
                      }
                      return values[field.name] || "";
                    })()}
                    onChange={(e) => {
                      // Clear external error for this field when user selects an option
                      if (onClearFieldError && externalErrors[field.name]) {
                        onClearFieldError(field.name);
                      }
                      
                      // For admission type, we need to find the corresponding value (ID) for the selected label
                      if (field.name === 'admissionType') {
                        const selectedOption = options.find(option => option.label === e.target.value);
                        const actualValue = selectedOption ? selectedOption.value : e.target.value;
                        
                        // Create a new event with the actual value (ID) instead of the label
                        const modifiedEvent = {
                          ...e,
                          target: {
                            ...e.target,
                            value: actualValue
                          }
                        };
                        handleChange(modifiedEvent);
                        
                        // Also update Formik's field value directly to ensure it's properly tracked
                        if (setFieldValue) {
                          setFieldValue(field.name, actualValue);
                        }
                      } else {
                        handleChange(e);
                      }
                    }}
                    results={stringOptions}
                    required={field.required}
                    disabled={false}
                    dropdownsearch={true}
                  />
                ) : (
                  <Inputbox
                    label={field.label}
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={handleNameFieldChange}
                    onBlur={handleBlur}
                    type={field.type}
                    error={meta.touched && meta.error}
                    required={field.required}
                  />
                );
              }}
            </Field>
            <FormError
              name={field.name}
              touched={touched}
              errors={errors}
              className={styles.basic_info_error}
              showOnChange={false}
              isSubmitted={isSubmitted}
              externalErrors={externalErrors}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicInfo;
