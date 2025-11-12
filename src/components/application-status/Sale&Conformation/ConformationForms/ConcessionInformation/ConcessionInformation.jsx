import React, { useState, useEffect } from 'react';
import Inputbox from '../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../widgets/Dropdown/Dropdown';
import { useAuthorizedBy, useConcessionReasons, useConcessionTypes } from '../hooks/useConfirmationData';
import styles from './ConcessionInformation.module.css';
 
const ConcessionInformation = ({ category = 'COLLEGE', onSuccess, externalErrors = {}, onClearFieldError, orientationFee = 0 }) => {
 
 
  // UPPERCASE CATEGORY (used in multiple places)
  const upperCategory = category?.toUpperCase();
 
  // Fetch authorized by data using custom hook
  const { authorizedBy, loading: authorizedByLoading, error: authorizedByError } = useAuthorizedBy();
 
  // Fetch concession reasons data using custom hook
  const { concessionReasons, loading: concessionReasonsLoading, error: concessionReasonsError } = useConcessionReasons();
 
  // Fetch concession types data using custom hook
  const { concessionTypes, loading: concessionTypesLoading, error: concessionTypesError } = useConcessionTypes();
 
 
  const [formData, setFormData] = useState({
    yearConcession1st: '',
    yearConcession2nd: '',
    yearConcession3rd: '',
    admissionFee: '', // For SCHOOL category
    tuitionFee: '', // For SCHOOL category
    givenById: '', // Store ID for backend
    givenBy: '', // Store label for display
    description: '',
    authorizedById: '', // Store ID for backend
    authorizedBy: '', // Store label for display
    reasonId: '', // Store ID for backend
    reason: '', // Store label for display
    employeeIdId: '', // Store ID for backend
    employeeId: '', // Store label for display
    additionalConcession: false,
    concessionAmount: '',
    concessionWrittenById: '', // Store ID for backend
    concessionWrittenBy: '', // Store label for display
    additionalReason: '',
    // Store concession type IDs for backend
    concessionTypeIds: {}
  });
 
  // Local validation error state
  const [concessionErrors, setConcessionErrors] = useState({});
 
  // Function to get concession type ID for a field name
  const getConcessionTypeId = (fieldName) => {
    const isConcessionField = ['yearConcession1st', 'yearConcession2nd', 'yearConcession3rd', 'admissionFee', 'tuitionFee'].includes(fieldName);
   
    if (!concessionTypes || concessionTypes.length === 0) {
      if (isConcessionField) {
        console.log('No concession types loaded. Available:', concessionTypes);
      }
      return null;
    }
   
    const fieldToLabelMap = {
      'yearConcession1st': '1st Year',
      'yearConcession2nd': '2nd Year',
      'yearConcession3rd': '3rd Year',
      'admissionFee': 'Admission Fee',
      'tuitionFee': 'Tuition Fee'
    };
   
    const labelToFind = fieldToLabelMap[fieldName];
    if (!labelToFind) {
      return null;
    }
   
    const matchingType = concessionTypes.find(type =>
      type.label?.toLowerCase().includes(labelToFind.toLowerCase())
    );
   
    if (isConcessionField) {
      console.log(`Field: ${fieldName}, Looking for: "${labelToFind}"`);
      console.log('Found:', matchingType);
      if (!matchingType) {
        console.log('Available concession types:', concessionTypes.map(t => t.label));
      }
    }
   
    return matchingType ? matchingType.id : null;
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    // Clear external error if it exists
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
   
    const concessionAmountFields = ['yearConcession1st', 'yearConcession2nd', 'yearConcession3rd', 'admissionFee', 'tuitionFee'];
    const additionalConcessionField = 'concessionAmount'; // Allow negative values for additional concession
   
    let processedValue = value;
    if (concessionAmountFields.includes(name)) {
      // Regular concession fields - only allow positive numbers
      processedValue = value.replace(/[^0-9.]/g, '');
      const parts = processedValue.split('.');
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (processedValue.startsWith('.')) {
        processedValue = '0' + processedValue;
      }
    } else if (name === additionalConcessionField) {
      // Additional concession field - allow negative values (minus sign)
      // Allow minus sign only at the beginning, numbers, and decimal point
      if (value === '' || value === '-') {
        processedValue = value;
      } else {
        // Match: optional minus, then digits with optional decimal point
        const match = value.match(/^-?\d*\.?\d*/);
        processedValue = match ? match[0] : '';
        // Ensure only one decimal point
        const parts = processedValue.replace(/^-/, '').split('.');
        if (parts.length > 2) {
          const sign = processedValue.startsWith('-') ? '-' : '';
          processedValue = sign + parts[0] + '.' + parts.slice(1).join('');
        }
      }
    }
   
    const concessionTypeId = getConcessionTypeId(name);
   
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: processedValue
      };
     
      if (concessionTypeId) {
        newData.concessionTypeIds = {
          ...prev.concessionTypeIds,
          [name]: concessionTypeId
        };
      }
      return newData;
    });
  };
 
  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
   
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
   
    if (name === 'givenBy' || name === 'authorizedBy' || name === 'concessionWrittenBy' || name === 'employeeId') {
      const selectedOption = authorizedBy.find(option => {
        const combined = `${option.label} - ${option.id}`;
        return option.label === value || combined === value;
      });
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value,
          [name + 'Id']: selectedOption ? selectedOption.id : ''
        };
        return newData;
      });
    } else if (name === 'reason') {
      const selectedOption = concessionReasons.find(option => option.label === value);
      const isStaffName = value?.toLowerCase().trim() === 'staff name' || value?.toLowerCase().trim() === 'staff';
 
      setFormData(prev => {
        const newData = {
          ...prev,
          reason: value,
          reasonId: selectedOption ? selectedOption.id : ''
        };
       
        if (!isStaffName) {
          newData.employeeId = '';
          newData.employeeIdId = '';
        }
 
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
 
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
 
  // VALIDATION — SCHOOL UNCHANGED, COLLEGE NO SUM ERROR
  useEffect(() => {
    const errors = {};
    // Parse additional concession amount (can be negative)
    const add = formData.concessionAmount === '' || formData.concessionAmount === '-'
      ? 0
      : parseFloat(formData.concessionAmount || 0);
 
    // SCHOOL LOGIC — UNCHANGED
    if (upperCategory === "SCHOOL") {
      const adm = parseFloat(formData.admissionFee || 0);
      const tui = parseFloat(formData.tuitionFee || 0);
      const sumYears = adm + tui;
      if (sumYears > orientationFee) {
        errors.sumError = `Total concession (${sumYears}) cannot exceed Orientation Fee (${orientationFee})`;
      }
    }
    // COLLEGE / DEGREE: EACH YEAR SEPARATE — NO SUM
    else if (upperCategory === "COLLEGE" || upperCategory === "DEGREE") {
      const y1 = parseFloat(formData.yearConcession1st || 0);
      const y2 = parseFloat(formData.yearConcession2nd || 0);
      const y3 = parseFloat(formData.yearConcession3rd || 0);
 
      // 1st Year SEPARATE
      if (y1 > orientationFee) {
        errors.yearConcession1st = `1st Year concession cannot exceed Orientation Fee (${orientationFee})`;
      }
      // 2nd Year SEPARATE
      if (y2 > orientationFee) {
        errors.yearConcession2nd = `2nd Year concession cannot exceed Orientation Fee (${orientationFee})`;
      }
      // 3rd Year SEPARATE
      if (upperCategory === "DEGREE" && y3 > orientationFee) {
        errors.yearConcession3rd = `3rd Year concession cannot exceed Orientation Fee (${orientationFee})`;
      }
 
      // NO SUM CHECK — 1st + 2nd CAN = 15000 > 10256
 
      // Additional: remaining = orientationFee - (y1 only - first year)
      // Only check against first year, not combined first and second year
      const totalYears = y1; // Only first year
      const remaining = orientationFee - totalYears; // Allow negative values
 
      // Allow negative amounts - only validate if additional concession is checked
      if (formData.additionalConcession && add > remaining) {
        errors.concessionAmount = `Concession amount cannot exceed remaining (${remaining})`;
      }
      // Note: Negative amounts are allowed (minus amounts can be entered)
    }
 
    setConcessionErrors(errors);
  }, [formData, orientationFee, upperCategory]);
 
  // Propagate to parent only if no errors
  useEffect(() => {
    if (onSuccess && Object.keys(concessionErrors).length === 0 && Object.keys(formData).length > 0) {
      onSuccess(formData);
    }
  }, [formData, concessionErrors, onSuccess]);
 
  // Function to get concession fields based on category
  const getConcessionFields = () => {
    switch (upperCategory) {
      case 'SCHOOL':
        return [
          {
            type: 'input',
            name: 'admissionFee',
            label: 'Admission Fee Concession',
            placeholder: 'Enter admission fee concession amount'
          },
          {
            type: 'input',
            name: 'tuitionFee',
            label: 'Tuition Fee Concession',
            placeholder: 'Enter tuition fee concession amount'
          }
        ];
     
      case 'DEGREE':
        return [
          {
            type: 'input',
            name: 'yearConcession1st',
            label: '1st Year Concession',
            placeholder: 'Enter 1st year concession amount'
          },
          {
            type: 'input',
            name: 'yearConcession2nd',
            label: '2nd Year Concession',
            placeholder: 'Enter 2nd year concession amount'
          },
          {
            type: 'input',
            name: 'yearConcession3rd',
            label: '3rd Year Concession',
            placeholder: 'Enter 3rd year concession amount'
          }
        ];
     
      case 'COLLEGE':
      default:
        return [
          {
            type: 'input',
            name: 'yearConcession1st',
            label: '1st Year Concession',
            placeholder: 'Enter 1st year concession amount'
          },
          {
            type: 'input',
            name: 'yearConcession2nd',
            label: '2nd Year Concession',
            placeholder: 'Enter 2nd year concession amount'
          }
        ];
    }
  };
 
  const isStaffNameSelected = ['staff name', 'staff'].includes(formData.reason?.toLowerCase().trim());
 
  const fields = [
    ...getConcessionFields(),
    {
      type: 'dropdown',
      name: 'givenBy',
      label: 'Refered By',
      placeholder: authorizedByLoading ? 'Loading...' : (authorizedByError ? 'Error loading data' : (authorizedBy?.length === 0 ? 'No data available' : 'Select name')),
      options: authorizedByLoading ? [] : (authorizedBy?.map(auth => `${auth.label} - ${auth.id}`) || []),
      loading: authorizedByLoading,
      error: authorizedByError,
      data: authorizedBy
    },
    {
      type: 'input',
      name: 'description',
      label: 'Description',
      placeholder: 'Enter description'
    },
    {
      type: 'dropdown',
      name: 'authorizedBy',
      label: 'Authorized By',
      placeholder: authorizedByLoading ? 'Loading...' : (authorizedByError ? 'Error loading data' : (authorizedBy?.length === 0 ? 'No data available' : 'Select authoriser name')),
      options: authorizedByLoading ? [] : (authorizedBy?.map(auth => `${auth.label} - ${auth.id}`) || []),
      loading: authorizedByLoading,
      error: authorizedByError,
      data: authorizedBy
    },
    {
      type: 'dropdown',
      name: 'reason',
      label: 'Concession Reason',
      placeholder: concessionReasonsLoading ? 'Loading...' : (concessionReasonsError ? 'Error loading data' : (concessionReasons?.length === 0 ? 'No data available' : 'Select Reason')),
      options: concessionReasonsLoading ? [] : (concessionReasons?.map(reason => reason.label) || []),
      loading: concessionReasonsLoading,
      error: concessionReasonsError,
      data: concessionReasons
    },
    ...(isStaffNameSelected ? [{
      type: 'dropdown',
      name: 'employeeId',
      label: 'Employee ID',
      placeholder: authorizedByLoading ? 'Loading...' : (authorizedByError ? 'Error loading data' : (authorizedBy?.length === 0 ? 'No data available' : 'Select employee')),
      options: authorizedByLoading ? [] : (authorizedBy?.map(auth => `${auth.label} - ${auth.id}`) || []),
      loading: authorizedByLoading,
      error: authorizedByError,
      data: authorizedBy
    }] : [])
  ];
 
  const descriptionIndex = fields.findIndex(field => field.name === 'description');
  const beforeDescriptionFields = descriptionIndex !== -1 ? fields.slice(0, descriptionIndex) : fields;
  const afterDescriptionFields = descriptionIndex !== -1 ? fields.slice(descriptionIndex) : [];
 
  return (
    <div className={styles.concession_information_container}>
      <div className={styles.concession_section_label_wrapper}>
        <span className={styles.concession_section_label}>Concession Information</span>
        <div className={styles.concession_section_line}></div>
      </div>
     
      <div className={styles.concession_form_grid}>
        {beforeDescriptionFields.map((field, index) => (
          <div key={field.name} className={styles.concession_field_wrapper}>
            {field.type === 'input' ? (
              <>
                <Inputbox
                  label={field.label}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  type="text"
                />
                {concessionErrors[field.name] && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{concessionErrors[field.name]}</span>
                  </div>
                )}
                {externalErrors[field.name] && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{externalErrors[field.name]}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <Dropdown
                  dropdownname={field.label}
                  name={field.name}
                  results={field.options}
                  value={formData[field.name] || ''}
                  onChange={handleDropdownChange}
                  dropdownsearch={true}
                  disabled={field.loading}
                  loading={field.loading}
                  placeholder={field.placeholder}
                />
                {concessionErrors[field.name] && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{concessionErrors[field.name]}</span>
                  </div>
                )}
                {externalErrors[field.name] && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{externalErrors[field.name]}</span>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
 
        {/* SHOW SUM ERROR ONLY IN SCHOOL */}
        {upperCategory === 'SCHOOL' && concessionErrors.sumError && (
          <div
            style={{
              gridColumn: '1 / -1',
              color: '#dc2626',
              fontSize: '14px',
              marginBottom: '8px',
              padding: '4px 0',
              fontWeight: '500'
            }}
          >
            {concessionErrors.sumError}
          </div>
        )}
 
        {afterDescriptionFields.map((field, index) => (
          <div key={field.name} className={styles.concession_field_wrapper}>
            {field.type === 'input' ? (
              <>
                <Inputbox
                  label={field.label}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  type="text"
                />
                {concessionErrors[field.name] && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{concessionErrors[field.name]}</span>
                  </div>
                )}
                {externalErrors[field.name] && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{externalErrors[field.name]}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <Dropdown
                  dropdownname={field.label}
                  name={field.name}
                  results={field.options}
                  value={formData[field.name] || ''}
                  onChange={handleDropdownChange}
                  dropdownsearch={true}
                  disabled={field.loading}
                  loading={field.loading}
                  placeholder={field.placeholder}
                />
                {concessionErrors[field.name] && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{concessionErrors[field.name]}</span>
                  </div>
                )}
                {externalErrors[field.name] && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{externalErrors[field.name]}</span>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
 
      {/* Additional Concession Section - Only for non-SCHOOL categories */}
      {upperCategory !== 'SCHOOL' && (
        <div className={styles.additional_concession_section}>
          <div className={styles.concession_checkbox_wrapper}>
            <label className={styles.concession_checkbox_label}>
              <input
                type="checkbox"
                name="additionalConcession"
                checked={formData.additionalConcession}
                onChange={handleCheckboxChange}
                className={styles.concession_checkbox}
              />
              <span className={styles.concession_checkmark}></span>
              Additional Concession Written on Application
            </label>
            <div className={styles.concession_line}></div>
          </div>
 
          {formData.additionalConcession && (
            <div className={styles.additional_concession_fields}>
              <div className={styles.concession_field_wrapper}>
                <Inputbox
                  label="Concession Amount"
                  id="concessionAmount"
                  name="concessionAmount"
                  placeholder="Enter Concession amount"
                  value={formData.concessionAmount}
                  onChange={handleInputChange}
                  type="text"
                />
                {concessionErrors.concessionAmount && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{concessionErrors.concessionAmount}</span>
                  </div>
                )}
                {externalErrors.concessionAmount && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{externalErrors.concessionAmount}</span>
                  </div>
                )}
              </div>
             
              <div className={styles.concession_field_wrapper}>
                <Dropdown
                  dropdownname="Concession Written By"
                  name="concessionWrittenBy"
                  results={authorizedBy?.map(auth => `${auth.label} - ${auth.id}`) || []}
                  value={formData.concessionWrittenBy}
                  onChange={handleDropdownChange}
                  dropdownsearch={true}
                  disabled={authorizedByLoading}
                  loading={authorizedByLoading}
                  placeholder={authorizedByLoading ? 'Loading...' : (authorizedByError ? 'Error loading data' : (authorizedBy?.length === 0 ? 'No data available' : 'Select name'))}
                />
                {externalErrors.concessionWrittenBy && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{externalErrors.concessionWrittenBy}</span>
                  </div>
                )}
              </div>
             
              <div className={styles.concession_field_wrapper}>
                <Inputbox
                  label="Reason"
                  id="additionalReason"
                  name="additionalReason"
                  placeholder="Enter Reason"
                  value={formData.additionalReason}
                  onChange={handleInputChange}
                  type="text"
                />
                {externalErrors.additionalReason && (
                  <div style={{
                    color: '#dc2626',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{externalErrors.additionalReason}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
 
export default ConcessionInformation;