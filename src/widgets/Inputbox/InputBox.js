import React from "react";
import styles from "./InputBox.module.css";
import Asterisk from "../../assets/application-status/Asterisk";

const Inputbox = ({ label, id, name, placeholder, onChange, value, type = "text", disabled = false, required = false, readOnly = false }) => {
  return (
    <div className={styles.inputbox_wrapper}>
      <label htmlFor={name} className={styles.label_container}>
        {label}
        {required && <Asterisk style={{ marginLeft: "4px" }} />}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input_box}
        disabled={disabled}
        readOnly={readOnly}
      />
    </div>
  );
};

export default Inputbox;
