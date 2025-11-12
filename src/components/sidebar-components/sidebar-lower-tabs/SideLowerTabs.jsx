import React from "react";
import styles from "./SideLowerTabs.module.css";

import helpLineIcon from "../../../assets/sidebaricons/helpline_icon.svg";
import verticalLine from "../../../assets/sidebaricons/vertical_line.svg";
import documentationIcon from "../../../assets/sidebaricons/documentation_icon.svg";
import bookOutlineicon from "../../../assets/sidebaricons/bookoutline_icon.svg";

const SideLowerTabs = () => {
  return (
    <div className={styles.lower_tabs}>
      <figure>
        <img src={bookOutlineicon}/>
      </figure>

      <figure>
        <img src={verticalLine}/>
      </figure>

      <figure>
        <img src={documentationIcon}/>
      </figure>

      <figure>
        <img src={verticalLine}/>
      </figure>

      <figure>
        <img src={helpLineIcon}/>
      </figure>
    </div>
  );
};

export default SideLowerTabs;
