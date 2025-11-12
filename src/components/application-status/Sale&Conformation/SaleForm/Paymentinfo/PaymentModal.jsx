import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import ProgressHeader from '../../../../../widgets/ProgressHeader/ProgressHeader';
import CloseIcon from '../../../../../assets/application-status/xicon.svg';
import styles from './PaymentModal.module.css';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, totalSteps = 2, isConfirmationMode = false, onSubmitCompleteSale, onSubmitConfirmation, preFilledAmount }) => {
  // For confirmation mode (3 steps), show all steps filled (currentStep = 2)
  // For sale mode (2 steps), show 2 steps filled (currentStep = 1)
  const [currentStep, setCurrentStep] = useState(isConfirmationMode ? 2 : 1);

  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <div className={styles.modal_wrapper}>
          <div className={styles.modal_header}>
            <div className={styles.modal_header_left}>
              <h2 className={styles.modal_title}>
                {isConfirmationMode ? 'Complete Application Sale & Confirmation' : 'Complete Application Sale'}
              </h2>
              <div className={styles.modal_progress}>
                <ProgressHeader 
                  step={currentStep} 
                  totalSteps={totalSteps} 
                />
              </div>
            </div>
            <div className={styles.modal_header_right}>
              <figure className={styles.close_buttons} onClick={() => onClose(false)}>
                <img src={CloseIcon} alt="Close" className={styles.close_icon} />
              </figure>
            </div>
          </div>

          <div className={styles.modal_content}>
          <PaymentForm 
              onClose={onClose} 
              onPaymentSuccess={onPaymentSuccess} 
              isConfirmationMode={isConfirmationMode}
              onSubmitCompleteSale={onSubmitCompleteSale}
            onSubmitConfirmation={onSubmitConfirmation}
            preFilledAmount={preFilledAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
