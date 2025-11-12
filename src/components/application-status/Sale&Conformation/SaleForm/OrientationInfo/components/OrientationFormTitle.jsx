import React from 'react';
import styles from './OrientationFormTitle.module.css';

const OrientationFormTitle = () => {
  return (
    <div className={styles.orientation_info_section_title}>
      <span className={styles.orientation_info_title_text}>
        Orientation Information
      </span>
      <div className={styles.orientation_info_title_line}></div>
    </div>
  );
};

export default OrientationFormTitle;
