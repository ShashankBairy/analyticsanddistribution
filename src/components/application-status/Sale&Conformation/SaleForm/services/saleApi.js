import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Sale API service for complete sale form submission
 * Real API integration with backend
 */
export const saleApi = {
  /**
   * Get quotas from backend
   * @returns {Promise<Array>} List of quotas
   */
  async getQuotas() {
    try {
      const response = await apiClient.get('/student-admissions-sale/quotas');
      return response.data;
    } catch (error) {
      console.error('Get quotas error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quotas');
    }
  },

  /**
   * Get admission referred by options from backend
   * @returns {Promise<Array>} List of admission referred by options
   */
  async getAdmissionReferredBy() {
    try {
      const response = await apiClient.get('/student-admissions-sale/admission-referred-by');
      return response.data;
    } catch (error) {
      console.error('Get admission referred by error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch admission referred by options');
    }
  },

  /**
   * Get admission types from backend
   * @returns {Promise<Array>} List of admission types
   */
  async getAdmissionTypes() {
    try {
      const response = await apiClient.get('/student-admissions-sale/admission-types');
      return response.data;
    } catch (error) {
      console.error('Get admission types error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch admission types');
    }
  },

  /**
   * Get genders from backend
   * @returns {Promise<Array>} List of genders
   */
  async getGenders() {
    try {
      const response = await apiClient.get('/student-admissions-sale/genders');
      return response.data;
    } catch (error) {
      console.error('Get genders error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch genders');
    }
  },

  /**
   * Get authorized by options from backend
   * @returns {Promise<Array>} List of authorized by options
   */
  async getAuthorizedBy() {
    try {
      console.log('=== AUTHORIZED BY API CALL DEBUG ===');
      console.log('Making API call to: /student-admissions-sale/authorizedBy/all');
      console.log('Using timeout: 30000ms (30 seconds)');
      const response = await apiClient.get('/student-admissions-sale/authorizedBy/all', {
        timeout: 30000 // 30 seconds timeout
      });
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      console.log('API Response data type:', typeof response.data);
      console.log('API Response data length:', response.data?.length);
      console.log('=== END AUTHORIZED BY API CALL DEBUG ===');
      return response.data;
    } catch (error) {
      console.error('=== AUTHORIZED BY API ERROR ===');
      console.error('Get authorized by error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.log('=== END AUTHORIZED BY API ERROR ===');
      throw new Error(error.response?.data?.message || 'Failed to fetch authorized by options');
    }
  },

  /**
   * Submit complete sale form data
   * @param {Object} saleData - Flattened sale form data
   * @returns {Promise<Object>} API response
   */
  async submitCompleteSale(saleData) {
    try {
      const response = await apiClient.post('/student-admissions-sale/submit', saleData);
      return response.data;
    } catch (error) {
      console.error('Sale submission error:', error);
      throw new Error(error.response?.data?.message || 'Sale submission failed');
    }
  },

  /**
   * Submit individual form section (for step-by-step saving)
   * @param {string} section - Form section name
   * @param {Object} data - Form data
   * @returns {Promise<Object>} API response
   */
  async submitFormSection(section, data) {
    try {
      const response = await apiClient.post(`/student-admissions-sale/${section}`, data);
      return response.data;
    } catch (error) {
      console.error(`${section} submission error:`, error);
      throw new Error(error.response?.data?.message || `${section} submission failed`);
    }
  },

  /**
   * Validate form section
   * @param {string} section - Form section name
   * @param {Object} data - Form data
   * @returns {Promise<Object>} Validation response
   */
  async validateFormSection(section, data) {
    try {
      const response = await apiClient.post(`/student-admissions-sale/validate/${section}`, data);
      return response.data;
    } catch (error) {
      console.error(`${section} validation error:`, error);
      throw new Error(error.response?.data?.message || `${section} validation failed`);
    }
  },

  /**
   * Get student types from backend
   * @returns {Promise<Array>} List of student types
   */
  async getStudentTypes() {
    try {
      const response = await apiClient.get('/student-admissions-sale/student-types');
      return response.data;
    } catch (error) {
      console.error('Get student types error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch student types');
    }
  },

  /**
   * Get campuses by business type from backend
   * @param {string} businessType - Business type (category)
   * @returns {Promise<Array>} List of campuses
   */
  async getCampusesByCategory(businessType) {
    try {
      const response = await apiClient.get(`/application-confirmation/dropdown/campuses?businessType=${businessType}`);
      return response.data;
    } catch (error) {
      console.error('Get campuses by category error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch campuses');
    }
  },

  /**
   * Get classes by campus from backend
   * @param {number} campusId - Campus ID
   * @returns {Promise<Array>} List of classes
   */
  async getClassesByCampus(campusId) {
    try {
      const response = await apiClient.get(`/student-admissions-sale/classes/by-campus/${campusId}`);
      return response.data;
    } catch (error) {
      console.error('Get classes by campus error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch classes');
    }
  },

  /**
   * Get orientations by class and campus from backend
   * @param {number} classId - Class ID
   * @param {number} cmpsId - Campus ID
   * @returns {Promise<Array>} List of orientations
   */
  async getOrientationsByClass(classId, cmpsId) {
    try {
      const response = await apiClient.get(`/student-admissions-sale/orientations/by-class/${classId}/cmps/${cmpsId}`);
      return response.data;
    } catch (error) {
      console.error('Get orientations by class error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orientations');
    }
  },

  /**
   * Get branch details (campus type and city) from backend
   * @param {number} campusId - Campus ID
   * @returns {Promise<Object>} Branch details with campus type and city
   */
  async getBranchDetails(campusId) {
    try {
      const response = await apiClient.get(`/student-admissions-sale/city/branchtype/${campusId}`);
      return response.data;
    } catch (error) {
      console.error('Get branch details error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch branch details');
    }
  },

      /**
       * Get state and district by pincode from backend
       * @param {string} pincode - Pincode
       * @returns {Promise<Object>} State and district details
       */
      async getStateDistrictByPincode(pincode) {
        try {
          console.log('Fetching state and district for pincode:', pincode);
          const response = await apiClient.get(`/student-admissions-sale/${pincode}`);
          console.log('Pincode lookup response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Get state district by pincode error:', error);
          throw new Error(error.response?.data?.message || 'Failed to fetch state and district details');
        }
      },

      /**
       * Get mandals by district from backend
       * @param {number} districtId - District ID
       * @returns {Promise<Array>} List of mandals
       */
      async getMandalsByDistrict(districtId) {
        try {
          console.log('Fetching mandals for district ID:', districtId);
          const response = await apiClient.get(`/student-admissions-sale/mandals/${districtId}`);
          console.log('Mandals API response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Get mandals by district error:', error);
          throw new Error(error.response?.data?.message || 'Failed to fetch mandals');
        }
      },

      /**
       * Get cities by district from backend
       * @param {number} districtId - District ID
       * @returns {Promise<Array>} List of cities
       */
      async getCitiesByDistrict(districtId) {
        try {
          console.log('Fetching cities for district ID:', districtId);
          const response = await apiClient.get(`/student-admissions-sale/cities/${districtId}`);
          console.log('Cities API response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Get cities by district error:', error);
          throw new Error(error.response?.data?.message || 'Failed to fetch cities');
        }
      },

      async getOrganizations() {
        try {
          console.log('Fetching organizations');
          const response = await apiClient.get('/student-admissions-sale/organizations');
          console.log('Organizations API response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Get organizations error:', error);
          throw new Error(error.response?.data?.message || 'Failed to fetch organizations');
        }
      },

      async getBanksByOrganization(organizationId) {
        try {
          console.log('Fetching banks for organization ID:', organizationId);
          const response = await apiClient.get(`/student-admissions-sale/banks/${organizationId}`);
          console.log('Banks API response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Get banks by organization error:', error);
          throw new Error(error.response?.data?.message || 'Failed to fetch banks');
        }
      },

      async getBranchesByOrganizationAndBank(organizationId, bankId) {
        try {
          console.log('Fetching branches for organization ID:', organizationId, 'and bank ID:', bankId);
          const response = await apiClient.get(`/student-admissions-sale/branches/${organizationId}/${bankId}`);
          console.log('Branches API response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Get branches by organization and bank error:', error);
          throw new Error(error.response?.data?.message || 'Failed to fetch branches');
        }
      }
};