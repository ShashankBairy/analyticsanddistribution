import axios from 'axios';

// Base URL for confirmation APIs
const BASE_URL = 'http://localhost:8080/api/application-confirmation';

// Create axios instance with default config
const confirmationApi = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
confirmationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
confirmationApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Confirmation API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Fetch sectors dropdown data
 * @returns {Promise<Array>} Array of sector objects with id and label
 */
export const getSectors = async () => {
  try {
    console.log('🌐 Fetching sectors from:', `${BASE_URL}/dropdown/sectors`);
    
    const response = await confirmationApi.get('/dropdown/sectors');
    
    console.log('✅ Sectors API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let sectorsData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        sectorsData = response.data.data;
        console.log('📦 Found data in response.data.data:', sectorsData);
      } else if (response.data.sectors && Array.isArray(response.data.sectors)) {
        sectorsData = response.data.sectors;
        console.log('📦 Found data in response.data.sectors:', sectorsData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        sectorsData = response.data.results;
        console.log('📦 Found data in response.data.results:', sectorsData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        sectorsData = response.data.items;
        console.log('📦 Found data in response.data.items:', sectorsData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const sectors = sectorsData.map(sector => ({
      id: sector.id || sector.sectorId || sector.value,
      label: sector.label || sector.name || sector.sectorName || sector.text,
      value: sector.id || sector.sectorId || sector.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed sectors:', sectors);
    
    return sectors;
  } catch (error) {
    console.error('❌ Error fetching sectors:', error);
    throw new Error(`Failed to fetch sectors: ${error.message}`);
  }
};

/**
 * Fetch occupations dropdown data
 * @returns {Promise<Array>} Array of occupation objects with id and label
 */
export const getOccupations = async () => {
  try {
    console.log('🌐 Fetching occupations from:', `${BASE_URL}/dropdown/occupations`);
    
    const response = await confirmationApi.get('/dropdown/occupations');
    
    console.log('✅ Occupations API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let occupationsData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        occupationsData = response.data.data;
        console.log('📦 Found data in response.data.data:', occupationsData);
      } else if (response.data.occupations && Array.isArray(response.data.occupations)) {
        occupationsData = response.data.occupations;
        console.log('📦 Found data in response.data.occupations:', occupationsData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        occupationsData = response.data.results;
        console.log('📦 Found data in response.data.results:', occupationsData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        occupationsData = response.data.items;
        console.log('📦 Found data in response.data.items:', occupationsData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const occupations = occupationsData.map(occupation => ({
      id: occupation.id || occupation.occupationId || occupation.value,
      label: occupation.label || occupation.name || occupation.occupationName || occupation.text,
      value: occupation.id || occupation.occupationId || occupation.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed occupations:', occupations);
    
    return occupations;
  } catch (error) {
    console.error('❌ Error fetching occupations:', error);
    throw new Error(`Failed to fetch occupations: ${error.message}`);
  }
};

/**
 * Fetch relation types dropdown data
 * @returns {Promise<Array>} Array of relation type objects with id and label
 */
export const getRelationTypes = async () => {
  try {
    console.log('🌐 Fetching relation types from:', `http://localhost:8080/api/student-admissions-sale/relation-types`);
    
    const response = await confirmationApi.get('http://localhost:8080/api/student-admissions-sale/relation-types');
    
    console.log('✅ Relation Types API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let relationTypesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        relationTypesData = response.data.data;
        console.log('📦 Found data in response.data.data:', relationTypesData);
      } else if (response.data.relationTypes && Array.isArray(response.data.relationTypes)) {
        relationTypesData = response.data.relationTypes;
        console.log('📦 Found data in response.data.relationTypes:', relationTypesData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        relationTypesData = response.data.results;
        console.log('📦 Found data in response.data.results:', relationTypesData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        relationTypesData = response.data.items;
        console.log('📦 Found data in response.data.items:', relationTypesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const relationTypes = relationTypesData.map(relationType => ({
      id: relationType.id || relationType.relationTypeId || relationType.value,
      label: relationType.label || relationType.name || relationType.relationTypeName || relationType.text,
      value: relationType.id || relationType.relationTypeId || relationType.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed relation types:', relationTypes);
    
    return relationTypes;
  } catch (error) {
    console.error('❌ Error fetching relation types:', error);
    throw new Error(`Failed to fetch relation types: ${error.message}`);
  }
};

/**
 * Fetch student classes dropdown data
 * @returns {Promise<Array>} Array of student class objects with id and label
 */
export const getStudentClasses = async () => {
  try {
    console.log('🌐 Fetching student classes from:', `http://localhost:8080/api/student-admissions-sale/all/Studentclass`);
    
    const response = await confirmationApi.get('http://localhost:8080/api/student-admissions-sale/all/Studentclass');
    
    console.log('✅ Student Classes API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let studentClassesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        studentClassesData = response.data.data;
        console.log('📦 Found data in response.data.data:', studentClassesData);
      } else if (response.data.classes && Array.isArray(response.data.classes)) {
        studentClassesData = response.data.classes;
        console.log('📦 Found data in response.data.classes:', studentClassesData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        studentClassesData = response.data.results;
        console.log('📦 Found data in response.data.results:', studentClassesData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        studentClassesData = response.data.items;
        console.log('📦 Found data in response.data.items:', studentClassesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const studentClasses = studentClassesData.map(studentClass => ({
      id: studentClass.id || studentClass.classId || studentClass.value,
      label: studentClass.label || studentClass.name || studentClass.className || studentClass.text,
      value: studentClass.id || studentClass.classId || studentClass.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed student classes:', studentClasses);
    
    return studentClasses;
  } catch (error) {
    console.error('❌ Error fetching student classes:', error);
    throw new Error(`Failed to fetch student classes: ${error.message}`);
  }
};

/**
 * Fetch genders dropdown data
 * @returns {Promise<Array>} Array of gender objects with id and label
 */
export const getGenders = async () => {
  try {
    console.log('🌐 Fetching genders from:', `http://localhost:8080/api/student-admissions-sale/genders`);
    
    const response = await confirmationApi.get('http://localhost:8080/api/student-admissions-sale/genders');
    
    console.log('✅ Genders API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let gendersData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        gendersData = response.data.data;
        console.log('📦 Found data in response.data.data:', gendersData);
      } else if (response.data.genders && Array.isArray(response.data.genders)) {
        gendersData = response.data.genders;
        console.log('📦 Found data in response.data.genders:', gendersData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        gendersData = response.data.results;
        console.log('📦 Found data in response.data.results:', gendersData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        gendersData = response.data.items;
        console.log('📦 Found data in response.data.items:', gendersData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const genders = gendersData.map(gender => ({
      id: gender.id || gender.genderId || gender.value,
      label: gender.label || gender.name || gender.genderName || gender.text,
      value: gender.id || gender.genderId || gender.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed genders:', genders);
    
    return genders;
  } catch (error) {
    console.error('❌ Error fetching genders:', error);
    throw new Error(`Failed to fetch genders: ${error.message}`);
  }
};

/**
 * Fetch student profile details by application number
 * @param {string|number} applicationNumber - Application number to fetch details for
 * @returns {Promise<Object>} Student profile details object
 */
export const getStudentProfileDetails = async (applicationNumber) => {
  try {
    console.log('🌐 Fetching student profile details for application:', applicationNumber);
    console.log('🌐 API URL:', `http://localhost:8080/api/student-admissions-sale/details/${applicationNumber}`);
    
    const response = await confirmationApi.get(`http://localhost:8080/api/student-admissions-sale/details/${applicationNumber}`);
    
    console.log('✅ Student Profile Details API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data keys:', Object.keys(response.data || {}));
    
    // Handle different response formats
    let profileData = response.data;
    
    // If response.data is wrapped in another property
    if (!response.data || typeof response.data !== 'object') {
      console.error('❌ Invalid response data format');
      throw new Error('Invalid response data format');
    }
    
    // Check if data is nested in 'data' property (common API pattern)
    if (response.data.data && typeof response.data.data === 'object') {
      profileData = response.data.data;
      console.log('📦 Found data in response.data.data:', profileData);
    } else if (response.data.profile && typeof response.data.profile === 'object') {
      profileData = response.data.profile;
      console.log('📦 Found data in response.data.profile:', profileData);
    } else if (response.data.student && typeof response.data.student === 'object') {
      profileData = response.data.student;
      console.log('📦 Found data in response.data.student:', profileData);
    } else {
      // Use response.data directly if it's already the profile data
      profileData = response.data;
      console.log('📦 Using response.data directly:', profileData);
    }
    
    console.log('🔄 Final profile data:', profileData);
    console.log('📋 Profile data fields:', Object.keys(profileData || {}));
    
    return profileData;
  } catch (error) {
    console.error('❌ Error fetching student profile details:', error);
    throw new Error(`Failed to fetch student profile details: ${error.message}`);
  }
};

/**
 * Fetch orientations dropdown data with campus and class filters
 * @param {number} campusId - Campus ID for filtering orientations
 * @param {number} classId - Class ID for filtering orientations
 * @returns {Promise<Array>} Array of orientation objects with id and label
 */
export const getOrientations = async (campusId, classId) => {
  try {
    console.log('🌐 Fetching orientations with filters:', { campusId, classId });
    console.log('🌐 API URL:', `http://localhost:8080/api/application-confirmation/dropdown/orientations?campusId=${campusId}&classId=${classId}`);
    
    const response = await confirmationApi.get(`http://localhost:8080/api/application-confirmation/dropdown/orientations?campusId=${campusId}&classId=${classId}`);
    
    console.log('✅ Orientations API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let orientationsData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        orientationsData = response.data.data;
        console.log('📦 Found data in response.data.data:', orientationsData);
      } else if (response.data.orientations && Array.isArray(response.data.orientations)) {
        orientationsData = response.data.orientations;
        console.log('📦 Found data in response.data.orientations:', orientationsData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        orientationsData = response.data.results;
        console.log('📦 Found data in response.data.results:', orientationsData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        orientationsData = response.data.items;
        console.log('📦 Found data in response.data.items:', orientationsData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const orientations = orientationsData.map(orientation => ({
      id: orientation.id || orientation.orientationId || orientation.value,
      label: orientation.label || orientation.name || orientation.orientationName || orientation.text,
      value: orientation.id || orientation.orientationId || orientation.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed orientations:', orientations);
    
    return orientations;
  } catch (error) {
    console.error('❌ Error fetching orientations:', error);
    throw new Error(`Failed to fetch orientations: ${error.message}`);
  }
};

/**
 * Fetch batches dropdown data with orientation filter
 * @param {number} orientationId - Orientation ID for filtering batches
 * @returns {Promise<Array>} Array of batch objects with id and label
 */
export const getBatches = async (orientationId) => {
  try {
    console.log('🌐 Fetching batches with orientation filter:', { orientationId });
    console.log('🌐 API URL:', `http://localhost:8080/api/application-confirmation/dropdown/batches?orientationId=${orientationId}`);
    
    const response = await confirmationApi.get(`http://localhost:8080/api/application-confirmation/dropdown/batches?orientationId=${orientationId}`);
    
    console.log('✅ Batches API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let batchesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        batchesData = response.data.data;
        console.log('📦 Found data in response.data.data:', batchesData);
      } else if (response.data.batches && Array.isArray(response.data.batches)) {
        batchesData = response.data.batches;
        console.log('📦 Found data in response.data.batches:', batchesData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        batchesData = response.data.results;
        console.log('📦 Found data in response.data.results:', batchesData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        batchesData = response.data.items;
        console.log('📦 Found data in response.data.items:', batchesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const batches = batchesData.map(batch => ({
      id: batch.id || batch.batchId || batch.value,
      label: batch.label || batch.name || batch.batchName || batch.text,
      value: batch.id || batch.batchId || batch.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed batches:', batches);
    
    return batches;
  } catch (error) {
    console.error('❌ Error fetching batches:', error);
    throw new Error(`Failed to fetch batches: ${error.message}`);
  }
};

/**
 * Fetch states dropdown data
 * @returns {Promise<Array>} Array of state objects with id and label
 */
export const getStates = async () => {
  try {
    console.log('🌐 Fetching states from:', 'http://localhost:8080/api/application-confirmation/dropdown/states');
    
    const response = await confirmationApi.get('http://localhost:8080/api/application-confirmation/dropdown/states');
    
    console.log('✅ States API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let statesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        statesData = response.data.data;
        console.log('📦 Found data in response.data.data:', statesData);
      } else if (response.data.states && Array.isArray(response.data.states)) {
        statesData = response.data.states;
        console.log('📦 Found data in response.data.states:', statesData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        statesData = response.data.results;
        console.log('📦 Found data in response.data.results:', statesData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        statesData = response.data.items;
        console.log('📦 Found data in response.data.items:', statesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const states = statesData.map(state => ({
      id: state.id || state.stateId || state.value,
      label: state.label || state.name || state.stateName || state.text,
      value: state.id || state.stateId || state.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed states:', states);
    
    return states;
  } catch (error) {
    console.error('❌ Error fetching states:', error);
    throw new Error(`Failed to fetch states: ${error.message}`);
  }
};

/**
 * Fetch school types dropdown data
 * @returns {Promise<Array>} Array of school type objects with id and label
 */
export const getSchoolTypes = async () => {
  try {
    console.log('🌐 Fetching school types from:', 'http://localhost:8080/api/student-admissions-sale/Type_of_school');
    
    const response = await confirmationApi.get('http://localhost:8080/api/student-admissions-sale/Type_of_school');
    
    console.log('✅ School Types API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let schoolTypesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        schoolTypesData = response.data.data;
        console.log('📦 Found data in response.data.data:', schoolTypesData);
      } else if (response.data.schoolTypes && Array.isArray(response.data.schoolTypes)) {
        schoolTypesData = response.data.schoolTypes;
        console.log('📦 Found data in response.data.schoolTypes:', schoolTypesData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        schoolTypesData = response.data.results;
        console.log('📦 Found data in response.data.results:', schoolTypesData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        schoolTypesData = response.data.items;
        console.log('📦 Found data in response.data.items:', schoolTypesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const schoolTypes = schoolTypesData.map(schoolType => ({
      id: schoolType.id || schoolType.schoolTypeId || schoolType.value,
      label: schoolType.label || schoolType.name || schoolType.schoolTypeName || schoolType.text,
      value: schoolType.id || schoolType.schoolTypeId || schoolType.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed school types:', schoolTypes);
    
    return schoolTypes;
  } catch (error) {
    console.error('❌ Error fetching school types:', error);
    throw new Error(`Failed to fetch school types: ${error.message}`);
  }
};

/**
 * Fetch food types dropdown data
 * @returns {Promise<Array>} Array of food type objects with id and label
 */
export const getFoodTypes = async () => {
  try {
    console.log('🌐 Fetching food types from:', 'http://localhost:8080/api/application-confirmation/dropdown/foodtypes');
    
    const response = await confirmationApi.get('http://localhost:8080/api/application-confirmation/dropdown/foodtypes');
    
    console.log('✅ Food Types API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', response.headers);
    
    // Handle different response formats
    let foodTypesData = response.data;
    
    console.log('🔍 Raw response.data:', response.data);
    console.log('🔍 Raw response.data keys:', Object.keys(response.data || {}));
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        foodTypesData = response.data.data;
        console.log('📦 Found data in response.data.data:', foodTypesData);
      } else if (response.data.foodTypes && Array.isArray(response.data.foodTypes)) {
        foodTypesData = response.data.foodTypes;
        console.log('📦 Found data in response.data.foodTypes:', foodTypesData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        foodTypesData = response.data.results;
        console.log('📦 Found data in response.data.results:', foodTypesData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        foodTypesData = response.data.items;
        console.log('📦 Found data in response.data.items:', foodTypesData);
      } else if (response.data.foodtypes && Array.isArray(response.data.foodtypes)) {
        foodTypesData = response.data.foodtypes;
        console.log('📦 Found data in response.data.foodtypes:', foodTypesData);
      } else {
        console.error('❌ No array found in response data');
        console.error('❌ Available properties:', Object.keys(response.data || {}));
        // Return empty array instead of throwing error to prevent UI crash
        return [];
      }
    }
    
    // Transform the response to ensure we have id and label
    const foodTypes = foodTypesData.map(foodType => ({
      id: foodType.food_type_id || foodType.id || foodType.foodTypeId || foodType.value,
      label: foodType.food_type || foodType.label || foodType.name || foodType.foodTypeName || foodType.text,
      value: foodType.food_type_id || foodType.id || foodType.foodTypeId || foodType.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed food types:', foodTypes);
    console.log('📋 Transformed food types sample:', foodTypes[0]);
    
    return foodTypes;
  } catch (error) {
    console.error('❌ Error fetching food types:', error);
    throw new Error(`Failed to fetch food types: ${error.message}`);
  }
};

/**
 * Fetch blood group types dropdown data
 * @returns {Promise<Array>} Array of blood group objects with id and label
 */
export const getBloodGroupTypes = async () => {
  try {
    console.log('🌐 Fetching blood group types from:', 'http://localhost:8080/api/application-confirmation/dropdown/bloodGrouptypes');
    
    const response = await confirmationApi.get('http://localhost:8080/api/application-confirmation/dropdown/bloodGrouptypes');
    
    console.log('✅ Blood Group Types API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let bloodGroupTypesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        bloodGroupTypesData = response.data.data;
        console.log('📦 Found data in response.data.data:', bloodGroupTypesData);
      } else if (response.data.bloodGroupTypes && Array.isArray(response.data.bloodGroupTypes)) {
        bloodGroupTypesData = response.data.bloodGroupTypes;
        console.log('📦 Found data in response.data.bloodGroupTypes:', bloodGroupTypesData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        bloodGroupTypesData = response.data.results;
        console.log('📦 Found data in response.data.results:', bloodGroupTypesData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        bloodGroupTypesData = response.data.items;
        console.log('📦 Found data in response.data.items:', bloodGroupTypesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const bloodGroupTypes = bloodGroupTypesData.map(bloodGroup => ({
      id: bloodGroup.id || bloodGroup.bloodGroupId || bloodGroup.blood_group_id || bloodGroup.value,
      label: bloodGroup.label || bloodGroup.name || bloodGroup.bloodGroupName || bloodGroup.blood_group_name || bloodGroup.text,
      value: bloodGroup.id || bloodGroup.bloodGroupId || bloodGroup.blood_group_id || bloodGroup.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed blood group types:', bloodGroupTypes);
    console.log('📋 Transformed blood group types sample:', bloodGroupTypes[0]);
    
    return bloodGroupTypes;
  } catch (error) {
    console.error('❌ Error fetching blood group types:', error);
    throw new Error(`Failed to fetch blood group types: ${error.message}`);
  }
};

/**
 * Fetch castes dropdown data
 * @returns {Promise<Array>} Array of caste objects with id and label
 */
export const getCastes = async () => {
  try {
    console.log('🌐 Fetching castes from:', 'http://localhost:8080/api/student-admissions-sale/castes');
    
    const response = await confirmationApi.get('http://localhost:8080/api/student-admissions-sale/castes');
    
    console.log('✅ Castes API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let castesData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        castesData = response.data.data;
        console.log('📦 Found data in response.data.data:', castesData);
      } else if (response.data.castes && Array.isArray(response.data.castes)) {
        castesData = response.data.castes;
        console.log('📦 Found data in response.data.castes:', castesData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        castesData = response.data.results;
        console.log('📦 Found data in response.data.results:', castesData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        castesData = response.data.items;
        console.log('📦 Found data in response.data.items:', castesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const castes = castesData.map(caste => ({
      id: caste.id || caste.casteId || caste.value,
      label: caste.label || caste.name || caste.casteName || caste.text,
      value: caste.id || caste.casteId || caste.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed castes:', castes);
    
    return castes;
  } catch (error) {
    console.error('❌ Error fetching castes:', error);
    throw new Error(`Failed to fetch castes: ${error.message}`);
  }
};

/**
 * Fetch religions dropdown data
 * @returns {Promise<Array>} Array of religion objects with id and label
 */
export const getReligions = async () => {
  try {
    console.log('🌐 Fetching religions from:', 'http://localhost:8080/api/student-admissions-sale/religions');
    
    const response = await confirmationApi.get('http://localhost:8080/api/student-admissions-sale/religions');
    
    console.log('✅ Religions API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let religionsData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        religionsData = response.data.data;
        console.log('📦 Found data in response.data.data:', religionsData);
      } else if (response.data.religions && Array.isArray(response.data.religions)) {
        religionsData = response.data.religions;
        console.log('📦 Found data in response.data.religions:', religionsData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        religionsData = response.data.results;
        console.log('📦 Found data in response.data.results:', religionsData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        religionsData = response.data.items;
        console.log('📦 Found data in response.data.items:', religionsData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const religions = religionsData.map(religion => ({
      id: religion.id || religion.religionId || religion.value,
      label: religion.label || religion.name || religion.religionName || religion.text,
      value: religion.id || religion.religionId || religion.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed religions:', religions);
    
    return religions;
  } catch (error) {
    console.error('❌ Error fetching religions:', error);
    throw new Error(`Failed to fetch religions: ${error.message}`);
  }
};

/**
 * Fetch districts dropdown data with state filter
 * @param {number} stateId - State ID for filtering districts
 * @returns {Promise<Array>} Array of district objects with id and label
 */
export const getDistricts = async (stateId) => {
  try {
    console.log('🌐 Fetching districts with state filter:', { stateId });
    console.log('🌐 API URL:', `http://localhost:8080/api/student-admissions-sale/districts/${stateId}`);
    
    const response = await confirmationApi.get(`http://localhost:8080/api/student-admissions-sale/districts/${stateId}`);
    
    console.log('✅ Districts API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let districtsData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        districtsData = response.data.data;
        console.log('📦 Found data in response.data.data:', districtsData);
      } else if (response.data.districts && Array.isArray(response.data.districts)) {
        districtsData = response.data.districts;
        console.log('📦 Found data in response.data.districts:', districtsData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        districtsData = response.data.results;
        console.log('📦 Found data in response.data.results:', districtsData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        districtsData = response.data.items;
        console.log('📦 Found data in response.data.items:', districtsData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const districts = districtsData.map(district => ({
      id: district.id || district.districtId || district.value,
      label: district.label || district.name || district.districtName || district.text,
      value: district.id || district.districtId || district.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed districts:', districts);
    
    return districts;
  } catch (error) {
    console.error('❌ Error fetching districts:', error);
    throw new Error(`Failed to fetch districts: ${error.message}`);
  }
};

/**
 * Fetch orientation batch combo details
 * @param {number} orientationId - Orientation ID
 * @param {number} batchId - Batch ID
 * @returns {Promise<Object>} Combo details object with start date, end date, and fee
 */
export const getOrientationBatchComboDetails = async (orientationId, batchId) => {
  try {
    console.log('🌐 Fetching orientation batch combo details:', { orientationId, batchId });
    console.log('🌐 API URL:', `http://localhost:8080/api/application-confirmation/orientation/batch/combo/details?orientationId=${orientationId}&batchId=${batchId}`);
    
    const response = await confirmationApi.get(`http://localhost:8080/api/application-confirmation/orientation/batch/combo/details?orientationId=${orientationId}&batchId=${batchId}`);
    
    console.log('✅ Orientation Batch Combo Details API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data keys:', Object.keys(response.data || {}));
    
    // Handle different response formats
    let comboData = response.data;
    
    // If response.data is wrapped in another property
    if (!response.data || typeof response.data !== 'object') {
      console.error('❌ Invalid response data format');
      throw new Error('Invalid response data format');
    }
    
    // Check if data is nested
    if (response.data.data && typeof response.data.data === 'object') {
      comboData = response.data.data;
      console.log('📦 Found data in response.data.data:', comboData);
    } else if (response.data.details && typeof response.data.details === 'object') {
      comboData = response.data.details;
      console.log('📦 Found data in response.data.details:', comboData);
    } else if (response.data.combo && typeof response.data.combo === 'object') {
      comboData = response.data.combo;
      console.log('📦 Found data in response.data.combo:', comboData);
    } else {
      // Use response.data directly if it's already the combo data
      comboData = response.data;
      console.log('📦 Using response.data directly:', comboData);
    }
    
    console.log('🔄 Final combo data:', comboData);
    console.log('📋 Combo data fields:', Object.keys(comboData || {}));
    
    return comboData;
  } catch (error) {
    console.error('❌ Error fetching orientation batch combo details:', error);
    throw new Error(`Failed to fetch orientation batch combo details: ${error.message}`);
  }
};

/**
 * Fetch concession types data
 * @returns {Promise<Array>} Array of concession type objects with id and label
 */
export const getConcessionTypes = async () => {
  try {
    console.log('🌐 Fetching concession types from:', 'http://localhost:8080/api/student-admissions-sale/concessiontype_ids');
    
    // Test the endpoint first
    console.log('🧪 Testing endpoint availability...');
    
    // Use POST request with concession type names in body (as shown in Swagger)
    const response = await fetch('http://localhost:8080/api/student-admissions-sale/concessiontype_ids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
      },
      body: JSON.stringify(["1st year", "2nd year", "3rd year", "Admission Fee", "Tuition Fee"])
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response statusText:', response.statusText);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ API call failed:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Concession Types API Response:', data);
    console.log('📊 Raw Response Data:', JSON.stringify(data, null, 2));
    console.log('📊 Response data type:', typeof data);
    console.log('📊 Response data is array:', Array.isArray(data));
    
    // Handle different response formats
    let concessionTypesData = data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (data.data && Array.isArray(data.data)) {
        concessionTypesData = data.data;
        console.log('📦 Found data in response.data.data:', concessionTypesData);
      } else if (data.concessionTypes && Array.isArray(data.concessionTypes)) {
        concessionTypesData = data.concessionTypes;
        console.log('📦 Found data in response.data.concessionTypes:', concessionTypesData);
      } else if (data.types && Array.isArray(data.types)) {
        concessionTypesData = data.types;
        console.log('📦 Found data in response.data.types:', concessionTypesData);
      } else if (data.results && Array.isArray(data.results)) {
        concessionTypesData = data.results;
        console.log('📦 Found data in response.data.results:', concessionTypesData);
      } else if (data.items && Array.isArray(data.items)) {
        concessionTypesData = data.items;
        console.log('📦 Found data in response.data.items:', concessionTypesData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    console.log('🔄 BEFORE Transformation - Raw Data:', JSON.stringify(concessionTypesData, null, 2));
    console.log('🔄 Sample Item Before Transformation:', concessionTypesData[0]);
    
    const concessionTypes = concessionTypesData.map((type, index) => {
      const transformed = {
        id: type.concTypeId || type.id || type.concessionTypeId || type.concession_type_id || type.typeId || type.type_id || type.value,
        label: type.concType || type.label || type.name || type.concessionTypeName || type.concession_type_name || type.typeName || type.type_name || type.text,
        value: type.concTypeId || type.id || type.concessionTypeId || type.concession_type_id || type.typeId || type.type_id || type.value
      };
      console.log(`🔄 Transforming Item ${index}:`, {
        original: type,
        transformed: transformed
      });
      return transformed;
    });
    
    console.log('🔄 AFTER Transformation:', JSON.stringify(concessionTypes, null, 2));
    console.log('📋 Transformed concession types sample:', concessionTypes[0]);
    
    return concessionTypes;
  } catch (error) {
    console.error('❌ Error fetching concession types:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw new Error(`Failed to fetch concession types: ${error.message}`);
  }
};

/**
 * Fetch concession reasons dropdown data
 * @returns {Promise<Array>} Array of concession reason objects with id and label
 */
export const getConcessionReasons = async () => {
  try {
    console.log('🌐 Fetching concession reasons from:', 'http://localhost:8080/api/student-admissions-sale/concessionReson/all');
    
    const response = await confirmationApi.get('http://localhost:8080/api/student-admissions-sale/concessionReson/all');
    
    console.log('✅ Concession Reasons API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    
    // Handle different response formats
    let concessionReasonsData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        concessionReasonsData = response.data.data;
        console.log('📦 Found data in response.data.data:', concessionReasonsData);
      } else if (response.data.concessionReasons && Array.isArray(response.data.concessionReasons)) {
        concessionReasonsData = response.data.concessionReasons;
        console.log('📦 Found data in response.data.concessionReasons:', concessionReasonsData);
      } else if (response.data.reasons && Array.isArray(response.data.reasons)) {
        concessionReasonsData = response.data.reasons;
        console.log('📦 Found data in response.data.reasons:', concessionReasonsData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        concessionReasonsData = response.data.results;
        console.log('📦 Found data in response.data.results:', concessionReasonsData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        concessionReasonsData = response.data.items;
        console.log('📦 Found data in response.data.items:', concessionReasonsData);
      } else {
        console.error('❌ No array found in response data');
        throw new Error('Response data is not in expected format');
      }
    }
    
    // Transform the response to ensure we have id and label
    const concessionReasons = concessionReasonsData.map(reason => ({
      id: reason.id || reason.concessionReasonId || reason.concession_reason_id || reason.reasonId || reason.reason_id || reason.value,
      label: reason.label || reason.name || reason.concessionReasonName || reason.concession_reason_name || reason.reasonName || reason.reason_name || reason.text,
      value: reason.id || reason.concessionReasonId || reason.concession_reason_id || reason.reasonId || reason.reason_id || reason.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed concession reasons:', concessionReasons);
    console.log('📋 Transformed concession reasons sample:', concessionReasons[0]);
    
    return concessionReasons;
  } catch (error) {
    console.error('❌ Error fetching concession reasons:', error);
    throw new Error(`Failed to fetch concession reasons: ${error.message}`);
  }
};

/**
 * Fetch authorized by dropdown data
 * @returns {Promise<Array>} Array of authorized by objects with id and label
 */
export const getAuthorizedBy = async () => {
  try {
    console.log('🌐 Fetching authorized by from:', 'http://localhost:8080/api/student-admissions-sale/authorizedBy/all');
    
    const response = await confirmationApi.get('http://localhost:8080/api/student-admissions-sale/authorizedBy/all');
    
    console.log('✅ Authorized By API Response:', response.data);
    console.log('📊 Response data type:', typeof response.data);
    console.log('📊 Response data is array:', Array.isArray(response.data));
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', response.headers);
    
    // Handle different response formats
    let authorizedByData = response.data;
    
    // If response.data is not an array, check if it's wrapped in another property
    if (!Array.isArray(response.data)) {
      console.log('🔍 Response is not an array, checking for nested data...');
      console.log('🔍 Available properties:', Object.keys(response.data || {}));
      
      // Check common wrapper properties
      if (response.data.data && Array.isArray(response.data.data)) {
        authorizedByData = response.data.data;
        console.log('📦 Found data in response.data.data:', authorizedByData);
      } else if (response.data.authorizedBy && Array.isArray(response.data.authorizedBy)) {
        authorizedByData = response.data.authorizedBy;
        console.log('📦 Found data in response.data.authorizedBy:', authorizedByData);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        authorizedByData = response.data.results;
        console.log('📦 Found data in response.data.results:', authorizedByData);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        authorizedByData = response.data.items;
        console.log('📦 Found data in response.data.items:', authorizedByData);
      } else {
        console.error('❌ No array found in response data');
        console.error('❌ Available properties:', Object.keys(response.data || {}));
        // Return empty array instead of throwing error to prevent UI crash
        return [];
      }
    }
    
    // Transform the response to ensure we have id and label
    const authorizedBy = authorizedByData.map(auth => ({
      id: auth.id || auth.authorizedById || auth.authorized_by_id || auth.emp_id || auth.empId || auth.value,
      label: auth.label || auth.name || auth.authorizedByName || auth.authorized_by_name || auth.emp_name || auth.employeeName || auth.text,
      value: auth.id || auth.authorizedById || auth.authorized_by_id || auth.emp_id || auth.empId || auth.value // For backward compatibility
    }));
    
    console.log('🔄 Transformed authorized by:', authorizedBy);
    console.log('📋 Transformed authorized by sample:', authorizedBy[0]);
    
    return authorizedBy;
  } catch (error) {
    console.error('❌ Error fetching authorized by:', error);
    console.error('❌ Error details:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    throw new Error(`Failed to fetch authorized by: ${error.message}`);
  }
};

/**
 * Fetch other dropdown data (if needed in future)
 * @param {string} dropdownType - Type of dropdown to fetch
 * @returns {Promise<Array>} Array of dropdown objects
 */
export const getDropdownData = async (dropdownType) => {
  try {
    console.log(`🌐 Fetching ${dropdownType} from:`, `${BASE_URL}/dropdown/${dropdownType}`);
    
    const response = await confirmationApi.get(`/dropdown/${dropdownType}`);
    
    console.log(`✅ ${dropdownType} API Response:`, response.data);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${dropdownType}:`, error);
    throw new Error(`Failed to fetch ${dropdownType}: ${error.message}`);
  }
};

/**
 * Fetch orientation fee for SCHOOL category
 * @param {number} orientationId - The orientation ID
 * @returns {Promise<Object>} Object containing fee information
 */
export const getOrientationFee = async (orientationId) => {
  try {
    console.log('🌐 Fetching orientation fee from:', `${BASE_URL}/orientation-fee?orientationId=${orientationId}`);
    
    const response = await confirmationApi.get(`/orientation-fee?orientationId=${orientationId}`);
    
    console.log('✅ Orientation Fee API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching orientation fee:', error);
    throw error;
  }
};

export default confirmationApi;
