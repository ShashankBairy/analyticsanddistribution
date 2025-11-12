// Utility function to capitalize the first letter of each word
export const capitalizeWords = (text) => {
  if (!text) return text;
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Utility function to handle name input changes with capitalization
export const handleNameChange = (e, setFieldValue) => {
  const { name, value } = e.target;
  const capitalizedValue = capitalizeWords(value);
  
  // Use Formik's setFieldValue to update the field
  setFieldValue(name, capitalizedValue);
};
