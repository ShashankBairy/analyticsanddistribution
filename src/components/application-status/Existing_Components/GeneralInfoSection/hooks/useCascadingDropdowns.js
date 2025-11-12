import apiService from "../../../../../queries/application-status/SaleFormapis";

export const useCascadingDropdowns = (
  values,
  setFieldValue,
  setFieldTouched,
  setDropdownOptions,
  setLoadingStates
) => {
  const handleSchoolStateChange = (stateId) => {
    console.log("🎯 School State changed:", { stateId });
    
    if (stateId) {
      console.log("🔄 Fetching school districts for state:", stateId);
      apiService.fetchSchoolDistricts(stateId).then((districts) => {
        console.log("📍 Raw school districts response:", districts);
        
        // Handle different data structures
        let processedDistricts = districts;
        if (!Array.isArray(districts)) {
          if (districts && typeof districts === 'object') {
            processedDistricts = [districts];
          } else {
            processedDistricts = [];
          }
        }
        
        const mappedDistricts = processedDistricts.map((item, index) => ({
          id: (item?.id || item?.districtId)?.toString() || "",
          label: item?.name || item?.districtName || item?.label || String(item)
        }));
        
        console.log("📍 Final mapped school districts:", mappedDistricts);
        setDropdownOptions((prev) => ({
          ...prev,
          schoolDistricts: mappedDistricts,
        }));
        setFieldValue("schoolDistrict", "");
        setFieldTouched("schoolDistrict", true);
        console.log("✅ School districts loaded and form updated");
      }).catch((err) => {
        console.error("❌ Failed to fetch school districts:", err);
        setDropdownOptions((prev) => ({ ...prev, schoolDistricts: [] }));
        setFieldValue("schoolDistrict", "");
        setFieldTouched("schoolDistrict", true);
      });
    } else {
      console.log("🧹 Clearing school districts as no state selected");
      setDropdownOptions((prev) => ({ ...prev, schoolDistricts: [] }));
      setFieldValue("schoolDistrict", "");
      setFieldTouched("schoolDistrict", true);
    }
  };

  const handleCampusChange = (campusId) => {
    console.log("🎯 Campus changed:", { campusId });
    
    if (campusId) {
      setLoadingStates(prev => ({ ...prev, joiningClasses: true }));
      
      console.log("🔄 Fetching joining classes for campus:", campusId);
      apiService.fetchClassesByCampus(campusId).then((classes) => {
        console.log("🔍 === CLASSES BY CAMPUS DATA PROCESSING ===");
        console.log("🔍 Raw joining classes response:", classes);
        console.log("🔍 Classes type:", typeof classes);
        console.log("🔍 Is classes array:", Array.isArray(classes));
        console.log("🔍 Classes length:", classes?.length);
        
        // Handle different data structures
        let processedClasses = classes;
        if (!Array.isArray(classes)) {
          if (classes && typeof classes === 'object') {
            processedClasses = [classes];
            console.log("🔍 Converted single object to array");
          } else {
            processedClasses = [];
            console.log("🔍 Set empty array for non-object data");
          }
        }
        
        console.log("🔍 Processed classes:", processedClasses);
        console.log("🔍 Processed classes length:", processedClasses?.length);
        
        const mappedClasses = processedClasses.map((item, index) => {
          const id = (item?.id || item?.classId || index)?.toString() || "";
          const label = item?.name || item?.className || item?.label || String(item);
          console.log(`🔍 Class item ${index}:`, item, "ID:", id, "Label:", label);
          return { id, label };
        });
        
        console.log("🔍 Mapped joining classes:", mappedClasses);
        console.log("🔍 === END CLASSES BY CAMPUS DATA PROCESSING ===");
        setDropdownOptions((prev) => ({
          ...prev,
          joiningClasses: mappedClasses,
          // Clear dependent dropdowns
          batchTypes: [],
          orientationNames: [],
          orientationBatchesCascading: []
        }));
        
        // Clear dependent fields
        setFieldValue("joiningClassName", "");
        setFieldValue("batchType", "");
        setFieldValue("orientationName", "");
        setFieldValue("orientationBatch", "");
        setFieldValue("orientationDates", "");
        setFieldValue("OrientationFee", "");
        
        setLoadingStates(prev => ({ ...prev, joiningClasses: false }));
      }).catch((err) => {
        console.error("❌ Failed to fetch joining classes:", err);
        setLoadingStates(prev => ({ ...prev, joiningClasses: false }));
      });
    } else {
      console.log("🧹 Clearing joining classes as no campus selected");
      setDropdownOptions((prev) => ({
        ...prev,
        joiningClasses: [],
        batchTypes: [],
        orientationNames: [],
        orientationBatchesCascading: []
      }));
      setFieldValue("joiningClassName", "");
      setFieldValue("batchType", "");
      setFieldValue("orientationName", "");
      setFieldValue("orientationBatch", "");
      setFieldValue("orientationDates", "");
      setFieldValue("OrientationFee", "");
    }
  };

  const handleJoiningClassChange = (classId, campusId) => {
    console.log("🎯 Joining class changed:", { classId, campusId });
    
    if (campusId && classId) {
      setLoadingStates(prev => ({ ...prev, batchTypes: true }));
      
      console.log("🔄 Fetching batch types for campus and class:", { campusId, classId });
      apiService.fetchBatchTypeByCampusAndClass(campusId, classId).then((batchTypes) => {
        console.log("📍 Raw batch types response:", batchTypes);
        
        let processedBatchTypes = batchTypes;
        if (!Array.isArray(batchTypes)) {
          if (batchTypes && typeof batchTypes === 'object') {
            processedBatchTypes = [batchTypes];
          } else {
            processedBatchTypes = [];
          }
        }
        
        const mappedBatchTypes = processedBatchTypes.map((item) => ({
          id: (item?.id || item?.studyTypeId)?.toString() || "",
          label: item?.name || item?.studyTypeName || item?.label || String(item)
        }));
        
        console.log("📍 Mapped batch types:", mappedBatchTypes);
        setDropdownOptions((prev) => ({
          ...prev,
          batchTypes: mappedBatchTypes,
          // Clear dependent dropdowns
          orientationNames: [],
          orientationBatchesCascading: []
        }));
        
        // Clear dependent fields
        setFieldValue("batchType", "");
        setFieldValue("orientationName", "");
        setFieldValue("orientationBatch", "");
        setFieldValue("orientationDates", "");
        setFieldValue("OrientationFee", "");
        
        setLoadingStates(prev => ({ ...prev, batchTypes: false }));
      }).catch((error) => {
        console.error("❌ Error fetching batch types:", error);
        setLoadingStates(prev => ({ ...prev, batchTypes: false }));
      });
    } else {
      console.log("🧹 Clearing batch types as campus or class not selected");
      setDropdownOptions((prev) => ({
        ...prev,
        batchTypes: [],
        orientationNames: [],
        orientationBatchesCascading: []
      }));
      setFieldValue("batchType", "");
      setFieldValue("orientationName", "");
      setFieldValue("orientationBatch", "");
      setFieldValue("orientationDates", "");
      setFieldValue("OrientationFee", "");
    }
  };

  const handleBatchTypeChange = (studyTypeId, campusId, classId) => {
    console.log("🎯 Batch type changed:", { studyTypeId, campusId, classId });
    
    if (campusId && classId && studyTypeId) {
      setLoadingStates(prev => ({ ...prev, orientationNames: true }));
      
      console.log("🔄 Fetching orientation names for campus, class, and batch type:", { campusId, classId, studyTypeId });
      apiService.fetchOrientationNameByCampusClassAndStudyType(campusId, classId, studyTypeId).then((orientations) => {
        console.log("📍 Raw orientation names response:", orientations);
        
        let processedOrientations = orientations;
        if (!Array.isArray(orientations)) {
          if (orientations && typeof orientations === 'object') {
            processedOrientations = [orientations];
          } else {
            processedOrientations = [];
          }
        }
        
        const mappedOrientations = processedOrientations.map((item) => ({
          id: (item?.id || item?.orientationId)?.toString() || "",
          label: item?.name || item?.orientationName || item?.label || String(item)
        }));
        
        console.log("📍 Mapped orientation names:", mappedOrientations);
        setDropdownOptions((prev) => ({
          ...prev,
          orientationNames: mappedOrientations,
          // Clear dependent dropdowns
          orientationBatchesCascading: []
        }));
        
        // Clear dependent fields
        setFieldValue("orientationName", "");
        setFieldValue("orientationBatch", "");
        setFieldValue("orientationDates", "");
        setFieldValue("OrientationFee", "");
        
        setLoadingStates(prev => ({ ...prev, orientationNames: false }));
      }).catch((error) => {
        console.error("❌ Error fetching orientation names:", error);
        setLoadingStates(prev => ({ ...prev, orientationNames: false }));
      });
    } else {
      console.log("🧹 Clearing orientation names as required fields not selected");
      setDropdownOptions((prev) => ({
        ...prev,
        orientationNames: [],
        orientationBatchesCascading: []
      }));
      setFieldValue("orientationName", "");
      setFieldValue("orientationBatch", "");
      setFieldValue("orientationDates", "");
      setFieldValue("OrientationFee", "");
    }
  };

  const handleOrientationNameChange = (orientationId, campusId, classId, studyTypeId) => {
    console.log("🎯 Orientation name changed:", { orientationId, campusId, classId, studyTypeId });
    
    if (campusId && classId && studyTypeId && orientationId) {
      setLoadingStates(prev => ({ ...prev, orientationBatchesCascading: true }));
      
      console.log("🔄 Fetching orientation batches for all fields:", { campusId, classId, studyTypeId, orientationId });
      apiService.fetchOrientationBatchByAllFields(campusId, classId, studyTypeId, orientationId).then((batches) => {
        console.log("📍 Raw orientation batches response:", batches);
        
        let processedBatches = batches;
        if (!Array.isArray(batches)) {
          if (batches && typeof batches === 'object') {
            processedBatches = [batches];
          } else {
            processedBatches = [];
          }
        }
        
        const mappedBatches = processedBatches.map((item) => ({
          id: (item?.id || item?.orientationBatchId)?.toString() || "",
          label: item?.name || item?.batchName || item?.label || String(item)
        }));
        
        console.log("📍 Mapped orientation batches:", mappedBatches);
        setDropdownOptions((prev) => ({
          ...prev,
          orientationBatchesCascading: mappedBatches
        }));
        
        // Clear dependent fields
        setFieldValue("orientationBatch", "");
        setFieldValue("orientationDates", "");
        setFieldValue("OrientationFee", "");
        
        setLoadingStates(prev => ({ ...prev, orientationBatchesCascading: false }));
      }).catch((error) => {
        console.error("❌ Error fetching orientation batches:", error);
        setLoadingStates(prev => ({ ...prev, orientationBatchesCascading: false }));
      });
    } else {
      console.log("🧹 Clearing orientation batches as required fields not selected");
      setDropdownOptions((prev) => ({
        ...prev,
        orientationBatchesCascading: []
      }));
      setFieldValue("orientationBatch", "");
      setFieldValue("orientationDates", "");
      setFieldValue("OrientationFee", "");
    }
  };

  const handleOrientationBatchChange = (orientationBatchId, campusId, classId, studyTypeId, orientationId, formatDateForDisplay, setFieldValue) => {
    console.log("🎯 Orientation batch changed:", { orientationBatchId, campusId, classId, studyTypeId, orientationId });
    
    if (campusId && classId && studyTypeId && orientationId && orientationBatchId) {
      console.log("🔄 Fetching orientation details for auto-population:", { campusId, classId, studyTypeId, orientationId, orientationBatchId });
      apiService.fetchOrientationStartDateAndFee(campusId, classId, studyTypeId, orientationId, orientationBatchId).then((details) => {
        console.log("📍 Raw orientation details response:", details);
        
        // Auto-populate orientation start date and fee
        if (details) {
          // Try multiple possible field names for the date
          const possibleDateFields = [
            'startDate', 'orientationStartDate', 'date', 'orientation_date', 'batchStartDate',
            'start_date', 'orientationStartDate', 'batchStartDate', 'orientationDate',
            'endDate', 'orientationEndDate', 'batchEndDate', 'orientation_end_date',
            'startTime', 'orientationStartTime', 'batchStartTime', 'orientation_start_time',
            'createdDate', 'created_date', 'updatedDate', 'updated_date'
          ];
          
          let dateValue = null;
          for (const field of possibleDateFields) {
            if (details[field]) {
              dateValue = details[field];
              console.log(`📍 Found date in field '${field}':`, dateValue);
              break;
            }
          }
          
          if (dateValue) {
            const formattedDate = formatDateForDisplay(dateValue, "orientationDates");
            setFieldValue("orientationDates", formattedDate);
            console.log("✅ Auto-populated orientation start date:", formattedDate);
          } else {
            console.log("❌ No date value found in response. Available fields:", Object.keys(details));
          }
          
          // Try multiple possible field names for the fee
          let feeValue = details.fee || details.orientationFee || details.orientation_fee || details.batchFee;
          console.log("📍 Extracted fee value:", feeValue);
          
          if (feeValue) {
            setFieldValue("OrientationFee", feeValue);
            console.log("✅ Auto-populated orientation fee:", feeValue);
          } else {
            console.log("❌ No fee value found in response");
          }
        } else {
          console.log("❌ No details received from API");
        }
      }).catch((error) => {
        console.error("❌ Error fetching orientation details:", error);
      });
    }
  };

  return {
    handleSchoolStateChange,
    handleCampusChange,
    handleJoiningClassChange,
    handleBatchTypeChange,
    handleOrientationNameChange,
    handleOrientationBatchChange
  };
};
