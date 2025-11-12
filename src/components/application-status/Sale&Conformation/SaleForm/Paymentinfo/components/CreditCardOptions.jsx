import React from 'react';
import styles from './CreditCardOptions.module.css';

const CreditCardOptions = ({ values, handleChange }) => {
  return (
    <div className={styles.credit_card_options}>
      <div className={styles.pro_credit_card_section}>
        <label className={styles.pro_credit_card_label}>
          <input
            type="checkbox"
            name="proCreditCard"
            checked={values.proCreditCard || false}
            onChange={handleChange}
            className={styles.pro_credit_card_checkbox}
          />
          <span className={styles.pro_credit_card_text}>PRO Credit Card</span>
        </label>
      </div>
      
      <div className={styles.concession_section}>
        <div className={styles.concession_value}>0</div>
        <div className={styles.concession_label}>Application Special Concession Value</div>
      </div>
    </div>
  );
};

export default CreditCardOptions;
