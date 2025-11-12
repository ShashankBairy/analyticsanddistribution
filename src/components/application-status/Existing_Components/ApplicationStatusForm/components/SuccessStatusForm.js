import React from 'react';
import SuccessPage from '../../ConformationPage/SuccessPage';

const SuccessStatusForm = ({
  applicationNo,
  studentName,
  amount,
  campus,
  zone,
  onBack,
  statusType
}) => {
  return (
    <SuccessPage
      applicationNo={applicationNo}
      studentName={studentName}
      amount={amount}
      campus={campus}
      zone={zone}
      onBack={onBack}
      statusType={statusType}
    />
  );
};

export default SuccessStatusForm;
