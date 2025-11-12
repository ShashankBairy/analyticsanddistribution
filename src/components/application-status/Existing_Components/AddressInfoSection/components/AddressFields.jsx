import React from 'react';
import Inputbox from "../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../widgets/Dropdown/Dropdown";
import SearchBox from "../../../../../widgets/Searchbox/Searchbox";
import { ReactComponent as SearchIcon } from "../../../../../assets/application-status/Group.svg";
import Asterisk from "../../../../../assets/application-status/Asterisk";
import styles from "../AddressInfoSection.module.css";

/**
 * AddressFields component for rendering address form fields
 * Extracted from AddressInfoSection.js lines 280-437
 * Preserves every single line and functionality exactly as manager wants
 */
const AddressFields = ({
  values,
  errors,
  touched,
  handleSectionChange,
  setFieldValue,
  dropdownOptions,
  flatfields,
  groupedFields
}) => {
  return (
    <div className={styles.Address_Info_Section_address_form_grid}>
      {groupedFields.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.Address_Info_Section_address_form_row}>
          {row.map((field, index) => (
            <div key={index} className={styles.Address_Info_Section_address_form_field}>
              {field.type === "select" ? (
                <Dropdown
                  dropdownname={field.label}
                  name={field.name}
                  results={field.options.length > 0 ? field.options.map((opt) => {
                    if (typeof opt === 'string') return opt;
                    if (typeof opt === 'object' && opt !== null) {
                      return opt.label || opt.name || opt.value || opt.text || String(opt);
                    }
                    return String(opt);
                  }) : ["No record found"]}
                  value={
                    field.options.find((opt) => opt.value === values[field.name])?.label || ""
                  }
                  onChange={(e) => {
                    const selected = field.options.find((opt) => opt.label === e.target.value);
                    setFieldValue(field.name, selected ? selected.value : "");
                    console.log(`Selected ${field.name}:`, selected ? selected.value : "None");
                  }}
                  error={touched[field.name] && errors[field.name]}
                  required={field.required}
                  loading={
                    (field.name === "stateId" && dropdownOptions.states.length === 0) ||
                    (field.name === "district" && values.stateId && dropdownOptions.districts.length === 0) ||
                    (field.name === "addressCity" && values.district && dropdownOptions.cities.length === 0) ||
                    (field.name === "mandal" && values.district && dropdownOptions.mandals.length === 0)
                  }
                />
              ) : field.name === "gpin" ? (
                <div>
                  <label className={styles.Address_Info_Section_searchbox_label}>
                    {field.label}
                    {field.required && <Asterisk style={{ marginLeft: "4px" }} />}
                  </label>
                  <SearchBox
                    searchicon={<SearchIcon />}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={handleSectionChange}
                    onValueChange={(value) => setFieldValue(field.name, value)}
                    error={touched[field.name] && errors[field.name]}
                  />
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
                  error={touched[field.name] && errors[field.name]}
                  required={field.required}
                />
              )}
              {touched[field.name] && errors[field.name] && (
                <div className={styles.Address_Info_Section_address_error}>{errors[field.name]}</div>
              )}
            </div>
          ))}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, padIndex) => (
              <div key={`pad-${rowIndex}-${padIndex}`} className={styles.Address_Info_Section_address_empty_field}></div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default AddressFields;
