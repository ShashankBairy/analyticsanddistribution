import React from 'react';
import ConfirmationHeader from '../../Conformation/ConformationHeader';

const ConfirmationStatusForm = ({
  onSuccess,
  applicationData,
  onStepChange,
  saleData
}) => {
  return (
    <div>
      {console.log("🔍 Rendering ConfirmationHeader with applicationData:", applicationData)}
      <ConfirmationHeader
        onSuccess={onSuccess}
        applicationData={applicationData}
        onStepChange={onStepChange}
        saleData={saleData}
      />
    </div>
  );
};

export default ConfirmationStatusForm;
