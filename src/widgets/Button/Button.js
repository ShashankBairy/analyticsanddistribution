import React from "react";
import styles from "./Button.module.css";

const Button = ({
  buttonname,
  righticon,
  lefticon,
  onClick,
  type="button",
  disabled,
  width,
  variant,
}) => {
  return (
    <div className={styles.button_wrapper}>
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={`${styles.button} ${disabled ? styles.disabled : ""} ${
          variant ? styles[variant] : ""
        }`}
        style={{
          margin: width ? "0" : "0 auto", // Center the button only if width is not provided
          width: width || "auto", // Use the provided width or auto if not provided
        }}
      >
        {lefticon && <span className={styles.lefticon}>{lefticon}</span>}
        {buttonname}
        {righticon && <span className={styles.righticon}>{righticon}</span>}
        
      </button>
    </div>
  );
};

export default Button;
