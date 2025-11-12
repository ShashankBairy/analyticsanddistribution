import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { paymentModes, initialValues } from './constants/paymentConstants';
import { getPaymentFields } from './constants/paymentFieldConfigs';
import { usePaymentSubmission } from './hooks/usePaymentSubmission';
import PaymentModeSelector from './components/PaymentModeSelector';
import CreditCardOptions from './components/CreditCardOptions';
import PaymentFormFields from './components/PaymentFormFields';
import PaymentFormActions from './components/PaymentFormActions';
import styles from './PaymentForm.module.css';

const PaymentForm = ({ onClose, onPaymentSuccess, isConfirmationMode = false, onSubmitCompleteSale, onSubmitConfirmation, preFilledAmount }) => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("Cash");
  const { isSubmitting, error, handleSubmit } = usePaymentSubmission();
  const formikRef = useRef(null);

  const onSubmit = async (values) => {
    console.log('PaymentForm onSubmit called with values:', values);
    console.log('Selected payment mode:', selectedPaymentMode);
   
    const result = await handleSubmit(values, selectedPaymentMode, onClose);
   
    console.log('PaymentForm handleSubmit result:', result);
   
      // Pass payment data to parent orchestration
      if (result && result.success && onPaymentSuccess) {
        const modeToId = {
          'Cash': 1,
          'DD': 2,
          'Cheque': 3,
          'Credit/Debit Card': 4
        };
        const modeId = modeToId[selectedPaymentMode] || 1;
        const paymentData = {
          ...values,
          paymentMode: selectedPaymentMode,
          paymentModeId: modeId,
          payMode: modeId,
          appFeePayMode: modeId
        };
        console.log('PaymentForm calling onPaymentSuccess with:', paymentData);
        const updatedFormData = onPaymentSuccess(paymentData);
       
        // After adding payment data, submit based on mode
        if (isConfirmationMode && onSubmitConfirmation) {
          console.log('🎯 PaymentForm calling onSubmitConfirmation to submit confirmation data');
          console.log('🎯 isConfirmationMode:', isConfirmationMode);
          console.log('🎯 onSubmitConfirmation function:', typeof onSubmitConfirmation);
         
          // Submit confirmation data
          const submitResult = await onSubmitConfirmation();
          console.log('🎯 onSubmitConfirmation result:', submitResult);
         
          // Always close modal and show success page for Finish Sale & Confirmation
          console.log('✅ Finish Sale & Confirmation completed - closing modal and showing success page');
          onClose(true); // Close modal, parent will show success page
        } else if (!isConfirmationMode && onSubmitCompleteSale) {
          console.log('PaymentForm calling onSubmitCompleteSale to show backend data');
         
          // Pass the updated form data directly to avoid state timing issues
          const submitResult = await onSubmitCompleteSale(updatedFormData);
         
          // Only close modal and show success if database submission was successful
          if (submitResult && submitResult.success) {
            console.log('✅ Database submission successful - closing modal and showing success page');
            onClose(true); // Close modal with success flag
          } else {
            console.log('❌ Database submission failed - keeping modal open');
            // Modal stays open, error will be shown
          }
        }
      }
  };

  // Map payment modes to their corresponding amount field names
  const getAmountFieldName = (paymentMode) => {
    const fieldMap = {
      'Cash': 'amount',
      'DD': 'mainDdAmount',
      'Cheque': 'mainChequeAmount',
      'Credit/Debit Card': 'cardAmount'
    };
    return fieldMap[paymentMode] || 'amount';
  };

  // Sync amount field when payment mode changes or preFilledAmount updates
  // Auto-populate in both sale mode and confirmation mode when preFilledAmount is provided
  useEffect(() => {
    // Auto-populate if preFilledAmount is provided (not undefined/null) in both modes
    if (preFilledAmount != null && preFilledAmount !== undefined && formikRef.current) {
      console.log('💰 PaymentForm: preFilledAmount changed, syncing amount fields:', preFilledAmount, 'isConfirmationMode:', isConfirmationMode);
      const amountFieldName = getAmountFieldName(selectedPaymentMode);
      const currentValues = formikRef.current.values;
      const currentAmount = currentValues[amountFieldName];
     
      console.log('💰 PaymentForm: Current amount values:', {
        'amountFieldName': amountFieldName,
        'currentAmount': currentAmount,
        'preFilledAmount': preFilledAmount,
        'selectedPaymentMode': selectedPaymentMode,
        'isConfirmationMode': isConfirmationMode
      });
     
      // If the current amount field is empty or zero, populate it with preFilledAmount
      // Also update if preFilledAmount is different from current (for dynamic updates from backend)
      const preFilledStr = String(preFilledAmount);
      if (!currentAmount || currentAmount === '' || currentAmount === '0' ||
          (preFilledAmount > 0 && currentAmount !== preFilledStr)) {
        console.log('💰 PaymentForm: Updating amount field:', amountFieldName, 'to', preFilledStr);
        formikRef.current.setFieldValue(amountFieldName, preFilledStr);
        // Also update all other payment mode amount fields
        formikRef.current.setFieldValue('amount', preFilledStr);
        formikRef.current.setFieldValue('mainDdAmount', preFilledStr);
        formikRef.current.setFieldValue('mainChequeAmount', preFilledStr);
        formikRef.current.setFieldValue('cardAmount', preFilledStr);
      }
    } else if (preFilledAmount === undefined || preFilledAmount === null) {
      console.log('💰 PaymentForm: preFilledAmount is not available, amount field will be empty');
    }
  }, [selectedPaymentMode, preFilledAmount, isConfirmationMode]);

  const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode);
  };

  return (
    <div className={styles.payment_form_container}>
      <PaymentModeSelector
        selectedPaymentMode={selectedPaymentMode}
        onPaymentModeSelect={handlePaymentModeSelect}
        paymentModes={paymentModes}
      />

      <div className={styles.payment_form_down}>
        <Formik
          innerRef={formikRef}
          key={isConfirmationMode ? `payment-form-confirmation-${preFilledAmount}` : (preFilledAmount != null ? `payment-form-${preFilledAmount}` : 'payment-form-default')}
          initialValues={{
            ...initialValues,
            // Auto-populate amount in both sale mode and confirmation mode when preFilledAmount is available
            amount: (preFilledAmount != null && preFilledAmount !== 0) ? String(preFilledAmount) : initialValues.amount,
            mainDdAmount: (preFilledAmount != null && preFilledAmount !== 0) ? String(preFilledAmount) : initialValues.mainDdAmount,
            mainChequeAmount: (preFilledAmount != null && preFilledAmount !== 0) ? String(preFilledAmount) : initialValues.mainChequeAmount,
            cardAmount: (preFilledAmount != null && preFilledAmount !== 0) ? String(preFilledAmount) : initialValues.cardAmount
          }}
          enableReinitialize={true}
          onSubmit={onSubmit}
        >
          {({ values, handleChange, handleBlur, setFieldValue }) => (
            <Form className={styles.payment_form}>
              {/* Global Error Display */}
              {error && (
                <div className={styles.global_error}>
                  {error}
                </div>
              )}

              <div>
                {/* PRO Credit Card and Application Special Concession - only visible when Credit/Debit Card is selected */}
              {selectedPaymentMode === "Credit/Debit Card" && (
                <CreditCardOptions
                  values={values}
                  handleChange={handleChange}
                />
              )}

              <PaymentFormFields
                formFields={getPaymentFields(selectedPaymentMode)}
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
              />
              </div>

              <PaymentFormActions
                onSubmit={onSubmit}
                values={values}
                isSubmitting={isSubmitting}
                buttonText={isConfirmationMode ? "Finish Sale & Confirmation" : "Finish Sale"}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PaymentForm;

