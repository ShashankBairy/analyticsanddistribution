import React, { useState, useRef } from "react";
import styles from "./PasswordInputBox.module.css";

import eyeopen from "../../assets/login-assets/eyeopen";
import eyeclosed from "../../assets/login-assets/eyeclosed";

const PasswordInputBox = ({
  placeholder,
  isInputBoxTouched, // (unused here, but keep if you pass it)
  onChange,
  onBlur,
  error,   // boolean from Formik meta (touched && !!error)
  success, // boolean from Formik meta (touched && !error && hasValue)
  value,
  name,
}) => {
  const [isEyeIconClicked, setIsEyeIconClicked] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setIsEyeIconClicked((p) => !p);
    setInputType((t) => (t === "password" ? "text" : "password"));
    inputRef.current?.focus();
  };

  const hasValue =
    value !== undefined && value !== null && String(value).length > 0;

  // Hide placeholder whenever legend is visible (computed below)
  // const showLegend = ... (moved below)
  const effectivePlaceholder = (focused || hasValue) ? "" : placeholder;

  // Suppress error/success while the user is editing and there is some input
  const suppressWhileEditing = focused && hasValue;
  const isErrorEffective = !!error && !suppressWhileEditing;
  const isSuccessEffective = !!success && !suppressWhileEditing;

  // ✅ Legend only shows when NOT in error/success mode and (focused || hasValue)
  const showLegend = (focused || hasValue) && !(isErrorEffective || isSuccessEffective);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const eyeIcon = isEyeIconClicked ? eyeopen : eyeclosed;

  return (
    <div className={styles.passwordInputBoxWrapper}>
      {/* Floating label only when allowed by the rule above */}
      {showLegend && (
        <legend className={styles.passwordLabel}>{placeholder}</legend>
      )}

      <div className={styles.passwordInputIcon}>
        <input
          ref={inputRef}
          placeholder={showLegend ? "" : placeholder}
          id={name}
          name={name}
          type={inputType}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`${styles.passwordInput} ${
            isErrorEffective ? styles.error : isSuccessEffective ? styles.success : ""
          }`}
          value={value}
          autoComplete="current-password"
          aria-invalid={isErrorEffective ? "true" : "false"}
        />

        {/* Eye icon to toggle password visibility (unchanged) */}
        <div className={styles.passwordEyeIcon} onClick={togglePasswordVisibility}>
          {eyeIcon}
        </div>
      </div>
    </div>
  );
};

export default PasswordInputBox;
