import { useState, useCallback } from 'react';
import { saleApi } from '../services/saleApi';

/**
 * Custom hook for orchestrating the entire sale form process
 * This will handle API integration for the complete sale flow
 */
export const useSaleFormOrchestration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information Fields
    firstName: "",
    surname: "",
    gender: "",
    aaparNo: "",
    dateOfBirth: "",
    aadharCardNo: "",
    proReceiptNo: "",
    admissionReferredBy: "",
    quota: "",
    admissionType: "",
    fatherName: "",
    phoneNumber: "",
    profilePhoto: null,
    
    // Orientation Information Fields
    academicYear: "",
    branch: "",
    branchType: "",
    city: "",
    studentType: "",
    joiningClass: "",
    orientationName: "",
    
    // Address Information Fields
    doorNo: "",
    streetName: "",
    landmark: "",
    area: "",
    pincode: "",
    state: "",
    district: "",
    mandal: "",
    city: "",
    gpin: "",
    
    // Payment Information Fields
    paymentDate: "",
    amount: "",
    receiptNumber: "",
    remarks: "",
    paymentMode: "Cash"
  });

  // Transform all form data into backend API format
  const collectAllFormData = useCallback(() => {
    // Transform data into backend API format - now using single object
    const transformedData = {
      // Personal Information
      firstName: formData.firstName || "",
      lastName: formData.surname || "",
      genderId: formData.genderId || 0,
      apaarNo: formData.aaparNo || "",
      dob: formData.dateOfBirth || new Date().toISOString(),
      aadharCardNo: formData.aadharCardNo || 0,
      quotaId: formData.quotaId || 0,
      proReceiptNo: formData.proReceiptNo || 0,
      admissionReferedBy: formData.admissionReferredBy || "",
      appSaleDate: new Date().toISOString(),
      fatherName: formData.fatherName || "",
      fatherMobileNo: formData.phoneNumber || 0,
      
      // Orientation Information
      academicYearId: formData.academicYearId || 0,
      branchId: formData.branchId || 0,
      studentTypeId: formData.studentTypeId || 0,
      classId: formData.joiningClassId || 0,
      orientationId: formData.orientationId || 0,
      appTypeId: formData.admissionTypeId || 0,
      
      // Auto-populated Orientation Fields (using IDs for backend)
      branchTypeId: formData.branchTypeId || 0,
      cityId: formData.cityId || 0,
      academicYear: formData.academicYear || "",
      
      // Keep labels for reference (optional)
      branch: formData.branch || "",
      branchType: formData.branchType || "",
      branchCity: formData.city || "",
      
      // Address Information (nested object)
      addressDetails: {
        doorNo: formData.doorNo || "",
        street: formData.streetName || "",
        landmark: formData.landmark || "",
        area: formData.area || "",
        cityId: formData.cityId || 0,
        mandalId: formData.mandalId || 0,
        districtId: formData.districtId || 0,
        pincode: formData.pincode || 0,
        stateId: formData.stateId || 0,
        createdBy: 0 // You may need to get this from user context
      },
      
      // Additional fields
      studAdmsNo: 0, // You may need to generate this
      proId: 0, // You may need to get this from context
      createdBy: 0, // You may need to get this from user context
      
      // Payment Information (nested object)
      paymentDetails: {
        paymentModeId: formData.paymentModeId || 0,
        paymentDate: formData.paymentDate || new Date().toISOString(),
        amount: formData.amount || 0,
        prePrintedReceiptNo: formData.receiptNumber || "",
        remarks: formData.remarks || "",
        // DD Payment Details
        mainDdOrganisationId: formData.mainDdOrganisationId || 0,
        mainDdBankId: formData.mainDdBankId || 0,
        mainDdBranchId: formData.mainDdBranchId || 0,
        // Cheque Payment Details
        mainChequeOrganisationId: formData.mainChequeOrganisationId || 0,
        mainChequeBankId: formData.mainChequeBankId || 0,
        mainChequeBranchId: formData.mainChequeBranchId || 0,
        createdBy: 0 // You may need to get this from user context
      }
    };
    
    return transformedData;
  }, [formData]);

  // Validate all forms
  const validateAllForms = useCallback(() => {
    // Validate required fields in single object
    const requiredFields = [
      'firstName', 'surname', 'gender', 'aaparNo', 'dateOfBirth', 'aadharCardNo', 'proReceiptNo', 'fatherName', 'phoneNumber', // Personal Info
      'academicYear', 'branch', 'studentType', 'joiningClass', 'orientationName', // Orientation Info  
      'doorNo', 'streetName', 'area', 'pincode', 'state', 'district', 'city', // Address Info
      'amount', 'paymentDate', 'receiptNumber' // Payment Info
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
  }, [formData]);

  // Submit complete sale form
  const submitCompleteSale = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Collect all form data
      const allFormData = collectAllFormData();
      
      // Display complete form data in console (without API integration)
      console.log('🚀 === COMPLETE FORM DATA OBJECT === 🚀');
      console.log('📊 Raw Form Data (Single Object):', formData);
      console.log('🔄 Transformed Data for Backend:', allFormData);
      console.log('📋 Form Data Keys:', Object.keys(formData));
      console.log('📋 Form Data Values:', Object.values(formData));
      console.log('🎯 === END COMPLETE FORM DATA OBJECT === 🎯');
      
      // For now, just simulate success without API call
      // TODO: Uncomment when API is ready
      // const response = await saleApi.submitCompleteSale(allFormData);
      
      setSuccess(true);
      
      return { success: true };
    } catch (err) {
      console.error('Complete sale submission error:', err);
      setError(err.message || 'Sale submission failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [collectAllFormData, formData]);

  // Update form data - now merges directly into single object
  const updateFormData = useCallback((section, data) => {
    console.log('🔄 updateFormData called with section:', section, 'data:', data);
    setFormData(prev => {
      const newData = {
        ...prev,
        ...data  // Merge all fields directly into the single object
      };
      console.log('🔄 Form data updated. Previous:', prev);
      console.log('🔄 Form data updated. New:', newData);
      return newData;
    });
  }, []);

  // Reset all form data
  const resetAllFormData = useCallback(() => {
    setFormData({
      // Personal Information Fields
      firstName: "",
      surname: "",
      gender: "",
      aaparNo: "",
      dateOfBirth: "",
      aadharCardNo: "",
      proReceiptNo: "",
      admissionReferredBy: "",
      quota: "",
      admissionType: "",
      fatherName: "",
      phoneNumber: "",
      profilePhoto: null,
      
      // Orientation Information Fields
      academicYear: "",
      branch: "",
      branchType: "",
      city: "",
      studentType: "",
      joiningClass: "",
      orientationName: "",
      
      // Address Information Fields
      doorNo: "",
      streetName: "",
      landmark: "",
      area: "",
      pincode: "",
      state: "",
      district: "",
      mandal: "",
      city: "",
      gpin: "",
      
      // Payment Information Fields
      paymentDate: "",
      amount: "",
      receiptNumber: "",
      remarks: "",
      paymentMode: "Cash"
    });
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  }, []);

  // Collect current form data (for debugging/inspection)
  const collectCurrentData = useCallback(() => {
    console.log('🔍 === CURRENT FORM DATA === 🔍');
    console.log('📊 Raw Form Data (Single Object):', formData);
    console.log('🔄 Transformed Data:', collectAllFormData());
    console.log('📋 Form Data Keys:', Object.keys(formData));
    console.log('📋 Form Data Values:', Object.values(formData));
    console.log('🎯 === END CURRENT FORM DATA === 🎯');
    return formData;
  }, [formData, collectAllFormData]);

  return {
    isSubmitting,
    error,
    success,
    formData,
    submitCompleteSale,
    updateFormData,
    resetAllFormData,
    collectAllFormData,
    validateAllForms,
    collectCurrentData
  };
};
