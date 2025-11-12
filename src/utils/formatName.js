export const formatName = (name) => {
  if (!name) return "";
  return name
    .trim() // remove spaces from start and end
    .split(/\s+/) // split by any number of spaces
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // capitalize properly
    )
    .join(" ");
};
