import { useState } from "react";
import apiService from "../../../../../queries/application-status/SaleFormapis";

export const useFormHandlers = (
  values,
  setFieldValue,
  setFieldTouched,
  setDropdownOptions,
  setLoadingStates,
  setPersistentErrors,
  capitalizeText,
  formatDateForDisplay,
  dropdownOptions,
  setProfilePhotoPreview
) => {
  const handleSectionChange = (e) => {
    const { name, value, files } = e.target;
    let finalValue = value;
    console.log("🔄 Field changed:", { name, value, finalValue });
    console.log("🔄 Is orientationBatch change?", name === "orientationBatch");
    
    // Determine field type and get appropriate options
    let fieldType = "text";
    let options = [];
    
    // Check for file inputs
    if (name === "profilePhoto" || name === "annexure") {
      fieldType = "file";
    } else if (name.includes("siblingInformation")) {
      fieldType = "select";
      if (name.includes("relationType")) {
        options = dropdownOptions.relationTypes || [];
      }
    } else if (name === "category") {
      fieldType = "radio";
      options = [
        { value: 1, label: "SSC" },
        { value: 2, label: "Other" }
      ];
    } else if (name.includes("gender") && !name.includes("siblingInformation")) {
      fieldType = "radio";
      options = dropdownOptions.genders || [];
    } else if (["admissionType", "studentType", "joinedCampus", "joiningClassName", "batchType", "orientationName", "orientationBatch", "schoolState", "schoolDistrict", "schoolType", "religion", "caste", "bloodGroup", "quota"].includes(name)) {
      fieldType = "select";
      // Map field names to their corresponding dropdown options
      const optionMap = {
        admissionType: dropdownOptions.appTypes,
        studentType: dropdownOptions.studentTypes,
        joinedCampus: dropdownOptions.campuses,
        joiningClassName: dropdownOptions.joiningClasses,
        batchType: dropdownOptions.batchTypes,
        orientationName: dropdownOptions.orientationNames,
        orientationBatch: dropdownOptions.orientationBatchesCascading,
        schoolState: dropdownOptions.schoolStates,
        schoolDistrict: dropdownOptions.schoolDistricts,
        schoolType: dropdownOptions.schoolTypes,
        religion: dropdownOptions.religions,
        caste: dropdownOptions.castes,
        bloodGroup: dropdownOptions.bloodGroups,
        quota: dropdownOptions.quotas,
      };
      options = optionMap[name] || [];
    }
    
    const currentField = {
      name,
      type: fieldType,
      options: options,
    };
    if (currentField.type === "file") {
      if (currentField.multiple && name === "annexure") {
        const existingFiles = Array.isArray(values.annexure) ? values.annexure : [];
        const newFiles = files && files.length > 0 ? Array.from(files) : [];
        finalValue = [...existingFiles, ...newFiles];
      } else {
        finalValue = files && files.length > 0 ? files[0] : null;
        if (name === "profilePhoto" && files && files.length > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePhotoPreview(reader.result);
          };
          reader.readAsDataURL(files[0]);
        } else if (name === "profilePhoto" && !files) {
          setProfilePhotoPreview(null);
        }
      }
    } else if (currentField.type === "select") {
      const options = currentField.options || [];
      console.log("🔍 Dropdown options for", name, ":", options);
      console.log("🔍 Selected value:", value);
      
      // Find the option by label and get its ID
      const selectedOption = options.find((opt) => opt.label === value);
      console.log("🔍 Selected option:", selectedOption);
      
      if (selectedOption) {
        finalValue = selectedOption.id;
        console.log("✅ Setting field value to ID:", finalValue);
      } else {
        console.log("⚠️ No matching option found for value:", value);
        finalValue = value; // Keep original value if no match found
      }
    } else if (name === "category") {
      // Handle category selection - for radio buttons, we need to find the option by label
      const options = [
        { value: 1, label: "SSC" },
        { value: 2, label: "Other" }
      ];
      const selectedOption = options.find((opt) => opt.label === value);
      if (selectedOption) {
        finalValue = selectedOption.value;
        console.log("✅ Category selected, setting value:", finalValue);
      } else {
        finalValue = value;
      }
    } else if (name.includes("gender") && !name.includes("siblingInformation")) {
      // Handle gender selection - for radio buttons, we need to find the option by label
      const options = dropdownOptions.genders || [];
      const selectedOption = options.find((opt) => opt.label === value);
      if (selectedOption) {
        finalValue = selectedOption.id;
        console.log("✅ Gender selected, setting ID:", finalValue);
      } else {
        finalValue = value;
      }
    } else if (name === "dob" || name === "orientationDates") {
      // Format date fields to yyyy-mm-dd format for HTML date input
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          finalValue = date.toISOString().split('T')[0]; // yyyy-mm-dd format
          console.log(`📍 Date formatted for ${name}:`, finalValue);
        } else {
          finalValue = value; // Keep original value if not a valid date
        }
      } else {
        finalValue = value;
      }
    } else if (["htNo", "appFee", "fee", "additionalOrientationFee", "scoreAppNo", "marks", "aadhar", "fatherPhoneNumber", "motherPhoneNumber"].includes(name)) {
      finalValue = value.replace(/\D/g, "");
      if (name === "aadhar" && finalValue.length > 12) {
        finalValue = finalValue.slice(0, 12);
      } else if (["fatherPhoneNumber", "motherPhoneNumber"].includes(name) && finalValue.length > 10) {
        finalValue = finalValue.slice(0, 10);
      }
    } else if (
      [
        "studentName",
        "firstName",
        "surname",
        "schoolName",
        "fatherName",
        "motherName",
        "fatherOccupation",
        "motherOccupation",
        "admissionReferredBy",
        "siblingInformation.fullName",
        "siblingInformation.schoolName",
      ].some((field) => name.includes(field))
    ) {
      finalValue = value.replace(/[^a-zA-Z\s.-]/g, "");
      // Apply capitalization to text fields
      finalValue = capitalizeText(finalValue);
    }
    
    console.log(`📍 ${name} changed to:`, finalValue);
    console.log(`📍 Setting field value for ${name}:`, finalValue);
    setFieldValue(name, finalValue);
    setFieldTouched(name, true);
    
    // Debug: Check if the value was actually set
    setTimeout(() => {
      console.log(`📍 Verification - ${name} value after setting:`, values[name]);
    }, 100);
    
    // Clear persistent error for this field if it has a valid value
    if (finalValue && finalValue.toString().trim() !== "") {
      setPersistentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Also clear persistent errors for nested sibling fields
    if (name.includes('siblingInformation') && finalValue && finalValue.toString().trim() !== "") {
      setPersistentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return {
    handleSectionChange
  };
};
