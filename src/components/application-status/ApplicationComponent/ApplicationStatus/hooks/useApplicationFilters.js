import { useState, useEffect, useMemo, useRef } from 'react';
import { mapBackendStatusToDisplay } from '../utils/statusMapping';

export const useApplicationFilters = (data, search, selectedCampus) => {
  const [studentCategory, setStudentCategory] = useState({
    all: true,
    sold: false,
    confirmed: false,
    unsold: false,
    withPro: false,
    damaged: false,
  });

  // Baseline refs to detect if user has applied any filter changes
  const initialCampusRef = useRef("All Campuses");
  const initialStudentCategoryRef = useRef({
    all: true,
    sold: false,
    confirmed: false,
    unsold: false,
    withPro: false,
    damaged: false,
  });

  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const filteredDataMemo = useMemo(() => {
    let filtered = data;

    filtered = filtered.map((item) => {
      const backendStatus = (item.status ?? "").toLowerCase().trim();
      const displayStatus = mapBackendStatusToDisplay(backendStatus);
      return { ...item, displayStatus };
    });

    if (search) {
      filtered = filtered.filter((item) =>
        String(item.applicationNo ?? "")
          .toLowerCase()
          .includes(String(search).toLowerCase())
      );
    }

    const isAllSelected =
      studentCategory.all &&
      !studentCategory.sold &&
      !studentCategory.confirmed &&
      !studentCategory.unsold &&
      !studentCategory.withPro &&
      !studentCategory.damaged;
   
    if (!isAllSelected) {
      filtered = filtered.filter((item) => {
        const status = item.displayStatus;
        const matches = (
          studentCategory.all ||
          (studentCategory.sold && status === "Sold") ||
          (studentCategory.confirmed && status === "Confirmed") ||
          (studentCategory.unsold && status === "Unsold") ||
          (studentCategory.withPro && status === "With PRO") ||
          (studentCategory.damaged && status === "Damaged")
        );
        return matches;
      });
    }

    return filtered;
  }, [data, search, selectedCampus, studentCategory]);

  useEffect(() => {
    const isCategoryChanged = (a, b) =>
      a.all !== b.all ||
      a.sold !== b.sold ||
      a.confirmed !== b.confirmed ||
      a.unsold !== b.unsold ||
      a.withPro !== b.withPro ||
      a.damaged !== b.damaged;

    const applied =
      selectedCampus !== initialCampusRef.current ||
      isCategoryChanged(studentCategory, initialStudentCategoryRef.current);

    setIsFilterApplied(applied);
  }, [selectedCampus, studentCategory]);

  return {
    studentCategory,
    setStudentCategory,
    isFilterApplied,
    filteredData: filteredDataMemo
  };
};
