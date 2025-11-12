import React, { useState, useEffect, useRef } from "react";
import profileimg from "../../assets/application-analytics/profile_img.png";
import styles from "./UserInfoComponent.module.css";

import {formatName} from "../../utils/formatName"
const UserInfoComponent = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const employeeName = localStorage.getItem("empName");
  const designation = localStorage.getItem("designation");

  const formattedDesignation = formatName(designation);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () =>{
    localStorage.clear();
    window.location.href = "/login";
  }



  return (
    <div className={styles.user_info} ref={dropdownRef}>
      {/* Bell Icon */}
      <button className={styles.bell_icon} aria-label="Notifications">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="26"
          viewBox="0 0 25 26"
          fill="none"
        >
          <path
            d="M5 17.4791H9.63539H15.1979H19.8333L18.5308 16.1766C18.1775 15.8234 17.9791 15.3443 17.9791 14.8448V11.9166C17.9791 9.4947 16.4312 7.43428 14.2708 6.67068V6.35416C14.2708 5.33013 13.4406 4.5 12.4166 4.5C11.3926 4.5 10.5625 5.33013 10.5625 6.35416V6.67068C8.40202 7.43428 6.85416 9.4947 6.85416 11.9166V14.8448C6.85416 15.3443 6.65571 15.8234 6.30248 16.1766L5 17.4791Z"
            fill="white"
          />
          <path
            d="M15.1979 17.4791H19.8333L18.5308 16.1766C18.1775 15.8234 17.9791 15.3443 17.9791 14.8448V11.9166C17.9791 9.4947 16.4312 7.43428 14.2708 6.67068V6.35416C14.2708 5.33013 13.4406 4.5 12.4166 4.5C11.3926 4.5 10.5625 5.33013 10.5625 6.35416V6.67068C8.40202 7.43428 6.85416 9.4947 6.85416 11.9166V14.8448C6.85416 15.3443 6.65571 15.8234 6.30248 16.1766L5 17.4791H9.63539M15.1979 17.4791V18.4062C15.1979 19.9422 13.9527 21.1874 12.4166 21.1874C10.8806 21.1874 9.63539 19.9422 9.63539 18.4062V17.4791M15.1979 17.4791H9.63539"
            stroke="#3F3F46"
            strokeWidth="1.06799"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Profile Info */}
      <div className={styles.userinfo} onClick={toggleDropdown}>
        <img src={profileimg} alt="Profile" className={styles.profile_img} />
        <div className={styles.user_details}>
          <p className={styles.username}>{employeeName}</p>
          <p className={styles.role}>{formattedDesignation}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          className={`${styles.arrow} ${dropdownOpen ? styles.open : ""}`}
        >
          <path
            d="M5.5 7.5L10.5 12.5L15.5 7.5"
            stroke="#344054"
            strokeWidth="1.67"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className={styles.dropdown}>
          <button className={styles.dropdown_item}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19.1401 12.94C19.1801 12.64 19.2001 12.33 19.2001 12C19.2001 11.68 19.1801 11.36 19.1301 11.06L21.1601 9.48C21.3401 9.34 21.3901 9.07 21.2801 8.87L19.3601 5.55C19.2401 5.33 18.9901 5.26 18.7701 5.33L16.3801 6.29C15.8801 5.91 15.3501 5.59 14.7601 5.35L14.4001 2.81C14.3601 2.57 14.1601 2.4 13.9201 2.4H10.0801C9.84011 2.4 9.65011 2.57 9.61011 2.81L9.25011 5.35C8.66011 5.59 8.12011 5.92 7.63011 6.29L5.24011 5.33C5.02011 5.25 4.77011 5.33 4.65011 5.55L2.74011 8.87C2.62011 9.08 2.66011 9.34 2.86011 9.48L4.89011 11.06C4.84011 11.36 4.80011 11.69 4.80011 12C4.80011 12.31 4.82011 12.64 4.87011 12.94L2.84011 14.52C2.66011 14.66 2.61011 14.93 2.72011 15.13L4.64011 18.45C4.76011 18.67 5.01011 18.74 5.23011 18.67L7.62011 17.71C8.12011 18.09 8.65011 18.41 9.24011 18.65L9.60011 21.19C9.65011 21.43 9.84011 21.6 10.0801 21.6H13.9201C14.1601 21.6 14.3601 21.43 14.3901 21.19L14.7501 18.65C15.3401 18.41 15.8801 18.09 16.3701 17.71L18.7601 18.67C18.9801 18.75 19.2301 18.67 19.3501 18.45L21.2701 15.13C21.3901 14.91 21.3401 14.66 21.1501 14.52L19.1401 12.94ZM12.0001 15.6C10.0201 15.6 8.40011 13.98 8.40011 12C8.40011 10.02 10.0201 8.4 12.0001 8.4C13.9801 8.4 15.6001 10.02 15.6001 12C15.6001 13.98 13.9801 15.6 12.0001 15.6Z"
                fill="black"
                fill-opacity="0.56"
              />
            </svg>{" "}
            Settings
          </button>
          <button className={styles.dropdown_item}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="black"
                fill-opacity="0.56"
              />
            </svg>{" "}
            Profile
          </button>
          <button className={styles.dropdown_item} onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
                fill="black"
                fill-opacity="0.56"
              />
            </svg>{" "}
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfoComponent;
