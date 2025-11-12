/**
 * Dynamic concession field mapping based on joining class
 * Extracted from ConcessionInfoSection.js lines 16-350
 * Preserves every single line and functionality exactly as manager wants
 */

// Dynamic concession field mapping based on joining class
const getConcessionFieldMapping = (joiningClassName) => {
    const classLower = joiningClassName?.toLowerCase() || '';
    
    console.log("🔍 Mapping function called with:", { joiningClassName, classLower });
    
    // Nursery to 10th standard mapping
    if (classLower.includes('nursery') || classLower.includes('lkg') || classLower.includes('ukg') || 
        classLower.includes('1st') || classLower.includes('2nd') || classLower.includes('3rd') || 
        classLower.includes('4th') || classLower.includes('5th') || classLower.includes('6th') || 
        classLower.includes('7th') || classLower.includes('8th') || classLower.includes('9th') || 
        classLower.includes('10th')) {
      
      // For nursery to 10th: Show Nursery, LKG, UKG
      if (classLower.includes('nursery')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: 'Nursery Concession', show: true },
            { name: 'yearConcession2nd', label: 'LKG Concession', show: true },
            { name: 'yearConcession3rd', label: 'UKG Concession', show: true }
          ]
        };
      }
      // For LKG to 10th: Show LKG, UKG, 1st
      else if (classLower.includes('lkg')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: 'LKG Concession', show: true },
            { name: 'yearConcession2nd', label: 'UKG Concession', show: true },
            { name: 'yearConcession3rd', label: '1st Concession', show: true }
          ]
        };
      }
      // For UKG to 10th: Show UKG, 1st, 2nd
      else if (classLower.includes('ukg')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: 'UKG Concession', show: true },
            { name: 'yearConcession2nd', label: '1st Concession', show: true },
            { name: 'yearConcession3rd', label: '2nd Concession', show: true }
          ]
        };
      }
      // For 1st to 10th: Show 1st, 2nd, 3rd
      else if (classLower.includes('1st')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '1st Concession', show: true },
            { name: 'yearConcession2nd', label: '2nd Concession', show: true },
            { name: 'yearConcession3rd', label: '3rd Concession', show: true }
          ]
        };
      }
      // For 2nd to 10th: Show 2nd, 3rd, 4th
      else if (classLower.includes('2nd') || classLower.includes('2nd class')) {
        console.log("✅ Matched 2nd class condition");
        return {
          fields: [
            { name: 'yearConcession1st', label: '2nd Concession', show: true },
            { name: 'yearConcession2nd', label: '3rd Concession', show: true },
            { name: 'yearConcession3rd', label: '4th Concession', show: true }
          ]
        };
      }
      // For 3rd to 10th: Show 3rd, 4th, 5th
      else if (classLower.includes('3rd')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '3rd Concession', show: true },
            { name: 'yearConcession2nd', label: '4th Concession', show: true },
            { name: 'yearConcession3rd', label: '5th Concession', show: true }
          ]
        };
      }
      // For 4th to 10th: Show 4th, 5th, 6th
      else if (classLower.includes('4th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '4th Concession', show: true },
            { name: 'yearConcession2nd', label: '5th Concession', show: true },
            { name: 'yearConcession3rd', label: '6th Concession', show: true }
          ]
        };
      }
      // For 5th to 10th: Show 5th, 6th, 7th
      else if (classLower.includes('5th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '5th Concession', show: true },
            { name: 'yearConcession2nd', label: '6th Concession', show: true },
            { name: 'yearConcession3rd', label: '7th Concession', show: true }
          ]
        };
      }
      // For 6th to 10th: Show 6th, 7th, 8th
      else if (classLower.includes('6th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '6th Concession', show: true },
            { name: 'yearConcession2nd', label: '7th Concession', show: true },
            { name: 'yearConcession3rd', label: '8th Concession', show: true }
          ]
        };
      }
      // For 7th to 10th: Show 7th, 8th, 9th
      else if (classLower.includes('7th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '7th Concession', show: true },
            { name: 'yearConcession2nd', label: '8th Concession', show: true },
            { name: 'yearConcession3rd', label: '9th Concession', show: true }
          ]
        };
      }
      // For 8th to 10th: Show 8th, 9th, 10th
      else if (classLower.includes('8th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '8th Concession', show: true },
            { name: 'yearConcession2nd', label: '9th Concession', show: true },
            { name: 'yearConcession3rd', label: '10th Concession', show: true }
          ]
        };
      }
      // For 9th to 10th: Show 9th, 10th, 11th
      else if (classLower.includes('9th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '9th Concession', show: true },
            { name: 'yearConcession2nd', label: '10th Concession', show: true },
            { name: 'yearConcession3rd', label: '11th Concession', show: true }
          ]
        };
      }
      // For 10th: Show 10th, 11th, 12th
      else if (classLower.includes('10th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '10th Concession', show: true },
            { name: 'yearConcession2nd', label: '11th Concession', show: true },
            { name: 'yearConcession3rd', label: '12th Concession', show: true }
          ]
        };
      }
    }
    
    // 11th and 12th standard mapping
    else if (classLower.includes('11th') || classLower.includes('12th')) {
      // For 11th: Show 11th, 12th, 13th
      if (classLower.includes('11th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '11th Concession', show: true },
            { name: 'yearConcession2nd', label: '12th Concession', show: true },
            { name: 'yearConcession3rd', label: '13th Concession', show: true }
          ]
        };
      }
      // For 12th: Show 12th, 13th, 14th
      else if (classLower.includes('12th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '12th Concession', show: true },
            { name: 'yearConcession2nd', label: '13th Concession', show: true },
            { name: 'yearConcession3rd', label: '14th Concession', show: true }
          ]
        };
      }
    }
    
    // Degree courses mapping
    else if (classLower.includes('degree') || classLower.includes('bachelor') || classLower.includes('bsc') || 
             classLower.includes('bcom') || classLower.includes('ba') || classLower.includes('btech') ||
             classLower.includes('engineering') || classLower.includes('bca') || classLower.includes('bba')) {
      
      // For 1st year degree: Show 1st, 2nd, 3rd year
      if (classLower.includes('1st year') || classLower.includes('first year') || classLower.includes('1st')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '1st Year Concession', show: true },
            { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
            { name: 'yearConcession3rd', label: '3rd Year Concession', show: true }
          ]
        };
      }
      // For 2nd year degree: Show 2nd, 3rd, 4th year
      else if (classLower.includes('2nd year') || classLower.includes('second year') || classLower.includes('2nd')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '2nd Year Concession', show: true },
            { name: 'yearConcession2nd', label: '3rd Year Concession', show: true },
            { name: 'yearConcession3rd', label: '4th Year Concession', show: true }
          ]
        };
      }
      // For 3rd year degree: Show 3rd, 4th, 5th year
      else if (classLower.includes('3rd year') || classLower.includes('third year') || classLower.includes('3rd')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '3rd Year Concession', show: true },
            { name: 'yearConcession2nd', label: '4th Year Concession', show: true },
            { name: 'yearConcession3rd', label: '5th Year Concession', show: true }
          ]
        };
      }
      // For 4th year degree: Show 4th, 5th, 6th year
      else if (classLower.includes('4th year') || classLower.includes('fourth year') || classLower.includes('4th')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '4th Year Concession', show: true },
            { name: 'yearConcession2nd', label: '5th Year Concession', show: true },
            { name: 'yearConcession3rd', label: '6th Year Concession', show: true }
          ]
        };
      }
      // Default for degree courses: Show 1st, 2nd, 3rd year
      else {
        return {
          fields: [
            { name: 'yearConcession1st', label: '1st Year Concession', show: true },
            { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
            { name: 'yearConcession3rd', label: '3rd Year Concession', show: true }
          ]
        };
      }
    }
    
    // Post graduation mapping
    else if (classLower.includes('masters') || classLower.includes('msc') || classLower.includes('mcom') || 
             classLower.includes('ma') || classLower.includes('mtech') || classLower.includes('mca') || 
             classLower.includes('mba') || classLower.includes('pg') || classLower.includes('post graduation')) {
      
      // For 1st year PG: Show 1st, 2nd year
      if (classLower.includes('1st year') || classLower.includes('first year') || classLower.includes('1st')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '1st Year Concession', show: true },
            { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
            { name: 'yearConcession3rd', label: '3rd Year Concession', show: false }
          ]
        };
      }
      // For 2nd year PG: Show 2nd, 3rd year
      else if (classLower.includes('2nd year') || classLower.includes('second year') || classLower.includes('2nd')) {
        return {
          fields: [
            { name: 'yearConcession1st', label: '2nd Year Concession', show: true },
            { name: 'yearConcession2nd', label: '3rd Year Concession', show: true },
            { name: 'yearConcession3rd', label: '4th Year Concession', show: false }
          ]
        };
      }
      // Default for PG: Show 1st, 2nd year
      else {
        return {
          fields: [
            { name: 'yearConcession1st', label: '1st Year Concession', show: true },
            { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
            { name: 'yearConcession3rd', label: '3rd Year Concession', show: false }
          ]
        };
      }
    }
    
    // PhD mapping
    else if (classLower.includes('phd') || classLower.includes('doctorate') || classLower.includes('research')) {
      return {
        fields: [
          { name: 'yearConcession1st', label: '1st Year Concession', show: true },
          { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
          { name: 'yearConcession3rd', label: '3rd Year Concession', show: true }
        ]
      };
    }
    
    // Default fallback
    else {
      console.log("⚠️ No specific mapping found, using default");
      return {
        fields: [
          { name: 'yearConcession1st', label: '1st Year Concession', show: true },
          { name: 'yearConcession2nd', label: '2nd Year Concession', show: true },
          { name: 'yearConcession3rd', label: '3rd Year Concession', show: true }
        ]
      };
    }
  };
  
  export { getConcessionFieldMapping };