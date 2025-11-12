import React from 'react';
import styles from './PaymentModeSelector.module.css';

const PaymentModeSelector = ({ selectedPaymentMode, onPaymentModeSelect, paymentModes }) => {
  return (
    <div className={styles.payment_form_up}>
      <div className={styles.payment_form_header}>
        <h3 className={styles.section_title}>Select Payment Mode</h3>
      </div>

      <div className={styles.payment_modes_container}>
        {paymentModes.map((mode) => (
          <button
            key={mode.value}
            className={`${styles.payment_mode_button} ${
              selectedPaymentMode === mode.value ? styles.payment_mode_button_active : ''
            }`}
            onClick={() => onPaymentModeSelect(mode.value)}
            type="button"
          >
            <img src={mode.icon} alt={mode.label} className={styles.payment_mode_icon} />
            <span className={styles.payment_mode_text}>{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentModeSelector;
