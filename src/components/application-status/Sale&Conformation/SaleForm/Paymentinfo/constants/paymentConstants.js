import Cash from '../../../../../../assets/application-status/Cash (1).svg';
import DD from '../../../../../../assets/application-status/DD (1).svg';
import Debit from '../../../../../../assets/application-status/Debit Card.svg';
import Cheque from '../../../../../../assets/application-status/Cheque (1).svg';

// Helper function to get today's date in YYYY-MM-DD format for date inputs
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Payment modes configuration
export const paymentModes = [
  { label: "Cash", value: "Cash", icon: Cash },
  { label: "DD", value: "DD", icon: DD },
  { label: "Cheque", value: "Cheque", icon: Cheque },
  { label: "Credit/Debit Card", value: "Credit/Debit Card", icon: Debit },
];

// Initial form values
export const initialValues = {
  // Payment mode
  payMode: 1,
  appFeeReceived: true,
  
  // Cash fields
  paymentDate: getTodayDate(), // Default to today's date
  amount: '',
  mainDdSaleDate: '',
  receiptNumber: '',
  
  // DD fields
  mainDdPayDate: getTodayDate(), // Default to today's date
  mainDdAmount: '',
  mainDdReceiptNumber: '',
  mainDdOrganisationName: '',
  mainDdOrganisationId: '',
  mainDdNumber: '',
  mainDdCityName: '',
  mainDdBankName: '',
  mainDdBankId: '',
  mainDdBranchName: '',
  mainDdBranchId: '',
  mainDdIfscCode: '',
  mainDdDate: getTodayDate(), // Default to today's date
  
  // Cheque fields
  mainChequePayDate: getTodayDate(), // Default to today's date
  mainChequeAmount: '',
  mainChequeSaleDate: '',
  mainChequeReceiptNumber: '',
  mainChequeOrganisationName: '',
  mainChequeOrganisationId: '',
  mainChequeNumber: '',
  mainChequeCityName: '',
  mainChequeBankName: '',
  mainChequeBankId: '',
  mainChequeBranchName: '',
  mainChequeBranchId: '',
  mainChequeIfscCode: '',
  mainChequeDate: getTodayDate(), // Default to today's date
  
  // Credit/Debit Card fields
  cardPayDate: getTodayDate(), // Default to today's date
  cardAmount: '',
  cardReceiptNumber: '',
  
  // Additional fields
  appFeePayMode: 1,
  proCreditCard: false
};
