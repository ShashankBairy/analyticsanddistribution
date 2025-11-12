import React, { useState, useRef, useEffect } from "react";
import styles from "./RangeInputBox.module.css";
import updownicon from "../../assets/application-distribution/updownicon";

const RangeInputBox = ({ field, form, label }) => {
  const [rangeClicked, setRangeClicked] = useState(false);
  const rangeInputRef = useRef(null);
  const rangeOptionsRef = useRef(null);

  // Range options array
  const rangeOptions = [
    { label: "1000", value: "1000" },
    { label: "2000", value: "2000" },
    { label: "3000", value: "3000" },
    { label: "4000", value: "4000" },
    { label: "5000", value: "5000" },
  ];

  const handleRangeClicked = () => {
    setRangeClicked((prev) => !prev);
  };

  const handleOptionClick = (value) => {
    // Update form state + mark touched so validation can run if needed
    form.setFieldValue(field.name, value);
    // form.setFieldTouched(field.name, true);
    setRangeClicked(false); // Close dropdown after selection
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers (including empty string for backspace/delete)
    if (value === "" || /^[0-9]+$/.test(value)) {
      form.setFieldValue(field.name, value);
      // form.setFieldTouched(field.name, true);
    }
  };

  const handleBlur = () => {
    // Mark as touched only on blur (when user leaves the field)
    form.setFieldTouched(field.name, true);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        rangeInputRef.current &&
        !rangeInputRef.current.contains(event.target) &&
        rangeOptionsRef.current &&
        !rangeOptionsRef.current.contains(event.target)
      ) {
        setRangeClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.range_box_wrapper}>
      <label className={styles.label_name} htmlFor={field.name}>
        {label}
      </label>

      <div className={styles.range_input_box} ref={rangeInputRef}>
        <input
          type="text"
          id={field.name}
          name={field.name}
          value={field.value || ""}
          onChange={handleInputChange}
          onClick={handleRangeClicked}
          onBlur={handleBlur}
          className={styles.range_input}
          placeholder="Enter Range"
          autoComplete="off"
        />
        <button
          type="button"
          className={styles.range_input_icon_btn}
          onClick={handleRangeClicked}
          aria-label="Toggle range options"
        >
          {/* <span className={styles.range_input_icon}>{updownicon}</span> */}
        </button>
      </div>

      {rangeClicked && (
        <ul
          className={styles.range_options}
          ref={rangeOptionsRef}
          role="listbox"
        >
          {rangeOptions.map((option) => (
            <li key={option.value} className={styles.range_option}>
              <button
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={styles.range_option_link}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RangeInputBox;
