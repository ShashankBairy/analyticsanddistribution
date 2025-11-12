import { useState, useEffect } from 'react';
import { saleApi } from '../../services/saleApi';

export const useDropdownData = () => {
  const [quotaOptions, setQuotaOptions] = useState([]);
  const [admissionReferredByOptions, setAdmissionReferredByOptions] = useState([]);
  const [admissionTypeOptions, setAdmissionTypeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [authorizedByOptions, setAuthorizedByOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDropdownData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch quotas first (this is working)
      let quotas = [];
      let admissionReferredBy = [];
      let admissionTypes = [];
      let genders = [];
      let authorizedBy = [];

      try {
        quotas = await saleApi.getQuotas();
      } catch (err) {
        console.error('Error fetching quotas:', err);
      }

      // Try to fetch admission referred by (this is failing with 500)
      try {
        admissionReferredBy = await saleApi.getAdmissionReferredBy();
      } catch (err) {
        console.error('Error fetching admission referred by:', err);
        // Use empty array as fallback
        admissionReferredBy = [];
      }

      // Try to fetch admission types
      try {
        console.log('🔍 Fetching admission types...');
        admissionTypes = await saleApi.getAdmissionTypes();
        console.log('🔍 Admission types API response:', admissionTypes);
        console.log('🔍 Admission types type:', typeof admissionTypes);
        console.log('🔍 Admission types is array:', Array.isArray(admissionTypes));
        console.log('🔍 Admission types length:', admissionTypes?.length);
      } catch (err) {
        console.error('❌ Error fetching admission types:', err);
        console.error('❌ Error details:', err.response?.data);
        // Use empty array as fallback
        admissionTypes = [];
      }

      // Try to fetch genders
      try {
        genders = await saleApi.getGenders();
      } catch (err) {
        console.error('Error fetching genders:', err);
        // Use empty array as fallback
        genders = [];
      }

      // Try to fetch authorized by options with retry logic
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          authorizedBy = await saleApi.getAuthorizedBy();
          break; // Success, exit retry loop
        } catch (err) {
          console.error(`Attempt ${retryCount + 1} failed:`, err);
          
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            retryCount++;
          } else {
            authorizedBy = [];
            break;
          }
        }
      }

      // Transform the data to match your dropdown format
      const transformedQuotas = quotas.map(item => ({
        value: item.quota_id || item.id,
        label: item.quota_name || item.name || item.quotaName || item.title
      }));

      const transformedAdmissionReferredBy = admissionReferredBy.map(item => ({
        value: item.emp_id || item.id,
        label: item.emp_name || item.name || item.employeeName || item.title
      }));

      const transformedAdmissionTypes = admissionTypes.map(item => ({
        value: item.adms_type_id || item.id,
        label: item.adms_type_name || item.name || item.typeName || item.title
      }));

      console.log('🔍 Transformed admission types:', transformedAdmissionTypes);
      console.log('🔍 Transformed admission types length:', transformedAdmissionTypes.length);
      
      // Fallback: If no admission types were fetched, use hardcoded values
      if (transformedAdmissionTypes.length === 0) {
        console.log('⚠️ No admission types from API, using fallback values');
        transformedAdmissionTypes.push(
          { value: '1', label: 'Direct walkin' },
          { value: '2', label: 'with pro' },
          { value: '3', label: 'Regular' },
          { value: '4', label: 'Lateral' }
        );
        console.log('🔍 Using fallback admission types:', transformedAdmissionTypes);
      }


      const transformedGenders = genders.map(item => ({
        value: item.gender_id || item.id,
        label: item.gender_name || item.name || item.genderName || item.title
      }));

      
      const transformedAuthorizedBy = authorizedBy.map(item => {
        const id = item.emp_id || item.id;
        const name = item.emp_name || item.name || item.employeeName || item.title;
        return {
          value: id,
          label: name && id != null ? `${name} - ${id}` : (name || String(id || ''))
        };
      });


      
      setQuotaOptions(transformedQuotas);
      setAdmissionReferredByOptions(transformedAdmissionReferredBy);
      setAdmissionTypeOptions(transformedAdmissionTypes);
      setGenderOptions(transformedGenders);
      setAuthorizedByOptions(transformedAuthorizedBy);

    } catch (err) {
      console.error('Error fetching dropdown data:', err);
      setError(err.message);
      
      // Fallback to empty arrays or default options
      setQuotaOptions([]);
      setAdmissionReferredByOptions([]);
      setAdmissionTypeOptions([]);
      setGenderOptions([]);
      setAuthorizedByOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);


  return {
    quotaOptions,
    admissionReferredByOptions,
    admissionTypeOptions,
    genderOptions,
    authorizedByOptions,
    loading,
    error,
    refetch: fetchDropdownData
  };
};
