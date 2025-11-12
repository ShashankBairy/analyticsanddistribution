import React from "react";
import ApplicationSearchHeaderIcon from "../../../../assets/application-analytics/ApplicationSearchHeaderIcon";
import styles from "./ApplicationSearchHeader.module.css";
import blueLine from "../../../../assets/application-analytics/blue_arrow_line.png"

const ApplicationSearchHeader = () => {
  return (
    <div id="search_header_wrapper" className={styles.search_header_wrapper}>
      <div id="search_header_icon_wrrapper">
        <ApplicationSearchHeaderIcon height="54" width="54"/>
      </div>
      <div className={styles.application_header_text}>
        <h2 className={styles.application_search_header}> Application Module</h2>
        <p className={styles.application_sub_text}>
          Access and manage comprehensive student details seamlessly. View
          personalized profiles tailored to your campus.
        </p>
      </div>
      <figure>
        <img src={blueLine}/>
      </figure>
    </div>
  );
};

export default ApplicationSearchHeader;
