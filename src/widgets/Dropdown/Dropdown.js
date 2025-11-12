import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "./Dropdown.module.css";
import downarrow from "../../assets/application-distribution/downarrow";
import SearchBox from "../Searchbox/Searchbox";
import Asterisk from "../../assets/application-status/Asterisk";

const dropdownsearchicon = (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5677 14.6599L12.336 11.4134C13.0024 10.5599 13.4033 9.48326 13.4033 8.31873C13.4033 5.5151 11.1223 3.23413 8.31875 3.23413C5.51522 3.23413 3.23425 5.5151 3.23425 8.31863C3.23425 11.1173 5.51522 13.3981 8.31875 13.3981C9.43346 13.3981 10.4604 13.0365 11.298 12.4244L14.5441 15.6754C14.6796 15.8162 14.8675 15.8851 15.0584 15.8851C15.482 15.8851 15.7658 15.5613 15.7658 15.1628C15.7658 14.9659 15.6964 14.7939 15.5677 14.6599ZM4.26625 8.31863C4.26625 6.08371 6.08373 4.26613 8.31875 4.26613C10.5537 4.26613 12.3663 6.08361 12.3663 8.31863C12.3663 10.5487 10.5537 12.3661 8.31875 12.3661C6.08373 12.3661 4.26625 10.5487 4.26625 8.31863Z"
      fill="#A1A5B0" stroke="#A1A5B0" strokeWidth="0.101865" />
  </svg>
);

const capitalizeFirst = (s = "") =>
  s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const extractValue = (arg) => {
  if (typeof arg === "string") return arg;
  if (arg && typeof arg === "object") {
    if (arg.target && typeof arg.target.value === "string") return arg.target.value;
    if (arg.currentTarget && typeof arg.currentTarget.value === "string") return arg.currentTarget.value;
    if (typeof arg.value === "string") return arg.value;
  }
  return "";
};

const Dropdown = ({
  dropdownname,
  results,
  dropdownsearch = true,
  onChange,
  value,
  name,
  disabled = false,
  minChars = 3,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const normalized = useMemo(
    () =>
      (Array.isArray(results) ? results : [])
        .filter((r) => r != null)
        .map((r) => String(r)),
    [results]
  );

  const hasSearchBox = dropdownsearch && normalized.length > 5;
  const term = searchTerm.trim();
  const useFilter = hasSearchBox && term.length >= minChars;

  const listToShow = useMemo(() => {
    if (useFilter) {
      const lc = term.toLowerCase();
      return normalized.filter((item) => item.toLowerCase().includes(lc));
    }
    return normalized;
  }, [normalized, useFilter, term]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setSearchTerm("");
      return next;
    });
  };

  const handleSearchChange = (arg) => {
    const raw = extractValue(arg);
    setSearchTerm(capitalizeFirst(raw));
  };

  const handleOptionClick = (e, option) => {
    e.preventDefault();
    onChange?.({ target: { name, value: option } });
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown_wrapper} ref={dropdownRef}>
      <label htmlFor={name} className={styles.dropdown_label}>
        {dropdownname}
        {required && <Asterisk style={{ marginLeft: "4px" }} />}
      </label>

      <button
        className={`${styles.dropdown_button} ${isOpen ? styles.dropdown_button_open : ''}`}
        onClick={handleToggle}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value || `Select ${dropdownname}`}
        <span className={styles.dropdown_arrow}>{downarrow}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown_panel} role="dialog" aria-label={dropdownname}>
          {hasSearchBox && (
            <div className={styles.dropdown_search_box}>
              <SearchBox
                searchicon={dropdownsearchicon}
                placeholder={`Search ${dropdownname}`}
                width="100%"
                value={searchTerm}
                onChange={handleSearchChange}
                onInput={handleSearchChange}
                onValueChange={handleSearchChange}
                onSearch={handleSearchChange}
              />
            </div>
          )}

          <ul className={styles.dropdown_list} role="listbox" aria-label={dropdownname}>
            {listToShow.length > 0 ? (
              listToShow.map((result, idx) => (
                <li
                  className={`${styles.dropdown_result_list} ${idx === listToShow.length - 1 ? styles.last_item : ""}`}
                  key={`${result}-${idx}`}
                >
                  <a
                    href="#"
                    className={styles.dropdown_option}
                    onClick={(e) => handleOptionClick(e, result)}
                    role="option"
                    aria-selected={result === value}
                  >
                    {result}
                  </a>
                </li>
              ))
            ) : (
              <li>
                <span className={styles.dropdown_no_results}>No results found</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;



