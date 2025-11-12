// src/widgets/Searchbox/Searchbox.jsx
import React, { useState, useMemo } from "react";
import styles from "./Searchbox.module.css";

const SearchBox = ({
  searchicon,
  placeholder,
  type,
  width,
  // NEW props to support controlled usage:
  value, // optional controlled value
  onChange, // event handler (e) => ...
  onInput, // optional alias
  onValueChange, // optional: gets just the string
  inputRef, // optional: forward a ref from parent (for focus)
}) => {
  // If no `value` prop is provided, fall back to internal state.
  const [internal, setInternal] = useState("");

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internal;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value); // keep internal in sync

    // bubble up in multiple common shapes so parents can choose what they like
    onChange?.(e); // standard React onChange(event)
    onInput?.(e); // optional alias
    onValueChange?.(e.target.value); // just the raw string
  };

  const wrapperStyle = useMemo(() => (width ? { width } : undefined), [width]);

  return (
    <div className={styles.searchbox} style={wrapperStyle}>
      <div className={styles.searchicon}>{searchicon}</div>
      <input
        ref={inputRef}
        className={`${styles.input} ${
          type === "round" ? styles.round : styles.rectangle
        }`}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;
