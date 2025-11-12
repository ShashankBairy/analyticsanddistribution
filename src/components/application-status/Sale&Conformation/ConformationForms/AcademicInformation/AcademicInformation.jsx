import React, { useState, useEffect } from 'react';
import Inputbox from '../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../widgets/Dropdown/Dropdown';
import { useOrientations, useBatches, useOrientationBatchComboDetails, useStates, useDistricts, useSchoolTypes, useFoodTypes, useBloodGroupTypes, useCastes, useReligions, useOrientationFee } from '../hooks/useConfirmationData';
import styles from './AcademicInformation.module.css';

const AcademicInformation = ({ profileData, onSuccess, category = 'COLLEGE', externalErrors = {}, onClearFieldError }) => {
 
  const [formData, setFormData] = useState({
    orientationBatch: '',
    orientationBatchId: '', // Add batch ID field for backend
    schoolState: '',
    schoolStateId: '', // Add state ID field for backend
    schoolDistrict: '',
    schoolDistrictId: '', // Add district ID field for backend
    schoolName: '',
    marks: '',
    orientationStartDates: '', // Updated field name
    orientationEndDates: '', // Updated field name
    additionalOrientationFee: '',
    foodType: '',
    foodTypeId: '', // Add food type ID field for backend
    orientationFee: '0.0',
    schoolType: '',
    schoolTypeId: '', // Add school type ID field for backend
    scoreAppNo: '',
    bloodGroup: '',
    bloodGroupId: '', // Add blood group ID field for backend
    caste: '',
    casteId: '', // Add caste ID field for backend
    religion: '',
    religionId: '', // Add religion ID field for backend
    orientationName: '', // Add orientation name field
    orientationNameId: '' // Add orientation ID field for backend
  });

  // Track if orientationFee has been manually edited
  const [isOrientationFeeEdited, setIsOrientationFeeEdited] = useState(false);

  // Extract campusId and classId from profile data
  const campusId = profileData?.branchId || null;
  const classId = profileData?.joiningClassId || null;

  // Fetch orientations data using the hook
  const { orientations, loading: orientationsLoading, error: orientationsError } = useOrientations(campusId, classId);

  // Fetch batches data using the hook (triggered by selected orientation)
  const { batches, loading: batchesLoading, error: batchesError } = useBatches(formData.orientationNameId);

  // Fetch combo details data using the hook (triggered by both orientation and batch)
  const { comboDetails, loading: comboDetailsLoading, error: comboDetailsError } = useOrientationBatchComboDetails(formData.orientationNameId, formData.orientationBatchId);

  // Fetch states data using the hook
  const { states, loading: statesLoading, error: statesError } = useStates();

  // Fetch districts data using the hook (triggered by selected state)
  const { districts, loading: districtsLoading, error: districtsError } = useDistricts(formData.schoolStateId);

  // Fetch school types data using the hook
  const { schoolTypes, loading: schoolTypesLoading, error: schoolTypesError } = useSchoolTypes();

  // Fetch food types data using the hook
  const { foodTypes, loading: foodTypesLoading, error: foodTypesError } = useFoodTypes();

  // Fetch blood group types data using the hook
  const { bloodGroupTypes, loading: bloodGroupTypesLoading, error: bloodGroupTypesError } = useBloodGroupTypes();

  // Fetch castes data using the hook
  const { castes, loading: castesLoading, error: castesError } = useCastes();

  // Fetch religions data using the hook
  const { religions, loading: religionsLoading, error: religionsError } = useReligions();

  // Fetch orientation fee for SCHOOL category (only when orientation is selected and category is SCHOOL)
  const { orientationFee, loading: orientationFeeLoading, error: orientationFeeError } = useOrientationFee(
    category?.toUpperCase() === 'SCHOOL' ? formData.orientationNameId : null
  );

 

  // Helper function to format ISO date to YYYY-MM-DD format for date inputs
  const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return '';
   
    try {
      // Handle the year formatting issue (0027 -> 2027)
      let correctedDateString = isoDateString;
      if (isoDateString.includes('0027')) {
        correctedDateString = isoDateString.replace('0027', '2027');
      }
     
      // Parse the ISO date string and convert to YYYY-MM-DD format
      const date = new Date(correctedDateString);
     
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
     
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
     
      const formattedDate = `${year}-${month}-${day}`;
     
      return formattedDate;
    } catch (error) {
      return '';
    }
  };

  // Auto-populate fields when combo details are loaded
  React.useEffect(() => {
    if (comboDetails) {
      // Extract dates from various possible field names (prioritize the correct field names from backend)
      const startDate = comboDetails.orientationStartDate || comboDetails.startDate || comboDetails.start_date || comboDetails.orientationStartDates || '';
      const endDate = comboDetails.orientationEndDate || comboDetails.endDate || comboDetails.end_date || comboDetails.orientationEndDates || '';
     
      // Format dates for date input fields
      const formattedStartDate = formatDateForInput(startDate);
      const formattedEndDate = formatDateForInput(endDate);
     
      setFormData(prev => {
        const updateData = {
          ...prev,
          orientationStartDates: formattedStartDate,
          orientationEndDates: formattedEndDate
        };
       
        // Only auto-populate orientationFee if it hasn't been manually edited
        if (!isOrientationFeeEdited) {
          const fee = comboDetails.fee || comboDetails.orientationFee || comboDetails.orientation_fee || '0.0';
          // Only update if field is empty or has default value
          if (!prev.orientationFee || prev.orientationFee === '0.0' || prev.orientationFee === '') {
            updateData.orientationFee = fee;
          }
        }
       
        return updateData;
      });
    }
  }, [comboDetails, isOrientationFeeEdited]);

  // Auto-populate orientation fee for SCHOOL category when orientation fee is loaded
  // Only auto-populate if field is empty or hasn't been manually edited
  React.useEffect(() => {
   
    if (category?.toUpperCase() === 'SCHOOL' && orientationFee && !isOrientationFeeEdited) {
     
      // Extract fee from response - check nested data structure
      const feeData = orientationFee.data || orientationFee;
      const fee = feeData.fee ||
                  feeData.orientationFee ||
                  feeData.orientation_fee ||
                  feeData.amount ||
                  feeData.price ||
                  feeData.cost ||
                  '0.0';
     
     
     
      // Only auto-populate if field is empty or has default value
      setFormData(prev => {
        const shouldUpdate = !prev.orientationFee || prev.orientationFee === '0.0' || prev.orientationFee === '';
        if (shouldUpdate) {
          return {
            ...prev,
            orientationFee: fee
          };
        }
        return prev;
      });
    }
  }, [orientationFee, category, isOrientationFeeEdited]);

  // Auto-populate orientation name from profileData when orientations are loaded
  React.useEffect(() => {
    // Only auto-populate if:
    // 1. ProfileData has orientation information
    // 2. Orientations dropdown is loaded
    // 3. Orientation field is currently empty
    if (profileData && orientations && orientations.length > 0 && !formData.orientationName) {
      const profileOrientationId = profileData.orientationId || profileData.orientation_id;
      const profileOrientationName = profileData.orientationName || profileData.orientation_name;
     
      console.log('🔄 AcademicInformation: Attempting to auto-populate orientation from profileData:', {
        profileOrientationId,
        profileOrientationName,
        orientationsCount: orientations.length
      });
     
      // Find matching orientation by ID first (most reliable)
      let matchingOrientation = null;
      if (profileOrientationId) {
        matchingOrientation = orientations.find(
          orientation => orientation.id === Number(profileOrientationId) ||
                        String(orientation.id) === String(profileOrientationId)
        );
      }
     
      // If not found by ID, try finding by name
      if (!matchingOrientation && profileOrientationName) {
        matchingOrientation = orientations.find(
          orientation => orientation.label === profileOrientationName ||
                        orientation.name === profileOrientationName ||
                        orientation.label?.toLowerCase() === profileOrientationName?.toLowerCase()
        );
      }
     
      if (matchingOrientation) {
        console.log('✅ AcademicInformation: Found matching orientation:', matchingOrientation);
        setFormData(prev => ({
          ...prev,
          orientationName: matchingOrientation.label || matchingOrientation.name,
          orientationNameId: matchingOrientation.id
        }));
      } else {
        console.log('⚠️ AcademicInformation: No matching orientation found in dropdown:', {
          profileOrientationId,
          profileOrientationName,
          availableOrientations: orientations.map(o => ({ id: o.id, label: o.label }))
        });
      }
    }
  }, [profileData, orientations, formData.orientationName]);


  // Test function to manually test the food types API
  const testFoodTypesAPI = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/application-confirmation/dropdown/foodtypes');
      const data = await response.json();
    } catch (error) {
    }
  };

  // Call the test function on component mount
  React.useEffect(() => {
    testFoodTypesAPI();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    // Clear external error if it exists
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
   
    // Track if orientationFee is being manually edited
    if (name === 'orientationFee') {
      setIsOrientationFeeEdited(true);
    }
   
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
   
    // Clear external error if it exists
    if (externalErrors[name] && onClearFieldError) {
      onClearFieldError(name);
    }
   
    // Handle orientation selection - store both label and ID
    if (name === 'orientationName') {
      const selectedOrientation = orientations.find(orientation => orientation.label === value);
      const orientationId = selectedOrientation ? selectedOrientation.id : "";
     
     
     
      // Reset orientation fee edited flag when orientation changes so new fee can auto-populate
      setIsOrientationFeeEdited(false);
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        orientationNameId: orientationId, // Store the ID for backend
        orientationBatch: '', // Clear batch when orientation changes
        orientationBatchId: '', // Clear batch ID when orientation changes
        orientationStartDates: '', // Clear dates when orientation changes
        orientationEndDates: '', // Clear dates when orientation changes
        orientationFee: '0.0' // Reset fee when orientation changes
      }));
    } else if (name === 'orientationBatch') {
      // Handle batch selection - store both label and ID
      const selectedBatch = batches.find(batch => batch.label === value);
      const batchId = selectedBatch ? selectedBatch.id : "";
     
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        orientationBatchId: batchId // Store the ID for backend
      }));
    } else if (name === 'schoolState') {
      // Handle state selection - store both label and ID
      const selectedState = states.find(state => state.label === value);
      const stateId = selectedState ? selectedState.id : "";
     
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        schoolStateId: stateId, // Store the ID for backend
        schoolDistrict: '', // Clear district when state changes
        schoolDistrictId: '' // Clear district ID when state changes
      }));
    } else if (name === 'schoolDistrict') {
      // Handle district selection - store both label and ID
      const selectedDistrict = districts.find(district => district.label === value);
      const districtId = selectedDistrict ? selectedDistrict.id : "";
     
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        schoolDistrictId: districtId // Store the ID for backend
      }));
    } else if (name === 'schoolType') {
      // Handle school type selection - store both label and ID
      const selectedSchoolType = schoolTypes.find(schoolType => schoolType.label === value);
      const schoolTypeId = selectedSchoolType ? selectedSchoolType.id : "";
     
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        schoolTypeId: schoolTypeId // Store the ID for backend
      }));
    } else if (name === 'foodType') {
      // Handle food type selection - store both label and ID
      const selectedFoodType = foodTypes.find(foodType => foodType.label === value);
      const foodTypeId = selectedFoodType ? selectedFoodType.id : "";
     
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        foodTypeId: foodTypeId // Store the ID for backend
      }));
    } else if (name === 'bloodGroup') {
      // Handle blood group selection - store both label and ID
      const selectedBloodGroup = bloodGroupTypes.find(bloodGroup => bloodGroup.label === value);
      const bloodGroupId = selectedBloodGroup ? selectedBloodGroup.id : "";
     
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        bloodGroupId: bloodGroupId // Store the ID for backend
      }));
    } else if (name === 'caste') {
      // Handle caste selection - store both label and ID
      const selectedCaste = castes.find(caste => caste.label === value);
      const casteId = selectedCaste ? selectedCaste.id : "";
     
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        casteId: casteId // Store the ID for backend
      }));
    } else if (name === 'religion') {
      // Handle religion selection - store both label and ID
      const selectedReligion = religions.find(religion => religion.label === value);
      const religionId = selectedReligion ? selectedReligion.id : "";
     
     
      setFormData(prev => ({
        ...prev,
        [name]: value,
        religionId: religionId // Store the ID for backend
      }));
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    }
  };

  // Update parent when form data changes (prevent infinite loop)
  useEffect(() => {
    if (onSuccess && Object.keys(formData).length > 0) {
      onSuccess(formData);
    }
  }, [formData]);

  // Function to get fields based on category
  const getFieldsByCategory = () => {
    const allFields = [
    // Column 1
    {
      type: 'input',
      name: 'htNo',
      label: 'HT No',
      placeholder: 'Enter HT No'
    },
    {
      type: 'dropdown',
      name: 'orientationName',
      label: 'Orientation Name',
      placeholder: 'Select orientation name',
      options: orientations.map(orientation => orientation.label), // Now using dynamic data from API
      loading: orientationsLoading,
      error: orientationsError
    },
    {
      type: 'dropdown',
      name: 'orientationBatch',
      label: 'Orientation Batch',
      placeholder: 'Select course batch',
      options: batches.map(batch => batch.label), // Now using dynamic data from API
      loading: batchesLoading,
      error: batchesError
    },
    {
      type: 'input',
      name: 'orientationStartDates',
      label: 'Orientation Start Date',
      placeholder: 'Orientation start date',
      inputType: 'date'
    },
    {
      type: 'input',
      name: 'orientationEndDates',
      label: 'Orientation End Date',
      placeholder: 'Orientation end date',
      inputType: 'date'
    },
    {
      type: 'input',
      name: 'orientationFee',
      label: 'Orientation Fee',
      placeholder: 'Orientation fee',
      value: '0.0'
    },
   
    {
      type: 'dropdown',
      name: 'schoolState',
      label: 'School State',
      placeholder: 'Select state',
      options: states.map(state => state.label), // Now using dynamic data from API
      loading: statesLoading,
      error: statesError
    },
    {
      type: 'dropdown',
      name: 'schoolDistrict',
      label: 'School District',
      placeholder: 'Select district',
      options: districts.map(district => district.label), // Now using dynamic data from API
      loading: districtsLoading,
      error: districtsError
    },
    {
      type: 'dropdown',
      name: 'schoolType',
      label: 'School Type',
      placeholder: 'Select school type',
      options: schoolTypes.map(schoolType => schoolType.label), // Now using dynamic data from API
      loading: schoolTypesLoading,
      error: schoolTypesError
    },
    {
      type: 'input',
      name: 'schoolName',
      label: 'School Name',
      placeholder: 'Enter name of the school'
    },
    {
      type: 'input',
      name: 'scoreAppNo',
      label: 'Score App NO',
      placeholder: 'Enter score app No'
    },
    {
      type: 'input',
      name: 'scoreMarks',
      label: 'Score Marks',
      placeholder: 'Enter score marks'
    },
    // Column 2
   

 
    {
      type: 'dropdown',
      name: 'foodType',
      label: 'Food Type',
      placeholder: foodTypesLoading ? 'Loading...' : (foodTypesError ? 'Error loading data' : (foodTypes?.length === 0 ? 'No data available' : 'Select Food Type')),
      options: foodTypes?.map(foodType => foodType.label) || [], // Now using dynamic data from API with safety check
      loading: foodTypesLoading,
      error: foodTypesError
    },
    // Column 3
   
   
   
    {
      type: 'dropdown',
      name: 'bloodGroup',
      label: 'Blood Group',
      placeholder: 'Select Blood Group',
      options: bloodGroupTypes?.map(bloodGroup => bloodGroup.label) || [], // Now using dynamic data from API with safety check
      loading: bloodGroupTypesLoading,
      error: bloodGroupTypesError
    },
    {
      type: 'dropdown',
      name: 'caste',
      label: 'Caste ',
      placeholder: 'Select Caste',
      options: castes?.map(caste => caste.label) || [], // Now using dynamic data from API with safety check
      loading: castesLoading,
      error: castesError
    },
    {
      type: 'dropdown',
      name: 'religion',
      label: 'Religion',
      placeholder: 'Select Religion',
      options: religions?.map(religion => religion.label) || [], // Now using dynamic data from API with safety check
      loading: religionsLoading,
      error: religionsError
    },
  ];

    // Fields to hide for SCHOOL category
    const fieldsToHideForSchool = [
      'htNo',           // HT Number
      'orientationBatch', // Orientation Batch
      'orientationStartDates', // Orientation Start Date
      'orientationEndDates',   // Orientation End Date
      'schoolType',     // School Type
      'schoolState',    // School State
      'schoolDistrict', // School District
      'schoolName'      // School Name
    ];

    // Filter fields based on category
    if (category?.toUpperCase() === 'SCHOOL') {
      return allFields.filter(field => !fieldsToHideForSchool.includes(field.name));
    } else {
      return allFields;
    }
  };

  // Get filtered fields based on category
  const fields = getFieldsByCategory();

  return (
    <div className={styles.academic_information_container}>
      <div className={styles.academic_section_label_wrapper}>
        <span className={styles.academic_section_label}>Academic Information</span>
        <div className={styles.academic_section_line}></div>
      </div>
     
      <div className={styles.form_grid}>
        {fields.map((field, index) => (
          <div key={field.name} className={styles.field_wrapper}>
            {field.type === 'input' ? (
              <>
                <Inputbox
                  label={field.label}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || field.value || ''}
                  onChange={handleInputChange}
                  type={field.inputType || 'text'}
                />
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
                  value={formData[field.name] || field.value || ''}
                  onChange={handleDropdownChange}
                  dropdownsearch={true}
                  disabled={field.loading}
                  loading={field.loading}
                  placeholder={field.loading ? "Loading..." : field.placeholder}
                />
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
    </div>
  );
};

export default AcademicInformation;

