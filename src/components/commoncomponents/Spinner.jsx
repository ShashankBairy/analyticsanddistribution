import React from 'react';
import styles from './Spinner.module.css';

/**
 * A simple circular loading spinner component.
 * @param {string} [size='medium'] - Controls the size: 'small', 'medium', or 'large'.
 */
const Spinner = ({ size = 'medium' }) => {
  // Use a class based on the size prop for different styles
  const sizeClass = styles[`spinner-${size}`] || styles['spinner-medium'];

  return (
  <div className={styles.spinnerWrapper}>
    <div className={styles['spinner-container']}>
      <div className={`${styles['circular-loader']} ${sizeClass}`}></div>
    </div> 
  </div>
  );
};

export default Spinner;