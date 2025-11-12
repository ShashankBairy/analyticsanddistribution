import { safeParseFloat, safeParseInt } from './formHelpers';

// Field mapping from current names to Swagger API response names
export const fieldMapping = {
  // Basic student information
  'studentName': 'studentName',
  'surname': 'surname',
  'htNo': 'htNo',
  'aadhaar': 'aadharCardNo',
  'applicationNo': 'studAdmsNo',
  'dob': 'dob',
  'gender': 'genderId',
  'appType': 'appTypeId',
  'studentType': 'studentTypeId',
  'admissionReferredBy': 'admissionReferredBy',
  'scoreAppNo': 'scoreAppNo',
  'marks': 'marks',
  'orientationDate': 'orientationDate',
  'appSaleDate': 'appSaleDate',
  'orientationFee': 'orientationFee',
  'joinedCampus': 'campusId',
  'course': 'orientationId',
  'courseBatch': 'orientationBatchId',
  'courseDates': 'orientationDate',
  'fee': 'orientationFee',
  'schoolType': 'preschoolTypeId',
  'schoolName': 'schoolName',
  'schoolState': 'preSchoolStateId',
  'schoolDistrict': 'preSchoolDistrictId',
  'schoolTypeId': 'schoolTypeId',
  'preschoolTypeId': 'preschoolTypeId',
  'religion': 'religionId',
  'caste': 'casteId',
  'bloodGroup': 'bloodGroupId',
  'section': 'sectionId',
  'quota': 'quotaId',
  'status': 'statusId',
  'classId': 'classId',
  'createdBy': 'createdBy',
  'dateOfJoin': 'dateOfJoin',
 
  // Parent information
  'fatherName': 'parents[0].name',
  'fatherOccupation': 'parents[0].occupation',
  'fatherPhoneNumber': 'parents[0].mobileNo',
  'fatherEmail': 'parents[0].email',
  'motherName': 'parents[1].name',
  'motherOccupation': 'parents[1].occupation',
  'motherPhoneNumber': 'parents[1].mobileNo',
  'motherEmail': 'parents[1].email',
  'relationType': 'parents[0].relationTypeId', // Father relation type
 
  // Address information
  'doorNo': 'addressDetails.doorNo',
  'street': 'addressDetails.street',
  'landmark': 'addressDetails.landmark',
  'area': 'addressDetails.area',
  'addressCity': 'addressDetails.cityId',
  'mandal': 'addressDetails.mandalId',
  'district': 'addressDetails.districtId',
  'pincode': 'addressDetails.pincode',
  'state': 'addressDetails.stateId',
 
  // Sibling information
  'siblingInformation': 'siblings',
  'fullName': 'siblings[].fullName',
  'schoolName': 'siblings[].schoolName',
  'classId': 'siblings[].classId',
  'relationTypeId': 'siblings[].relationTypeId',
  'genderId': 'siblings[].genderId',
 
  // Payment information
  'appFeeAmount': 'paymentDetails.applicationFeeAmount',
  'appFeeReceiptNo': 'paymentDetails.prePrintedReceiptNo',
  'appFeePayDate': 'paymentDetails.applicationFeeDate',
  'concessionAmount': 'paymentDetails.concessionAmount',
  'payMode': 'paymentDetails.paymentModeId',
  'chequeDdNo': 'paymentDetails.chequeDdNo',
  'ifscCode': 'paymentDetails.ifscCode',
  'chequeDdDate': 'paymentDetails.chequeDdDate',
  'organizationId': 'paymentDetails.organizationId',
  'orgBankId': 'paymentDetails.orgBankId',
  'orgBankBranchId': 'paymentDetails.orgBankBranchId',
 
  // Concession information
  'concessionIssuedBy': 'studentConcessionDetails.concessionIssuedBy',
  'concessionAuthorisedBy': 'studentConcessionDetails.concessionAuthorisedBy',
  'description': 'studentConcessionDetails.description',
  'concessionReasonId': 'studentConcessionDetails.concessionReasonId',
  'yearConcession1st': 'studentConcessionDetails.concessions[0].amount',
  'yearConcession2nd': 'studentConcessionDetails.concessions[1].amount',
  'yearConcession3rd': 'studentConcessionDetails.concessions[2].amount',
  'concessions': 'studentConcessionDetails.concessions',
 
  // PRO concession
  'proConcessionAmount': 'proConcessionDetails.concessionAmount',
  'proReason': 'proConcessionDetails.reason',
  'proEmployeeId': 'proConcessionDetails.proEmployeeId'
};

// Function to transform form data to Swagger API response structure
export const transformFormDataToApiFormat = (formData) => {
  const apiData = {
    studAdmsNo: formData.applicationNo || formData.htNo || "",
    studentName: formData.studentName || formData.firstName || "",
    surname: formData.surname || "",
    htNo: formData.htNo || "",
    apaarNo: formData.aapar || "",
    dateOfJoin: formData.dateOfJoin || new Date().toISOString().split('T')[0],
    createdBy: formData.createdBy || 2,
    aadharCardNo: safeParseInt(formData.aadhaar),
    dob: formData.dob || "",
    religionId: safeParseInt(formData.religion) || 1,
    casteId: safeParseInt(formData.caste) || 1,
    schoolTypeId: safeParseInt(formData.schoolTypeId) || 1,
    schoolName: formData.schoolName || "",
    preSchoolStateId: safeParseInt(formData.schoolState) || 1,
    preSchoolDistrictId: safeParseInt(formData.schoolDistrict) || 1,
    preschoolTypeId: safeParseInt(formData.schoolType) || safeParseInt(formData.preschoolTypeId) || safeParseInt(formData.preschoolType) || 1,
    admissionReferredBy: formData.admissionReferredBy || "",
    scoreAppNo: formData.scoreAppNo || "",
    marks: safeParseInt(formData.marks),
    orientationDate: formData.orientationDates || formData.courseDates || "",
    appSaleDate: formData.appSaleDate || new Date().toISOString(),
    orientationFee: safeParseFloat(formData.OrientationFee) || safeParseFloat(formData.orientationFee) || safeParseFloat(formData.fee),
    genderId: safeParseInt(formData.gender) || 1,
    appTypeId: safeParseInt(formData.admissionType) || safeParseInt(formData.appType) || 1,
    studentTypeId: safeParseInt(formData.studentType) || 1,
    studyTypeId: safeParseInt(formData.batchType) || safeParseInt(formData.studyType) || 1,
    campusId: safeParseInt(formData.joinedCampus) || 1,
    orientationId: safeParseInt(formData.orientationName) || safeParseInt(formData.course) || 1,
    orientationBatchId: safeParseInt(formData.orientationBatch) || safeParseInt(formData.courseBatch) || 1,
    classId: safeParseInt(formData.joiningClassName) || safeParseInt(formData.joinInto) || safeParseInt(formData.classId) || 1,
    sectionId: safeParseInt(formData.section) || 1,
    quotaId: safeParseInt(formData.quota) || 1,
    statusId: safeParseInt(formData.statusId) || 2,
    bloodGroupId: safeParseInt(formData.bloodGroup) || 1,
    category: safeParseInt(formData.category) || 1,
    
    // Parent information
    parents: [
      {
        name: formData.fatherName || "",
        occupation: formData.fatherOccupation || "",
        mobileNo: formData.fatherPhoneNumber || "",
        email: formData.fatherEmail || "",
        relationTypeId: 1 // Father
      },
      {
        name: formData.motherName || "",
        occupation: formData.motherOccupation || "",
        mobileNo: formData.motherPhoneNumber || "",
        email: formData.motherEmail || "",
        relationTypeId: 2 // Mother
      }
    ],
    
    // Address information
    addressDetails: {
      doorNo: formData.doorNo || "",
      street: formData.street || "",
      landmark: formData.landmark || "",
      area: formData.area || "",
      cityId: safeParseInt(formData.addressCity) || 1,
      mandalId: safeParseInt(formData.mandal) || 1,
      districtId: safeParseInt(formData.district) || 1,
      pincode: formData.pincode || "",
      stateId: safeParseInt(formData.state) || 1
    },
    
    // Sibling information
    siblings: Array.isArray(formData.siblingInformation) ? formData.siblingInformation.map(sibling => ({
      fullName: sibling.fullName || "",
      schoolName: sibling.schoolName || "",
      classId: safeParseInt(sibling.classId) || 1,
      relationTypeId: safeParseInt(sibling.relationType) || 1,
      genderId: safeParseInt(sibling.gender) || 1
    })) : [],
    
    // Payment information
    paymentDetails: {
      applicationFeeAmount: safeParseFloat(formData.appFeeAmount) || safeParseFloat(formData.applicationFee) || 0,
      prePrintedReceiptNo: formData.appFeeReceiptNo || "",
      applicationFeeDate: formData.appFeePayDate || "",
      concessionAmount: safeParseFloat(formData.concessionAmount) || 0,
      paymentModeId: safeParseInt(formData.payMode) || 1,
      chequeDdNo: formData.chequeDdNo || "",
      ifscCode: formData.ifscCode || "",
      chequeDdDate: formData.chequeDdDate || "",
      organizationId: safeParseInt(formData.organizationId) || 1,
      orgBankId: safeParseInt(formData.orgBankId) || 1,
      orgBankBranchId: safeParseInt(formData.orgBankBranchId) || 1
    },
    
    // Concession information
    studentConcessionDetails: {
      concessionIssuedBy: formData.concessionIssuedBy || "",
      concessionAuthorisedBy: formData.concessionAuthorisedBy || "",
      description: formData.description || "",
      concessionReasonId: safeParseInt(formData.concessionReasonId) || 1,
      concessions: getConcessionData(formData)
    },
    
    // PRO concession
    proConcessionDetails: {
      concessionAmount: safeParseFloat(formData.proConcessionAmount) || 0,
      reason: formData.proReason || "",
      proEmployeeId: safeParseInt(formData.proEmployeeId) || 1
    }
  };
  
  return apiData;
};

// Helper function to get concession data (imported from formHelpers)
import { getConcessionData } from './formHelpers';
