import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleNavigation } from '../utils/navigationHelpers';

/**
 * Custom hook for handling table navigation logic
 * Encapsulates all navigation handlers to eliminate code duplication
 */
export const useTableNavigation = () => {
  const navigate = useNavigate();

  const handleNavigateToSale = useCallback((row) => {
    const rowObj = row?.original ?? row ?? {};
    const id = rowObj?.applicationNo ?? rowObj?.id ?? null;
    
    // Debug logging for table navigation
    console.log("🔄 Table Update button clicked - Sale navigation:", {
      applicationNo: id,
      rowObj: rowObj,
      campus: rowObj.campus,
      cmps_name: rowObj.cmps_name,
      campusName: rowObj.campusName,
      zone: rowObj.zone,
      zonal_name: rowObj.zonal_name,
      zoneName: rowObj.zoneName
    });
    
    handleNavigation(rowObj, 'Sale', navigate, `/scopes/application/status/${id}/sale`);
  }, [navigate]);

  const handleNavigateToConfirmation = useCallback((row) => {
    const rowObj = row?.original ?? row ?? {};
    const id = rowObj?.applicationNo ?? rowObj?.id ?? null;
    
    handleNavigation(rowObj, 'Confirmation', navigate, `/scopes/application/status/${id}/confirm`);
  }, [navigate]);

  const handleNavigateToDamage = useCallback((row) => {
    const rowObj = row?.original ?? row ?? {};
    const id = rowObj?.applicationNo ?? rowObj?.id ?? null;
    
    handleNavigation(rowObj, 'Damage', navigate, `/scopes/application/status/${id}/damaged`);
  }, [navigate]);

  return {
    handleNavigateToSale,
    handleNavigateToConfirmation,
    handleNavigateToDamage,
  };
};
