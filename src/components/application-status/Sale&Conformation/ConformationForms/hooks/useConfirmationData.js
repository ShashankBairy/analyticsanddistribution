import { useState, useEffect } from 'react';
import { getSectors, getOccupations, getRelationTypes, getStudentClasses, getGenders, getStudentProfileDetails, getOrientations, getBatches, getOrientationBatchComboDetails, getStates, getDistricts, getSchoolTypes, getFoodTypes, getBloodGroupTypes, getCastes, getReligions, getAuthorizedBy, getConcessionReasons, getConcessionTypes, getOrientationFee } from '../services/confirmationService';

/**
 * Custom hook to fetch sectors data
 * @returns {Object} { sectors, loading, error, refetch }
 */
export const useSectors = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useSectors: Fetching sectors data...');
      
      const sectorsData = await getSectors();
      
      console.log('✅ useSectors: Sectors fetched successfully:', sectorsData);
      
      setSectors(sectorsData);
    } catch (err) {
      console.error('❌ useSectors: Error fetching sectors:', err);
      setError(err.message);
      setSectors([]); // No fallback, just empty array
    } finally {
      setLoading(false);
    }
  };

  // Fetch sectors on component mount
  useEffect(() => {
    fetchSectors();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchSectors();
  };

  return {
    sectors,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch occupations data
 * @returns {Object} { occupations, loading, error, refetch }
 */
export const useOccupations = () => {
  const [occupations, setOccupations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOccupations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useOccupations: Fetching occupations data...');
      
      const occupationsData = await getOccupations();
      
      console.log('✅ useOccupations: Occupations fetched successfully:', occupationsData);
      
      setOccupations(occupationsData);
    } catch (err) {
      console.error('❌ useOccupations: Error fetching occupations:', err);
      setError(err.message);
      setOccupations([]); // No fallback, just empty array
    } finally {
      setLoading(false);
    }
  };

  // Fetch occupations on component mount
  useEffect(() => {
    fetchOccupations();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchOccupations();
  };

  return {
    occupations,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch relation types data
 * @returns {Object} { relationTypes, loading, error, refetch }
 */
export const useRelationTypes = () => {
  const [relationTypes, setRelationTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRelationTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useRelationTypes: Fetching relation types data...');
      
      const relationTypesData = await getRelationTypes();
      
      console.log('✅ useRelationTypes: Relation types fetched successfully:', relationTypesData);
      
      setRelationTypes(relationTypesData);
    } catch (err) {
      console.error('❌ useRelationTypes: Error fetching relation types:', err);
      setError(err.message);
      setRelationTypes([]); // No fallback, just empty array
    } finally {
      setLoading(false);
    }
  };

  // Fetch relation types on component mount
  useEffect(() => {
    fetchRelationTypes();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchRelationTypes();
  };

  return {
    relationTypes,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch student classes data
 * @returns {Object} { studentClasses, loading, error, refetch }
 */
export const useStudentClasses = () => {
  const [studentClasses, setStudentClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useStudentClasses: Fetching student classes data...');
      
      const studentClassesData = await getStudentClasses();
      
      console.log('✅ useStudentClasses: Student classes fetched successfully:', studentClassesData);
      
      setStudentClasses(studentClassesData);
    } catch (err) {
      console.error('❌ useStudentClasses: Error fetching student classes:', err);
      setError(err.message);
      setStudentClasses([]); // No fallback, just empty array
    } finally {
      setLoading(false);
    }
  };

  // Fetch student classes on component mount
  useEffect(() => {
    fetchStudentClasses();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchStudentClasses();
  };

  return {
    studentClasses,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch genders data
 * @returns {Object} { genders, loading, error, refetch }
 */
export const useGenders = () => {
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGenders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useGenders: Fetching genders data...');
      
      const gendersData = await getGenders();
      
      console.log('✅ useGenders: Genders fetched successfully:', gendersData);
      
      setGenders(gendersData);
    } catch (err) {
      console.error('❌ useGenders: Error fetching genders:', err);
      setError(err.message);
      setGenders([]); // No fallback, just empty array
    } finally {
      setLoading(false);
    }
  };

  // Fetch genders on component mount
  useEffect(() => {
    fetchGenders();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchGenders();
  };

  return {
    genders,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch student profile details
 * @param {string|number} applicationNumber - Application number to fetch details for
 * @returns {Object} { profileData, loading, error, refetch }
 */
export const useStudentProfile = (applicationNumber) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudentProfile = async (appNumber) => {
    if (!appNumber) {
      console.log('⚠️ No application number provided, skipping profile fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useStudentProfile: Fetching student profile for application:', appNumber);
      
      const profileDetails = await getStudentProfileDetails(appNumber);
      
      console.log('✅ useStudentProfile: Student profile fetched successfully:', profileDetails);
      
      setProfileData(profileDetails);
    } catch (err) {
      console.error('❌ useStudentProfile: Error fetching student profile:', err);
      setError(err.message);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student profile when application number changes
  useEffect(() => {
    if (applicationNumber) {
      fetchStudentProfile(applicationNumber);
    }
  }, [applicationNumber]);

  // Refetch function for manual refresh
  const refetch = () => {
    if (applicationNumber) {
      fetchStudentProfile(applicationNumber);
    }
  };

  return {
    profileData,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch orientations data with campus and class filters
 * @param {number} campusId - Campus ID for filtering orientations
 * @param {number} classId - Class ID for filtering orientations
 * @returns {Object} { orientations, loading, error, refetch }
 */
export const useOrientations = (campusId, classId) => {
  const [orientations, setOrientations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrientations = async (cId, clId) => {
    if (!cId || !clId) {
      console.log('⚠️ Missing campusId or classId, skipping orientations fetch');
      setOrientations([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useOrientations: Fetching orientations for campus:', cId, 'class:', clId);
      
      const orientationsData = await getOrientations(cId, clId);
      
      console.log('✅ useOrientations: Orientations fetched successfully:', orientationsData);
      
      setOrientations(orientationsData);
    } catch (err) {
      console.error('❌ useOrientations: Error fetching orientations:', err);
      setError(err.message);
      setOrientations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orientations when campusId or classId changes
  useEffect(() => {
    if (campusId && classId) {
      fetchOrientations(campusId, classId);
    } else {
      setOrientations([]);
      setError(null);
    }
  }, [campusId, classId]);

  // Refetch function for manual refresh
  const refetch = () => {
    if (campusId && classId) {
      fetchOrientations(campusId, classId);
    }
  };

  return {
    orientations,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch batches data with orientation filter
 * @param {number} orientationId - Orientation ID for filtering batches
 * @returns {Object} { batches, loading, error, refetch }
 */
export const useBatches = (orientationId) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBatches = async (oId) => {
    if (!oId) {
      console.log('⚠️ Missing orientationId, skipping batches fetch');
      setBatches([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useBatches: Fetching batches for orientation:', oId);
      
      const batchesData = await getBatches(oId);
      
      console.log('✅ useBatches: Batches fetched successfully:', batchesData);
      
      setBatches(batchesData);
    } catch (err) {
      console.error('❌ useBatches: Error fetching batches:', err);
      setError(err.message);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch batches when orientationId changes
  useEffect(() => {
    if (orientationId) {
      fetchBatches(orientationId);
    } else {
      setBatches([]);
      setError(null);
    }
  }, [orientationId]);

  // Refetch function for manual refresh
  const refetch = () => {
    if (orientationId) {
      fetchBatches(orientationId);
    }
  };

  return {
    batches,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch orientation batch combo details
 * @param {number} orientationId - Orientation ID
 * @param {number} batchId - Batch ID
 * @returns {Object} { comboDetails, loading, error, refetch }
 */
export const useOrientationBatchComboDetails = (orientationId, batchId) => {
  const [comboDetails, setComboDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComboDetails = async (oId, bId) => {
    if (!oId || !bId) {
      console.log('⚠️ Missing orientationId or batchId, skipping combo details fetch');
      setComboDetails(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useOrientationBatchComboDetails: Fetching combo details for orientation:', oId, 'batch:', bId);
      
      const comboData = await getOrientationBatchComboDetails(oId, bId);
      
      console.log('✅ useOrientationBatchComboDetails: Combo details fetched successfully:', comboData);
      
      setComboDetails(comboData);
    } catch (err) {
      console.error('❌ useOrientationBatchComboDetails: Error fetching combo details:', err);
      setError(err.message);
      setComboDetails(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch combo details when orientationId or batchId changes
  useEffect(() => {
    if (orientationId && batchId) {
      fetchComboDetails(orientationId, batchId);
    } else {
      setComboDetails(null);
      setError(null);
    }
  }, [orientationId, batchId]);

  // Refetch function for manual refresh
  const refetch = () => {
    if (orientationId && batchId) {
      fetchComboDetails(orientationId, batchId);
    }
  };

  return {
    comboDetails,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch states data
 * @returns {Object} { states, loading, error, refetch }
 */
export const useStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useStates: Fetching states...');
      
      const statesData = await getStates();
      
      console.log('✅ useStates: States fetched successfully:', statesData);
      
      setStates(statesData);
    } catch (err) {
      console.error('❌ useStates: Error fetching states:', err);
      setError(err.message);
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchStates();
  };

  return {
    states,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch districts data with state filter
 * @param {number} stateId - State ID for filtering districts
 * @returns {Object} { districts, loading, error, refetch }
 */
export const useDistricts = (stateId) => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDistricts = async (sId) => {
    if (!sId) {
      console.log('⚠️ Missing stateId, skipping districts fetch');
      setDistricts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useDistricts: Fetching districts for state:', sId);
      
      const districtsData = await getDistricts(sId);
      
      console.log('✅ useDistricts: Districts fetched successfully:', districtsData);
      
      setDistricts(districtsData);
    } catch (err) {
      console.error('❌ useDistricts: Error fetching districts:', err);
      setError(err.message);
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch districts when stateId changes
  useEffect(() => {
    if (stateId) {
      fetchDistricts(stateId);
    } else {
      setDistricts([]);
      setError(null);
    }
  }, [stateId]);

  // Refetch function for manual refresh
  const refetch = () => {
    if (stateId) {
      fetchDistricts(stateId);
    }
  };

  return {
    districts,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch school types data
 * @returns {Object} { schoolTypes, loading, error, refetch }
 */
export const useSchoolTypes = () => {
  const [schoolTypes, setSchoolTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchoolTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useSchoolTypes: Fetching school types...');
      
      const schoolTypesData = await getSchoolTypes();
      
      console.log('✅ useSchoolTypes: School types fetched successfully:', schoolTypesData);
      
      setSchoolTypes(schoolTypesData);
    } catch (err) {
      console.error('❌ useSchoolTypes: Error fetching school types:', err);
      setError(err.message);
      setSchoolTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch school types on component mount
  useEffect(() => {
    fetchSchoolTypes();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchSchoolTypes();
  };

  return {
    schoolTypes,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch food types data
 * @returns {Object} { foodTypes, loading, error, refetch }
 */
export const useFoodTypes = () => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFoodTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useFoodTypes: Fetching food types...');
      
      const foodTypesData = await getFoodTypes();
      
      console.log('✅ useFoodTypes: Food types fetched successfully:', foodTypesData);
      console.log('📊 useFoodTypes: Food types data length:', foodTypesData?.length);
      console.log('📊 useFoodTypes: Food types data type:', typeof foodTypesData);
      console.log('📊 useFoodTypes: Food types is array:', Array.isArray(foodTypesData));
      
      setFoodTypes(foodTypesData || []);
    } catch (err) {
      console.error('❌ useFoodTypes: Error fetching food types:', err);
      setError(err.message);
      setFoodTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch food types on component mount
  useEffect(() => {
    fetchFoodTypes();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchFoodTypes();
  };

  return {
    foodTypes,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch blood group types data
 * @returns {Object} { bloodGroupTypes, loading, error, refetch }
 */
export const useBloodGroupTypes = () => {
  const [bloodGroupTypes, setBloodGroupTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBloodGroupTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useBloodGroupTypes: Fetching blood group types...');
      
      const bloodGroupTypesData = await getBloodGroupTypes();
      
      console.log('✅ useBloodGroupTypes: Blood group types fetched successfully:', bloodGroupTypesData);
      console.log('📊 useBloodGroupTypes: Blood group types data length:', bloodGroupTypesData?.length);
      console.log('📊 useBloodGroupTypes: Blood group types data type:', typeof bloodGroupTypesData);
      console.log('📊 useBloodGroupTypes: Blood group types is array:', Array.isArray(bloodGroupTypesData));
      
      setBloodGroupTypes(bloodGroupTypesData || []);
    } catch (err) {
      console.error('❌ useBloodGroupTypes: Error fetching blood group types:', err);
      setError(err.message);
      setBloodGroupTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blood group types on component mount
  useEffect(() => {
    fetchBloodGroupTypes();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchBloodGroupTypes();
  };

  return {
    bloodGroupTypes,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch castes data
 * @returns {Object} { castes, loading, error, refetch }
 */
export const useCastes = () => {
  const [castes, setCastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCastes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useCastes: Fetching castes...');
      
      const castesData = await getCastes();
      
      console.log('✅ useCastes: Castes fetched successfully:', castesData);
      
      setCastes(castesData);
    } catch (err) {
      console.error('❌ useCastes: Error fetching castes:', err);
      setError(err.message);
      setCastes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch castes on component mount
  useEffect(() => {
    fetchCastes();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchCastes();
  };

  return {
    castes,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch religions data
 * @returns {Object} { religions, loading, error, refetch }
 */
export const useReligions = () => {
  const [religions, setReligions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReligions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useReligions: Fetching religions...');
      
      const religionsData = await getReligions();
      
      console.log('✅ useReligions: Religions fetched successfully:', religionsData);
      
      setReligions(religionsData);
    } catch (err) {
      console.error('❌ useReligions: Error fetching religions:', err);
      setError(err.message);
      setReligions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch religions on component mount
  useEffect(() => {
    fetchReligions();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchReligions();
  };

  return {
    religions,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch any dropdown data
 * @param {string} dropdownType - Type of dropdown to fetch
 * @returns {Object} { data, loading, error, refetch }
 */
export const useDropdownData = (dropdownType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 useDropdownData: Fetching ${dropdownType} data...`);
      
      const { getDropdownData } = await import('../services/confirmationService');
      const dropdownData = await getDropdownData(dropdownType);
      
      console.log(`✅ useDropdownData: ${dropdownType} fetched successfully:`, dropdownData);
      
      setData(dropdownData);
    } catch (err) {
      console.error(`❌ useDropdownData: Error fetching ${dropdownType}:`, err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount or when dropdownType changes
  useEffect(() => {
    if (dropdownType) {
      fetchData();
    }
  }, [dropdownType]);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch authorized by data
 * @returns {Object} { authorizedBy, loading, error, refetch }
 */
export const useAuthorizedBy = () => {
  const [authorizedBy, setAuthorizedBy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthorizedBy = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useAuthorizedBy: Fetching authorized by data...');
      
      const authorizedByData = await getAuthorizedBy();
      
      console.log('✅ useAuthorizedBy: Authorized by data fetched successfully:', authorizedByData);
      console.log('📊 useAuthorizedBy: Authorized by data length:', authorizedByData?.length);
      console.log('📊 useAuthorizedBy: Authorized by data type:', typeof authorizedByData);
      console.log('📊 useAuthorizedBy: Authorized by is array:', Array.isArray(authorizedByData));
      
      setAuthorizedBy(authorizedByData || []);
    } catch (err) {
      console.error('❌ useAuthorizedBy: Error fetching authorized by data:', err);
      setError(err.message);
      setAuthorizedBy([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch authorized by data on component mount
  useEffect(() => {
    fetchAuthorizedBy();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchAuthorizedBy();
  };

  return {
    authorizedBy,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch concession reasons data
 * @returns {Object} { concessionReasons, loading, error, refetch }
 */
export const useConcessionReasons = () => {
  const [concessionReasons, setConcessionReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConcessionReasons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useConcessionReasons: Fetching concession reasons data...');
      
      const concessionReasonsData = await getConcessionReasons();
      
      console.log('✅ useConcessionReasons: Concession reasons data fetched successfully:', concessionReasonsData);
      console.log('📊 useConcessionReasons: Concession reasons data length:', concessionReasonsData?.length);
      console.log('📊 useConcessionReasons: Concession reasons data type:', typeof concessionReasonsData);
      console.log('📊 useConcessionReasons: Concession reasons is array:', Array.isArray(concessionReasonsData));
      
      setConcessionReasons(concessionReasonsData || []);
    } catch (err) {
      console.error('❌ useConcessionReasons: Error fetching concession reasons data:', err);
      setError(err.message);
      setConcessionReasons([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch concession reasons data on component mount
  useEffect(() => {
    fetchConcessionReasons();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchConcessionReasons();
  };

  return {
    concessionReasons,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch concession types data
 * @returns {Object} { concessionTypes, loading, error, refetch }
 */
export const useConcessionTypes = () => {
  const [concessionTypes, setConcessionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConcessionTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useConcessionTypes: Fetching concession types data...');
      
      const concessionTypesData = await getConcessionTypes();
      
      console.log('✅ useConcessionTypes: Concession types data fetched successfully:', concessionTypesData);
      console.log('📊 useConcessionTypes: Concession types data length:', concessionTypesData?.length);
      console.log('📊 useConcessionTypes: Concession types data type:', typeof concessionTypesData);
      console.log('📊 useConcessionTypes: Concession types is array:', Array.isArray(concessionTypesData));
      
      setConcessionTypes(concessionTypesData || []);
    } catch (err) {
      console.error('❌ useConcessionTypes: Error fetching concession types data:', err);
      setError(err.message);
      setConcessionTypes([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch concession types data on component mount
  useEffect(() => {
    fetchConcessionTypes();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    fetchConcessionTypes();
  };

  return {
    concessionTypes,
    loading,
    error,
    refetch
  };
};

/**
 * Custom hook to fetch orientation fee for SCHOOL category
 * @param {number} orientationId - The orientation ID
 * @returns {Object} { orientationFee, loading, error, refetch }
 */
export const useOrientationFee = (orientationId) => {
  const [orientationFee, setOrientationFee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrientationFee = async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useOrientationFee: Fetching orientation fee for ID:', id);
      
      const feeData = await getOrientationFee(id);
      
      console.log('✅ useOrientationFee: Orientation fee fetched successfully:', feeData);
      
      setOrientationFee(feeData);
    } catch (err) {
      console.error('❌ useOrientationFee: Error fetching orientation fee:', err);
      setError(err.message);
      setOrientationFee(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orientation fee when orientationId changes
  useEffect(() => {
    if (orientationId) {
      fetchOrientationFee(orientationId);
    }
  }, [orientationId]);

  // Refetch function for manual refresh
  const refetch = () => {
    if (orientationId) {
      fetchOrientationFee(orientationId);
    }
  };

  return {
    orientationFee,
    loading,
    error,
    refetch
  };
};
