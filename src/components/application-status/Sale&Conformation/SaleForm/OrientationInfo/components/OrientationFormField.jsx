import React, { useState } from 'react';
import { Field } from 'formik';
import Inputbox from '../../../../../../widgets/Inputbox/InputBox';
import Dropdown from '../../../../../../widgets/Dropdown/Dropdown';
import FormError from './FormError';
import { saleApi } from '../../services/saleApi';
import styles from './OrientationFormField.module.css';


const OrientationFormField = ({ field, values, handleChange, handleBlur, errors, touched, setFieldValue, externalErrors, onClearFieldError }) => {
  // Get category from localStorage to determine if Branch dropdown should be disabled
  const category = localStorage.getItem("category");
  const isSchoolLogin = category === 'SCHOOL';
  // Combined state for better performance
  const [orientationState, setOrientationState] = useState({
    branchTypeOptions: [],
    cityOptions: [],
    studentTypeOptions: [],
    classOptions: [],
    orientationOptions: [],
    campusOptions: [],
    loading: false,
    filteredStudentTypes: [],
    studentTypeId: null,
    joiningClassId: null,
    orientationId: null
  });

  // Destructure for easier access
  const { 
    branchTypeOptions, 
    cityOptions, 
    studentTypeOptions, 
    classOptions, 
    orientationOptions, 
    campusOptions, 
    loading, 
    filteredStudentTypes 
  } = orientationState;

  // API call to fetch student types using saleApi service
  const fetchStudentTypes = async () => {
    try {
      const data = await saleApi.getStudentTypes();
      
      if (data && Array.isArray(data)) {
        const transformedOptions = data.map(item => ({
          value: item.student_type_id || item.id,
          label: item.student_type_name || item.name || item.title
        }));
        
        setOrientationState(prev => ({ ...prev, studentTypeOptions: transformedOptions }));
      }
    } catch (error) {
    }
  };

  // API call to fetch campuses by category using saleApi service
  const fetchCampusesByCategory = async () => {
    try {
      // Get category from localStorage (from login response)
      const category = localStorage.getItem("category");
      
      if (!category) {
        return;
      }
      
      // Convert category to lowercase for API parameter
      const businessType = category.toLowerCase();
      
      const data = await saleApi.getCampusesByCategory(businessType);
      
      // Check if response has nested data array
      const campusData = data?.data || data;
      
      if (campusData && Array.isArray(campusData)) {
        const transformedOptions = campusData.map(item => ({
          value: item.id || item.campusId || item.campus_id,
          label: item.name || item.campusName || item.campus_name
        }));
        
        setOrientationState(prev => ({ ...prev, campusOptions: transformedOptions }));
      }
    } catch (error) {
    }
  };

  // Fetch student types on component mount
  React.useEffect(() => {
    fetchStudentTypes();
    fetchCampusesByCategory(); // Also fetch campuses
  }, []);

  // Initialize filtered student types when student types are loaded
  React.useEffect(() => {
    if (studentTypeOptions.length > 0 && filteredStudentTypes.length === 0) {
      setOrientationState(prev => ({ ...prev, filteredStudentTypes: studentTypeOptions }));
    }
  }, [studentTypeOptions, filteredStudentTypes.length]);

  // Fetch classes when branch value changes
  React.useEffect(() => {
    if (values.branch && campusOptions.length > 0) {
      const selectedCampus = campusOptions.find(option => option.label === values.branch);
      if (selectedCampus) {
        fetchClassesByCampus(selectedCampus.value);
      }
    }
  }, [values.branch, campusOptions]);

  // Filter student types based on branch type
  React.useEffect(() => {
    if (field.name === "studentType" && values.branchType) {
      
      // Filter student types based on branch type
      const filtered = studentTypeOptions.filter(option => {
        const optionLabel = option.label.toLowerCase();
        const branchType = values.branchType.toLowerCase();
        
        // If branch type is "day scholar" or similar, only show day scholar options
        if (branchType.includes('day') && !branchType.includes('res')) {
          return optionLabel.includes('day') || optionLabel.includes('scholar');
        }
        
        // If branch type is "DS AND RES" or "Residential", show remaining options (not day scholar)
        if (branchType.includes('ds and res') || branchType.includes('residential') || branchType.includes('res')) {
          return !optionLabel.includes('day') && !optionLabel.includes('scholar');
        }
        
        // For other branch types, show all options
        return true;
      });
      
      setOrientationState(prev => ({ ...prev, filteredStudentTypes: filtered }));
    } else if (field.name === "studentType" && !values.branchType) {
      // If no branch type selected, show all student types
      setOrientationState(prev => ({ ...prev, filteredStudentTypes: studentTypeOptions }));
    }
  }, [field.name, values.branchType, studentTypeOptions]);

  // Auto-populate branch field from localStorage when campus options are loaded
  React.useEffect(() => {
    if (campusOptions.length > 0 && field.name === "branch" && !values.branch) {
      const campusName = localStorage.getItem("campusName");
      
      if (campusName) {
        // Try to find matching option in API data
        const matchingOption = campusOptions.find(option => option.label === campusName);
        if (matchingOption) {
          setFieldValue('branch', matchingOption.label);
          setFieldValue('branchId', matchingOption.value); // Store ID alongside label
          // Trigger API call to get branch details
          fetchBranchDetails(matchingOption.label);
        }
      }
    }
  }, [campusOptions, field.name, values.branch, setFieldValue]);

  // Auto-populate branch details when campus options are loaded and branch field has value
  React.useEffect(() => {
    if (campusOptions.length > 0 && field.name === "branch" && values.branch) {
      // Check if the current branch value matches any campus option
      const matchingCampus = campusOptions.find(option => option.label === values.branch);
      if (matchingCampus) {
        setFieldValue('branchId', matchingCampus.value); // Store ID alongside existing label
        fetchBranchDetails(values.branch);
      }
    }
  }, [campusOptions, values.branch, field.name]);

  // Fetch classes when Joining Class field renders and branch is selected
  React.useEffect(() => {
    if (field.name === "joiningClass" && values.branch) {
      fetchClassesByCampus(921);
    }
  }, [field.name, values.branch]);

  // Fetch orientations when Orientation Name field renders and joining class is selected
  React.useEffect(() => {
    if (field.name === "orientationName" && values.joiningClass && values.branchId) {
      // Find the class ID from the classOptions array
      const selectedClass = classOptions.find(option => option.label === values.joiningClass);
      if (selectedClass) {
        fetchOrientationsByClass(selectedClass.value, values.branchId);
      } else {
        // If not found, try using the value directly (in case it's already an ID)
        fetchOrientationsByClass(values.joiningClass, values.branchId);
      }
    }
  }, [field.name, values.joiningClass, values.branchId, classOptions]);


  // API call to fetch orientations by class and campus using saleApi service
  const fetchOrientationsByClass = async (classId, cmpsId) => {
    try {
      if (!classId || !cmpsId) {
        console.warn('Missing classId or cmpsId for fetching orientations');
        return;
      }
      const data = await saleApi.getOrientationsByClass(classId, cmpsId);
      
      if (data && Array.isArray(data)) {
        const transformedOptions = data.map(item => ({
          value: item.orientationId || item.orientation_id || item.id,
          label: item.orientationName || item.orientation_name || item.name || item.title
        }));
        
        setOrientationState(prev => ({ ...prev, orientationOptions: transformedOptions }));
      }
    } catch (error) {
      console.error('Error fetching orientations by class:', error);
    }
  };

  // API call to fetch classes by campus using saleApi service
  const fetchClassesByCampus = async (campusId) => {
    try {
      const data = await saleApi.getClassesByCampus(campusId);
      
      
      if (data && Array.isArray(data)) {
        const transformedOptions = data.map(item => ({
          value: item.classId || item.class_id || item.id,
          label: item.className || item.class_name || item.name || item.title
        }));
        
        setOrientationState(prev => ({ ...prev, classOptions: transformedOptions }));
      } else {
        // Set empty array if no data
        setOrientationState(prev => ({ ...prev, classOptions: [] }));
      }
    } catch (error) {
      // Set empty array on error
      setOrientationState(prev => ({ ...prev, classOptions: [] }));
    }
  };

  // API call to get campus type and city when branch is selected
  const fetchBranchDetails = async (branchValue) => {
    if (!branchValue) return;
    
    setOrientationState(prev => ({ ...prev, loading: true }));
    try {
      // Find the campus ID from the selected branch value
      const selectedCampus = campusOptions.find(option => option.label === branchValue);
      
      if (!selectedCampus) {
        return;
      }
      
      const campusId = selectedCampus.value;
      
      const data = await saleApi.getBranchDetails(campusId);
      
      if (data) {
        const { campusType, cityName, campusTypeId, cityId } = data;
        
        
        // Update branch type options
        if (campusType) {
          const branchTypeOption = [{ value: campusTypeId || campusType.toLowerCase().replace(/\s+/g, '_'), label: campusType }];
          setOrientationState(prev => ({ ...prev, branchTypeOptions: branchTypeOption }));
          setFieldValue('branchType', campusType);
          if (campusTypeId) {
            setFieldValue('branchTypeId', campusTypeId); // Store ID alongside label
          } else {
          }
        }
        
        // Update city options
        if (cityName) {
          const cityOption = [{ value: cityId || cityName.toLowerCase().replace(/\s+/g, '_'), label: cityName }];
          setOrientationState(prev => ({ ...prev, cityOptions: cityOption }));
          setFieldValue('city', cityName);
          if (cityId) {
            setFieldValue('cityId', cityId); // Store ID alongside label
          }
        }
      }
      
      // Also fetch classes for the campus using the selected campus ID
      await fetchClassesByCampus(campusId);
      
    } catch (error) {
    } finally {
      setOrientationState(prev => ({ ...prev, loading: false }));
    }
  };

  const getOptions = (optionsKey) => {
    
    const optionsMap = {
      "branchTypeOptions": branchTypeOptions,
      "branchOptions": (() => {
        if (campusOptions && campusOptions.length > 0) {
          return campusOptions;
        }
        
        // Fallback: Get campus name from localStorage (from login response) - PRESERVE AUTO-POPULATION
        const campusName = localStorage.getItem("campusName");
        
        if (campusName) {
          const branchOption = {
            value: campusName.toLowerCase().replace(/\s+/g, '_'),
            label: campusName
          };
          return [branchOption];
        }
        
        return [];
      })(),
      "campusOptions": campusOptions,
      "orientationOptions": orientationOptions,
      "admissionTypeOptions": [],
      "studentTypeOptions": filteredStudentTypes.length > 0 ? filteredStudentTypes : studentTypeOptions,
      "cityOptions": cityOptions,
      "classOptions": (() => {
        // Only return API data - no fallback options
        // classOptions comes from API call to getClassesByCampus
        return Array.isArray(classOptions) ? classOptions : [];
      })()
    };
    
    const result = optionsMap[optionsKey] || [];
    return result;
  };

  return (
    <div className={styles.orientation_info_form_field}>
      <Field name={field.name}>
        {({ field: fieldProps, meta }) => {
          const options = getOptions(field.options);
          const stringOptions = options.map(option => option.label || option.value);
          
          // Debug logging for joining class
          if (field.name === "joiningClass") {
          }

          // Auto-select campus for Branch field - PRESERVE AUTO-POPULATION
          let fieldValue = values[field.name] || "";
          if (field.name === "branch" && !fieldValue && options.length > 0) {
            const campusName = localStorage.getItem("campusName");
            
            if (campusName) {
              // Try to find matching option in API data first
              const matchingOption = options.find(option => 
                option.label === campusName || 
                option.value === campusName.toLowerCase().replace(/\s+/g, '_')
              );
              
              if (matchingOption) {
                fieldValue = matchingOption.label;
              } else {
                // Fallback to direct campus name
                fieldValue = campusName;
              }
              
              // Auto-set the value if not already set
              if (!values[field.name]) {
                handleChange({
                  target: {
                    name: field.name,
                    value: fieldValue
                  }
                });
                // Trigger API call to get branch details
                fetchBranchDetails(fieldValue);
                
                // Also fetch classes for the auto-populated branch
                if (matchingOption) {
                  fetchClassesByCampus(matchingOption.value);
                } else {
                  // If no matching option found, try to get campus ID from localStorage or use a fallback
                  const campusId = localStorage.getItem('campusId') || localStorage.getItem('campus_id');
                  if (campusId) {
                    fetchClassesByCampus(campusId);
                  } else {
                  }
                }
              }
            }
          }

          // Handle Branch field change to trigger API call
          const handleBranchChange = (e) => {
            // Clear external error for this field when user selects an option
            if (onClearFieldError && externalErrors['branch']) {
              onClearFieldError('branch');
            }
            
            handleChange(e);
            if (field.name === "branch") {
              // Find the selected option to get both label and ID
              const selectedOption = campusOptions.find(option => option.label === e.target.value);
              if (selectedOption) {
                setFieldValue('branchId', selectedOption.value); // Store ID alongside label
                
                // Fetch classes for the selected campus/branch
                fetchClassesByCampus(selectedOption.value);
              }
              fetchBranchDetails(e.target.value);
            }
          };

          // Handle Student Type field change to store ID
          const handleStudentTypeChange = (e) => {
            // Clear external error for this field when user selects an option
            if (onClearFieldError && externalErrors['studentType']) {
              onClearFieldError('studentType');
            }
            
            handleChange(e);
            if (field.name === "studentType") {
              // Find the selected option to get both label and ID
              const selectedOption = (filteredStudentTypes.length > 0 ? filteredStudentTypes : studentTypeOptions)
                .find(option => option.label === e.target.value);
              
              if (selectedOption) {
                setFieldValue('studentTypeId', selectedOption.value);
                setOrientationState(prev => ({ ...prev, studentTypeId: selectedOption.value }));
              } else {
                setFieldValue('studentTypeId', '');
                setOrientationState(prev => ({ ...prev, studentTypeId: null }));
              }
            }
          };

          // Handle Joining Class field change to store ID
          const handleJoiningClassChange = (e) => {
            // Clear external error for this field when user selects an option
            if (onClearFieldError && externalErrors['joiningClass']) {
              onClearFieldError('joiningClass');
            }
            
            handleChange(e);
            if (field.name === "joiningClass") {
              // Find the selected option to get both label and ID
              const selectedOption = classOptions.find(option => option.label === e.target.value);
              
              if (selectedOption) {
                setFieldValue('joiningClassId', selectedOption.value);
                setOrientationState(prev => ({ ...prev, joiningClassId: selectedOption.value }));
              } else {
                setFieldValue('joiningClassId', '');
                setOrientationState(prev => ({ ...prev, joiningClassId: null }));
              }
            }
          };

          // Handle Orientation field change to store ID
          const handleOrientationChange = (e) => {
            // Clear external error for this field when user selects an option
            if (onClearFieldError && externalErrors['orientationName']) {
              onClearFieldError('orientationName');
            }
            
            handleChange(e);
            if (field.name === "orientationName") {
              // Find the selected option to get both label and ID
              const selectedOption = orientationOptions.find(option => option.label === e.target.value);
              
              if (selectedOption) {
                setFieldValue('orientationId', selectedOption.value);
                setOrientationState(prev => ({ ...prev, orientationId: selectedOption.value }));
              } else {
                setFieldValue('orientationId', '');
                setOrientationState(prev => ({ ...prev, orientationId: null }));
              }
            }
          };

          // Custom handler for Academic Year field to filter invalid characters
          const handleAcademicYearChange = (e) => {
            const { name, value } = e.target;
            
            // Clear external error for this field when user starts typing
            if (onClearFieldError && externalErrors[name]) {
              onClearFieldError(name);
            }
            
            // Allow letters, numbers, spaces, hyphens, and periods for academic year format
            const filteredValue = value.replace(/[^A-Za-z0-9\s\-\.]/g, '');
            
            handleChange({
              ...e,
              target: {
                ...e.target,
                value: filteredValue
              }
            });
          };

          // For Branch Type and City, render as read-only input fields instead of dropdowns
          if (field.name === "branchType" || field.name === "city") {
            return (
              <Inputbox
                label={field.label}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                value={fieldValue}
                onChange={() => {}} // No-op function to prevent any changes
                onBlur={handleBlur}
                type="text"
                error={meta.touched && meta.error}
                required={field.required}
                readOnly={true}
                disabled={true} // Make it completely non-editable
              />
            );
          }

          // For School login, render Branch as read-only input field instead of dropdown
          if (field.name === "branch" && isSchoolLogin) {
            return (
              <Inputbox
                label={field.label}
                id={field.id}
                name={field.name}
                placeholder={field.placeholder}
                value={fieldValue}
                onChange={() => {}} // No-op function to prevent any changes
                onBlur={handleBlur}
                type="text"
                error={meta.touched && meta.error}
                required={field.required}
                readOnly={true}
                disabled={true} // Make it completely non-editable for School login
              />
            );
          }

          return field.type === "dropdown" ? (
            <Dropdown
              dropdownname={field.label}
              id={field.id}
              name={field.name}
              value={fieldValue}
              onChange={field.name === "branch" ? handleBranchChange : field.name === "studentType" ? handleStudentTypeChange : field.name === "joiningClass" ? handleJoiningClassChange : field.name === "orientationName" ? handleOrientationChange : handleChange}
              results={stringOptions}
              required={field.required}
              disabled={loading || (field.name === "branch" && isSchoolLogin)}
              dropdownsearch={true}
            />
          ) : (
            <Inputbox
              label={field.label}
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              value={values[field.name] || ""}
              onChange={field.name === "academicYear" ? handleAcademicYearChange : handleChange}
              onBlur={handleBlur}
              type={field.type}
              error={meta.touched && meta.error}
              required={field.required}
            />
          );
        }}
      </Field>
      <FormError
        name={field.name}
        touched={touched}
        errors={errors}
        className={styles.orientation_info_error}
        externalErrors={externalErrors}
      />
    </div>
  );
};

export default OrientationFormField;

