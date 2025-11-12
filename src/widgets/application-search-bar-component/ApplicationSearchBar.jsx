import React from "react";
import styles from "../application-search-bar-component/ApplicationSearchBar.module.css";

const ApplicationSearchBar = ({ placeholderText, customClass, onClick, onChange, value }) => {
  const handleInputClick = (e) => {
    // Allow typing but also trigger the dropdown
    onClick?.();
  };

  return (
    <div className={`${styles.search_bar} ${customClass}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
        <path
          d="M7.79167 14.3636C10.9213 14.3636 13.4583 11.8266 13.4583 8.69694C13.4583 5.56733 10.9213 3.03027 7.79167 3.03027C4.66205 3.03027 2.125 5.56733 2.125 8.69694C2.125 11.8266 4.66205 14.3636 7.79167 14.3636Z"
          stroke="#0A0A0A"
          strokeWidth="1.41667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.8748 15.7803L11.829 12.7345"
          stroke="#0A0A0A"
          strokeWidth="1.41667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        placeholder={placeholderText}
        className={`${styles.search_application_input}`}
        onChange={onChange}
        value={value}
        onFocus={handleInputClick} // Open dropdown when input is focused
      />
    </div>
  );
};

export default ApplicationSearchBar;
