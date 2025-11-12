// Map backend status to frontend display status
export const reverseStatusMap = {
  damaged: "DAMAGED",
  withpro: "AVAILABLE",
  "not confirmed": "UNSOLD",
  confirmed: "CONFIRMED",
  "with pro": "AVAILABLE",
  with_pro: "AVAILABLE",
  available: "AVAILABLE",
  unsold: "UNSOLD",
  "not sold": "UNSOLD",
  notsold: "UNSOLD",
  "un sold": "UNSOLD",
  approved: "CONFIRMED",
  broken: "DAMAGED",
  "payment pending": "PAYMENT_PENDING",
  paymentpending: "PAYMENT_PENDING",
  "payment_pending": "PAYMENT_PENDING",
  "": "UNKNOWN",
};

// Map backend status to display status
export const mapBackendStatusToDisplay = (backendStatus) => {
  const status = (backendStatus ?? "").toLowerCase().trim();
  let displayStatus = reverseStatusMap[status] || status.toUpperCase() || "UNKNOWN";
  
  switch (status) {
    case "not confirmed":
      displayStatus = "Sold";
      break;
    case "available":
    case "withpro":
    case "with pro":
    case "with_pro":
      displayStatus = "With PRO";
      break;
    case "confirmed":
    case "approved":
      displayStatus = "Confirmed";
      break;
    case "unsold":
    case "not sold":
    case "notsold":
    case "un sold":
      displayStatus = "Unsold";
      break;
    case "damaged":
    case "broken":
      displayStatus = "Damaged";
      break;
    case "payment pending":
    case "paymentpending":
    case "payment_pending":
      displayStatus = "Payment Pending";
      break;
    default:
      displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
  
  return displayStatus;
};
