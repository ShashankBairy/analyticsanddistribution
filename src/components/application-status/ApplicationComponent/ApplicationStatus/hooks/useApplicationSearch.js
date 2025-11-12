import { useState } from 'react';

export const useApplicationSearch = () => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value.trim());
  };

  return {
    search,
    handleSearchChange
  };
};
