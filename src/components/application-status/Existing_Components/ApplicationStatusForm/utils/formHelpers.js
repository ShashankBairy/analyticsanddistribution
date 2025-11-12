// Helper function to safely parse floats with fallback
export const safeParseFloat = (value, fallback = 0) => {
  if (!value || value === "" || value === null || value === undefined) return fallback;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

// Helper function to safely parse integers with fallback
export const safeParseInt = (value, fallback = 0) => {
  if (!value || value === "" || value === null || value === undefined) return fallback;
  const parsed = parseInt(value);
  return isNaN(parsed) ? fallback : parsed;
};

// Helper function to get concession data with correct IDs based on joining class
export const getConcessionData = (formData) => {
  console.log("🚀🚀🚀 getConcessionData function called! 🚀🚀🚀");
  console.log("🚀 Form data keys:", Object.keys(formData));
  console.log("🚀 Form data classId:", formData.classId);
  console.log("🚀 Form data joiningClassName:", formData.joiningClassName);
  console.log("🚀 Form data joiningClass:", formData.joiningClass);
  console.log("🚀 Concession amount fields:", {
    yearConcession1st: formData.yearConcession1st,
    yearConcession2nd: formData.yearConcession2nd,
    yearConcession3rd: formData.yearConcession3rd
  });
  console.log("🚀 Concession ID fields:", {
    concessionTypeId1st: formData.concessionTypeId1st,
    concessionTypeId2nd: formData.concessionTypeId2nd,
    concessionTypeId3rd: formData.concessionTypeId3rd,
    firstYearConcessionId: formData.firstYearConcessionId,
    secondYearConcessionId: formData.secondYearConcessionId,
    thirdYearConcessionId: formData.thirdYearConcessionId
  });
  
  // Check if form data already has concession type IDs
  const hasConcessionTypeIds = formData.concessionTypeId1st || formData.concessionTypeId2nd || formData.concessionTypeId3rd;
  
  if (hasConcessionTypeIds) {
    console.log("✅ Found concession type IDs in form data, using them directly");
    const concessions = [];
    
    if (formData.yearConcession1st && safeParseFloat(formData.yearConcession1st) > 0 && formData.concessionTypeId1st) {
      concessions.push({
        concTypeId: parseInt(formData.concessionTypeId1st),
        amount: safeParseFloat(formData.yearConcession1st)
      });
    }
    
    if (formData.yearConcession2nd && safeParseFloat(formData.yearConcession2nd) > 0 && formData.concessionTypeId2nd) {
      concessions.push({
        concTypeId: parseInt(formData.concessionTypeId2nd),
        amount: safeParseFloat(formData.yearConcession2nd)
      });
    }
    
    if (formData.yearConcession3rd && safeParseFloat(formData.yearConcession3rd) > 0 && formData.concessionTypeId3rd) {
      concessions.push({
        concTypeId: parseInt(formData.concessionTypeId3rd),
        amount: safeParseFloat(formData.yearConcession3rd)
      });
    }
    
    console.log("🎯 Using form data concession type IDs:", concessions);
    return concessions;
  }
  
  // Check for 1st year, 2nd year, 3rd year concession IDs in form data
  const hasYearConcessionIds = formData.firstYearConcessionId || formData.secondYearConcessionId || formData.thirdYearConcessionId;
  
  if (hasYearConcessionIds) {
    console.log("✅ Found year concession IDs in form data, using them directly");
    const concessions = [];
    
    if (formData.yearConcession1st && safeParseFloat(formData.yearConcession1st) > 0 && formData.firstYearConcessionId) {
      concessions.push({
        concTypeId: parseInt(formData.firstYearConcessionId),
        amount: safeParseFloat(formData.yearConcession1st)
      });
    }
    
    if (formData.yearConcession2nd && safeParseFloat(formData.yearConcession2nd) > 0 && formData.secondYearConcessionId) {
      concessions.push({
        concTypeId: parseInt(formData.secondYearConcessionId),
        amount: safeParseFloat(formData.yearConcession2nd)
      });
    }
    
    if (formData.yearConcession3rd && safeParseFloat(formData.yearConcession3rd) > 0 && formData.thirdYearConcessionId) {
      concessions.push({
        concTypeId: parseInt(formData.thirdYearConcessionId),
        amount: safeParseFloat(formData.yearConcession3rd)
      });
    }
    
    console.log("🎯 Using year concession IDs from form data:", concessions);
    return concessions;
  }
  
  // Fallback to class-based mapping if no concession type IDs found
  console.log("⚠️ No concession type IDs found in form data, using class-based mapping");
  
  // Try different possible field names for the class
  const joiningClassName = formData.joiningClassName || formData.joiningClass || formData.joinInto || '';
  const classLower = joiningClassName.toLowerCase();
  
  // If no class name found, try to map from classId or if joiningClassName is a number
  let actualClassName = joiningClassName;
  
  // Check if joiningClassName is a numeric string (like "19")
  if (joiningClassName && /^\d+$/.test(joiningClassName)) {
    const classIdToNameMap = {
       19: '8TH CLASS',
       18: '7TH CLASS', 
       17: '6TH CLASS',
       16: '5TH CLASS',
       15: '4TH CLASS',
       14: '3RD CLASS',
       13: '2ND CLASS',
       12: '1ST CLASS',
       11: 'UKG',
       10: 'LKG',
       9: 'NURSERY'
    };
    actualClassName = classIdToNameMap[parseInt(joiningClassName)] || '';
    console.log("🔍 Mapped numeric joiningClassName to className:", joiningClassName, "→", actualClassName);
  }
  // If no class name found, try to map from classId
  else if (!actualClassName && formData.classId) {
    const classIdToNameMap = {
       19: '8TH CLASS',
       18: '7TH CLASS', 
       17: '6TH CLASS',
       16: '5TH CLASS',
       15: '4TH CLASS',
       14: '3RD CLASS',
       13: '2ND CLASS',
       12: '1ST CLASS',
       11: 'UKG',
       10: 'LKG',
       9: 'NURSERY'
    };
    actualClassName = classIdToNameMap[parseInt(formData.classId)] || '';
    console.log("🔍 Mapped classId to className:", formData.classId, "→", actualClassName);
  }
  
  console.log("🔍 Final className for concession mapping:", actualClassName);
  
  // Class-based concession mapping
  const classConcessionMap = {
    'nursery': [
      { concTypeId: 1, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 2, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 3, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    'lkg': [
      { concTypeId: 4, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 5, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 6, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    'ukg': [
      { concTypeId: 7, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 8, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 9, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    '1st class': [
      { concTypeId: 10, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 11, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 12, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    '2nd class': [
      { concTypeId: 13, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 14, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 15, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    '3rd class': [
      { concTypeId: 16, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 17, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 18, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    '4th class': [
      { concTypeId: 19, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 20, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 21, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    '5th class': [
      { concTypeId: 22, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 23, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 24, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    '6th class': [
      { concTypeId: 25, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 26, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 27, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    '7th class': [
      { concTypeId: 28, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 29, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 30, amount: safeParseFloat(formData.yearConcession3rd) }
    ],
    '8th class': [
      { concTypeId: 31, amount: safeParseFloat(formData.yearConcession1st) },
      { concTypeId: 32, amount: safeParseFloat(formData.yearConcession2nd) },
      { concTypeId: 33, amount: safeParseFloat(formData.yearConcession3rd) }
    ]
  };
  
  const concessions = classConcessionMap[classLower] || [];
  const validConcessions = concessions.filter(concession => concession.amount > 0);
  
  console.log("🎯 Using class-based mapping for:", actualClassName, "→", validConcessions);
  return validConcessions;
};
