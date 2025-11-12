import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Inputbox from "../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../widgets/Dropdown/Dropdown";
import { Button as MuiButton } from "@mui/material";
import Button from "../../../../../widgets/Button/Button";
import { ReactComponent as Add } from "../../../../../assets/application-status/si_add-fill.svg";
import { ReactComponent as UploadIcon } from "../../../../../assets/application-status/Upload.svg";
import { useRelationTypes, useStudentClasses, useGenders } from "../hooks/useConfirmationData";
import { capitalizeWords } from "../../../../../utils/textUtils";
import styles from "./SiblingInformation.module.css";

const SiblingInformation = forwardRef(({ onSuccess }, ref) => {
  // Fetch relation types, student classes, and genders data using custom hooks
  const { relationTypes, loading: relationTypesLoading, error: relationTypesError } = useRelationTypes();
  const { studentClasses, loading: studentClassesLoading, error: studentClassesError } = useStudentClasses();
  const { genders, loading: gendersLoading, error: gendersError } = useGenders();
  
  // Field configuration - all labels and options in one place
  const fieldConfig = [
    {
      type: 'input',
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter Full Name',
      required: true
    },
    {
      type: 'dropdown',
      name: 'relationType',
      label: 'Relation Type',
      options: relationTypes, // Now using dynamic data from API
      filterOptions: ['Father', 'Mother', 'Guardian']
    },
    {
      type: 'dropdown',
      name: 'class',
      label: 'Select Class',
      options: studentClasses, // Now using dynamic data from API
    },
    // {
    //   type: 'dropdown',
    //   name: 'gender',
    //   label: 'Gender',
    //   options: genders, // Now using dynamic data from API
    // },
    {
      type: 'input',
      name: 'schoolName',
      label: 'Organization Name',
      placeholder: 'Enter Organization Name'
    }
  ];
  const [showSiblings, setShowSiblings] = useState(false);
  const [siblings, setSiblings] = useState([]);
  const [annexure, setAnnexure] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Update parent when siblings data changes (prevent infinite loop)
  useEffect(() => {
    if (onSuccess && siblings.length >= 0) {
      onSuccess(siblings);
    }
  }, [siblings]);

  // Validation function
  const validateSibling = (sibling, index) => {
    const siblingErrors = {};
    
    if (!sibling.fullName || sibling.fullName.trim() === '') {
      siblingErrors.fullName = 'Full Name is required';
    }
    
    if (!sibling.relationType || sibling.relationType === '') {
      siblingErrors.relationType = 'Relation Type is required';
    }
    
    if (!sibling.class || sibling.class === '') {
      siblingErrors.class = 'Class is required';
    }
    
    if (!sibling.gender || sibling.gender === '') {
      siblingErrors.gender = 'Gender is required';
    }
    
    if (!sibling.schoolName || sibling.schoolName.trim() === '') {
      siblingErrors.schoolName = 'School Name is required';
    }
    
    setErrors(prev => ({
      ...prev,
      [`${index}-fullName`]: siblingErrors.fullName,
      [`${index}-relationType`]: siblingErrors.relationType,
      [`${index}-class`]: siblingErrors.class,
      [`${index}-gender`]: siblingErrors.gender,
      [`${index}-schoolName`]: siblingErrors.schoolName,
    }));
    
    return Object.keys(siblingErrors).length === 0;
  };

  // Function to validate all siblings and mark all fields as touched
  const validateAllSiblings = () => {
    // Mark all fields as touched
    const newTouched = {};
    siblings.forEach((sibling, index) => {
      fieldConfig.forEach(field => {
        newTouched[`${index}-${field.name}`] = true;
      });
    });
    setTouched(newTouched);
    
    // Validate all siblings and collect errors
    let allValid = true;
    const validationErrors = {};
    
    siblings.forEach((sibling, index) => {
      const siblingErrors = {};
      
      if (!sibling.fullName || sibling.fullName.trim() === '') {
        siblingErrors.fullName = 'Full Name is required';
      }
      
      if (!sibling.relationType || sibling.relationType === '') {
        siblingErrors.relationType = 'Relation Type is required';
      }
      
      if (!sibling.class || sibling.class === '') {
        siblingErrors.class = 'Class is required';
      }
      
      if (!sibling.gender || sibling.gender === '') {
        siblingErrors.gender = 'Gender is required';
      }
      
      if (!sibling.schoolName || sibling.schoolName.trim() === '') {
        siblingErrors.schoolName = 'School Name is required';
      }
      
      if (Object.keys(siblingErrors).length > 0) {
        allValid = false;
        // Store errors with index prefix for field-wise display
        Object.keys(siblingErrors).forEach(field => {
          validationErrors[`${index}-${field}`] = siblingErrors[field];
        });
      }
    });
    
    // Update errors state
    setErrors(prev => ({ ...prev, ...validationErrors }));
    
    return { isValid: allValid, errors: validationErrors };
  };

  // Expose validate function to parent via ref
  useImperativeHandle(ref, () => ({
    validate: () => {
      return validateAllSiblings();
    }
  }));

  const handleAddSibling = () => {
    setSiblings(prev => {
      const newSiblings = [...prev, {
        fullName: "",
        relationType: "",
        class: "",
        schoolName: "",
        gender: "",
      }];
      
      // Validate all existing siblings
      prev.forEach((sibling, index) => {
        validateSibling(sibling, index);
      });
      
      return newSiblings;
    });
    setShowSiblings(true);
  };

  const handleRemoveSibling = (index) => {
    setSiblings(prev => {
      const newSiblings = prev.filter((_, i) => i !== index);
      if (newSiblings.length === 0) {
        setShowSiblings(false);
      }
      return newSiblings;
    });
    
    // Clear errors for removed sibling and reindex remaining siblings
    setErrors(prev => {
      const newErrors = {};
      Object.keys(prev).forEach(key => {
        const [errorIndex] = key.split('-');
        if (parseInt(errorIndex) !== index) {
          // Reindex if sibling index is greater than removed index
          if (parseInt(errorIndex) > index) {
            const fieldName = key.split('-').slice(1).join('-');
            newErrors[`${parseInt(errorIndex) - 1}-${fieldName}`] = prev[key];
          } else {
            newErrors[key] = prev[key];
          }
        }
      });
      return newErrors;
    });
    
    // Clear touched state for removed sibling and reindex remaining siblings
    setTouched(prev => {
      const newTouched = {};
      Object.keys(prev).forEach(key => {
        const [touchedIndex] = key.split('-');
        if (parseInt(touchedIndex) !== index) {
          // Reindex if sibling index is greater than removed index
          if (parseInt(touchedIndex) > index) {
            const fieldName = key.split('-').slice(1).join('-');
            newTouched[`${parseInt(touchedIndex) - 1}-${fieldName}`] = prev[key];
          } else {
            newTouched[key] = prev[key];
          }
        }
      });
      return newTouched;
    });
  };

  const handleClearSibling = (index) => {
    setSiblings(prev => prev.map((sibling, i) => 
      i === index ? {
        fullName: "",
        relationType: "",
        class: "",
        schoolName: "",
        gender: "",
      } : sibling
    ));
    
    // Clear errors for this sibling
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${index}-fullName`];
      delete newErrors[`${index}-relationType`];
      delete newErrors[`${index}-class`];
      delete newErrors[`${index}-gender`];
      delete newErrors[`${index}-schoolName`];
      return newErrors;
    });
    
    // Clear touched state for this sibling
    setTouched(prev => {
      const newTouched = { ...prev };
      delete newTouched[`${index}-fullName`];
      delete newTouched[`${index}-relationType`];
      delete newTouched[`${index}-class`];
      delete newTouched[`${index}-gender`];
      delete newTouched[`${index}-schoolName`];
      return newTouched;
    });
  };

  const handleFieldChange = (index, field, value) => {
    let processedValue = value;
    
    // Filter fullName and schoolName to accept only letters and spaces
    if (field === 'fullName' || field === 'schoolName') {
      // Remove numbers and special characters, keep only letters and spaces
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
      // Capitalize first letter of each word
      processedValue = capitalizeWords(filteredValue);
    }
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [`${index}-${field}`]: true,
    }));
    
    setSiblings(prev => {
      const updatedSiblings = prev.map((sibling, i) => 
        i === index ? { ...sibling, [field]: processedValue } : sibling
      );
      
      // Validate the updated sibling
      if (updatedSiblings[index]) {
        validateSibling(updatedSiblings[index], index);
      }
      
      return updatedSiblings;
    });
  };

  const handleAddAnnexure = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    input.multiple = true;
    input.onchange = (e) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        setAnnexure(prev => [...prev, ...Array.from(files)]);
      }
    };
    input.click();
  };

  const handleRemoveAnnexure = (index) => {
    setAnnexure(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.Sibling_Info_Section_general_form_row}>
    
      
      <div className={`${styles.Sibling_Info_Section_general_sibling_container} ${styles.Sibling_Info_Section_general_full_width}`}>
        {showSiblings && (
          <div className={styles.siblingContainer}>
            <div className={styles.Sibling_Info_Section_general_field_label_wrapper}>
              <span className={styles.Sibling_Info_Section_general_field_label}>Sibling Information</span>
              <div className={styles.Sibling_Info_Section_general_line}></div>
            </div>
            <div>
              {siblings.map((sibling, i) => (
                <div key={i} className={styles.siblingBox}>
                  <div className={styles.siblingHeader}>
                    <span className={styles.siblingTag}>Sibling {i + 1}</span>
                    <div className={styles.actionBtns}>
                      <MuiButton
                        type="button"
                        className={styles.clearBtn}
                        onClick={() => handleClearSibling(i)}
                      >
                        Clear
                      </MuiButton>
                      <MuiButton
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => handleRemoveSibling(i)}
                      >
                        ✕
                      </MuiButton>
                    </div>
                  </div>
                  <div className={styles.siblingFields}>
                    {fieldConfig.map((field) => {
                      const fieldKey = `${i}-${field.name}`;
                      const fieldError = errors[fieldKey];
                      const fieldTouched = touched[fieldKey];
                      const showError = fieldTouched && fieldError;
                      
                      if (field.type === 'input') {
                        return (
                          <div key={field.name}>
                            <Inputbox
                              label={field.label}
                              placeholder={field.placeholder}
                              value={sibling[field.name] || ""}
                              onChange={(e) => handleFieldChange(i, field.name, e.target.value)}
                              onBlur={() => setTouched(prev => ({ ...prev, [fieldKey]: true }))}
                              error={showError}
                              required={field.required}
                            />
                            {showError && (
                              <div className={styles.Sibling_Info_Section_general_error}>
                                {fieldError}
                              </div>
                            )}
                          </div>
                        );
                      } else if (field.type === 'dropdown') {
                        const filteredOptions = field.filterOptions 
                          ? field.options.filter(opt => !field.filterOptions.includes(opt.label))
                          : field.options;
                        
                        return (
                          <div key={field.name}>
                            <Dropdown
                              dropdownname={field.label}
                              results={filteredOptions.map(opt => opt.label)}
                              value={field.options.find(opt => opt.id === sibling[field.name])?.label || ""}
                              dropdownsearch={true}
                              onChange={(e) => {
                                const selectedLabel = e.target.value;
                                const selectedOption = field.options.find(opt => opt.label === selectedLabel);
                                handleFieldChange(i, field.name, selectedOption ? selectedOption.id : "");
                                setTouched(prev => ({ ...prev, [fieldKey]: true }));
                              }}
                              onBlur={() => setTouched(prev => ({ ...prev, [fieldKey]: true }))}
                              disabled={relationTypesLoading || studentClassesLoading || gendersLoading}
                              loading={relationTypesLoading || studentClassesLoading || gendersLoading}
                              placeholder={
                                (relationTypesLoading || studentClassesLoading || gendersLoading) 
                                  ? "Loading..." 
                                  : "Select " + field.label
                              }
                            />
                            {showError && (
                              <div className={styles.Sibling_Info_Section_general_error}>
                                {fieldError}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
              
              {/* Add Another Sibling and Add Annexure buttons - side by side */}
              <div style={styles.sibling_annexure_buttons}>
                <Button
                  type="button"
                  variant="secondary"
                  buttonname="Add Another Sibling"
                  righticon={<Add className={styles.addIcon} />}
                  className={styles.addSiblingBtn}
                  onClick={handleAddSibling}
                />
                <Button
                  type="button"
                  variant="secondary"
                  buttonname="Upload Annexure"
                  righticon={<UploadIcon className={styles.uploadIcon} />}
                  className={styles.addSiblingBtn}
                  onClick={handleAddAnnexure}
                />
              </div>
              
              {/* File list for annexure */}
              {annexure.length > 0 && (
                <div className={styles.fileList} style={{ marginTop: "10px" }}>
                  <ul>
                    {annexure.map((file, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
                        <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                        <MuiButton
                          type="button"
                          style={{ marginLeft: "10px", color: "red" }}
                          onClick={() => handleRemoveAnnexure(i)}
                        >
                          Remove
                        </MuiButton>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Initial state - show when no siblings */}
        {!showSiblings && siblings.length === 0 && (
          <div
            className={styles.Sibling_Info_Section_general_form_row}
            style={{
              display: "flex",
              gap: "40px",
              padding:"10px 0px"
            }}
          >
            <div className={styles.Sibling_Info_Section_general_form_field}>
              <Button
                type="button"
                variant="secondary"
                buttonname="Add Sibling"
                lefticon={<Add />}
                width={"100%"}
                className={styles.addSiblingBtn}
                onClick={handleAddSibling}
              />
            </div>
            <div className={styles.Sibling_Info_Section_general_form_field}>
              <Button
                type="button"
                variant="secondary"
                buttonname="Upload Annexure"
                lefticon={<UploadIcon className={styles.uploadIcon} />}
                width={"100%"}
                className={styles.addAnnexures}
                onClick={handleAddAnnexure}
              />
              {annexure.length > 0 && (
                <div className={styles.fileList} style={{ marginTop: "10px" }}>
                  <ul>
                    {annexure.map((file, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
                        <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                        <MuiButton
                          type="button"
                          style={{ marginLeft: "10px", color: "red" }}
                          onClick={() => handleRemoveAnnexure(i)}
                        >
                          Remove
                        </MuiButton>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.Sibling_Info_Section_general_form_field}></div>
          </div>
        )}
      </div>
    </div>
  );
});

export default SiblingInformation;