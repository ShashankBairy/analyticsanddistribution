import React from 'react';
import styles from './AddressFormTitle.module.css';

const AddressFormTitle = () => {
  return (
    <div className={styles.address_info_section_title}>
      <span className={styles.address_info_title_text}>
        Address Information
      </span>
      <div className={styles.address_info_title_line}></div>
    </div>
  );
};

export default AddressFormTitle;
