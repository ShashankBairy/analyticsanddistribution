  import React from "react";
  import searchIcon from "../../assets/application-analytics/searchicon.svg";
  import styles from "./SearchComponent.module.css";

  const SearchComponent = () => {
    return (
      <div className={styles.search_component}>
        <div className={styles.tophead_searchflex}>
          <figure>
            <img
              src={searchIcon}
              alt="search icon"
              className={styles.search_icon}
            />
          </figure>
          <input
            type="text"
            className={styles.sc_top_header_input}
            placeholder="Ask for anything"
          />
        </div>
      </div>
    );
  };

  export default SearchComponent;
