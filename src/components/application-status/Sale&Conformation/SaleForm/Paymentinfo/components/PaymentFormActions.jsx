import React from 'react';
import Button from '../../../../../../widgets/Button/Button';
import { ReactComponent as TrendingUpIcon } from '../../../../../../assets/application-status/Trending up.svg';
import styles from './PaymentFormActions.module.css';

const PaymentFormActions = ({ onSubmit, values, isSubmitting, buttonText = "Finish Sale" }) => {
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className={styles.form_actions}>
      <Button
        buttonname={buttonText}
        righticon={<TrendingUpIcon />}
        onClick={handleClick}
        variant="primary"
        width="auto"
        type="button"
        disabled={isSubmitting}
      />
    </div>
  );
};

export default PaymentFormActions;
