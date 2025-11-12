import React, { useRef, useState } from "react";
import styles from "./FormInputBox.module.css";

/** Use with <Field component={InputBox} ... /> */
const InputBox = ({
  field,        // { name, value, onChange, onBlur }
  form,         // { setFieldTouched, errors, touched }
  label,        // legend text (we're using placeholder text in legend below)
  placeholder,
  type = "text",
  disabled = false,
  id,
}) => {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const hasValue =
    field?.value !== undefined &&
    field?.value !== null &&
    String(field.value).length > 0;

  // Formik states
  const metaError = form?.errors?.[field.name];
  const metaTouched = form?.touched?.[field.name];

  const isErrorState = Boolean(metaError && metaTouched);
  const isSuccessState = Boolean(metaTouched && !metaError && hasValue);

  // While the user is editing (focused) and has typed something,
  // visually suppress error/success to show "normal" mode.
  const suppressWhileEditing = focused && hasValue;

  const isErrorEffective = isErrorState && !suppressWhileEditing;
  const isSuccessEffective = isSuccessState && !suppressWhileEditing;

  // Legend shows only if NOT error/success (effective), and input is focused or has value
  const showLegend = !isErrorEffective && !isSuccessEffective && (focused || hasValue);

  // Hide placeholder whenever legend is visible
  const effectivePlaceholder = showLegend ? "" : placeholder;

  const handleWrapperClick = () => {
    inputRef.current?.focus();
    form?.setFieldTouched?.(field.name, true, false);
  };

  const handleFocus = () => {
    setFocused(true);
    form?.setFieldTouched?.(field.name, true, false);
  };

  const handleBlur = (e) => {
    setFocused(false);
    field.onBlur(e);
  };

  return (
    <fieldset
      className={[
        styles.inputbox_wrapper,
        focused ? styles.focused : "", // no error/success on fieldset
      ].join(" ")}
      onClick={handleWrapperClick}
      aria-invalid={isErrorEffective ? "true" : "false"}
    >
      {showLegend && (
        <legend className={[styles.legend, styles.legendVisible].join(" ")}>
          {placeholder /* using placeholder as legend text */}
        </legend>
      )}

      <input
        {...field}
        id={id || field.name}
        ref={inputRef}
        type={type}
        placeholder={effectivePlaceholder}
        disabled={disabled}
        className={[
          styles.inputBox,
          isErrorEffective ? styles.error : "",
          isSuccessEffective ? styles.success : "",
        ].join(" ")}  // error/success applied to INPUT only
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </fieldset>
  );
};

export default InputBox;
