import React from "react";
import { useApplicationDetails } from "../hooks/useApplicationDetails";

/**
 * Component to handle fetching application details
 * This component doesn't render anything but handles the side effects
 */
const ApplicationDetailsFetcher = ({
  applicationNo,
  isOptionsLoaded,
  dropdownOptions,
  setZoneId,
  setSelectedCampusId,
  setSelectedStatusId,
  setPendingDgmName,
}) => {
  useApplicationDetails({
    applicationNo,
    isOptionsLoaded,
    dropdownOptions,
    setZoneId,
    setSelectedCampusId,
    setSelectedStatusId,
    setPendingDgmName,
  });

  return null;
};

export default ApplicationDetailsFetcher;
