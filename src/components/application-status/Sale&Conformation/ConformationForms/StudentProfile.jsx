import React, { useState } from 'react'; // Import useState
import { Formik } from 'formik';
import { useStudentProfile } from './hooks/useConfirmationData';
import styles from './StudentProfile.module.css';
import ProfilePhoto from '../SaleForm/PersonalInfo/components/ProfilePhoto';
 
// Reusable component for each label-value pair
const InfoField = ({ label, value }) => (
  <div className={styles.infoField}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);
 
const StudentProfile = ({ applicationNumber, onProfileDataReceived }) => {
  const [isHovered, setIsHovered] = useState(false); // New state for hover
  
  // Fetch student profile data using the hook
  const { profileData, loading, error } = useStudentProfile(applicationNumber);

  // Call the callback when profile data is loaded
  React.useEffect(() => {
    if (profileData && onProfileDataReceived) {
      console.log('📤 Sending profile data to parent:', profileData);
      onProfileDataReceived(profileData);
    }
  }, [profileData, onProfileDataReceived]);

  // Helper function to safely get values from profile data
  const getValue = (fieldName, fallback = "-") => {
    if (!profileData) return fallback;
    
    // Handle nested objects
    if (fieldName === 'fatherName') {
      return profileData.parentInfo?.fatherName || fallback;
    }
    if (fieldName === 'fatherMobileNo') {
      return profileData.parentInfo?.phoneNumber || fallback;
    }
    
    // Handle address details
    if (['doorNo', 'street', 'landmark', 'area', 'pincode', 'district', 'mandal', 'city'].includes(fieldName)) {
      return profileData.addressDetails?.[fieldName] || profileData.addressDetails?.[fieldName + 'Name'] || fallback;
    }
    
    // Handle fields with Name suffix
    const nameField = fieldName + 'Name';
    if (profileData[nameField]) {
      return profileData[nameField];
    }
    
    // Handle specific field mappings
    const fieldMappings = {
      'gender': 'genderName',
      'quota': 'quotaName',
      'academicYear': 'academicYearValue',
      'branch': 'branchName',
      'studentType': 'studentTypeName',
      'joiningClass': 'joiningClassName',
      'orientation': 'orientationName',
      'branchType': 'branchTypeName',
      'admissionType': 'admissionTypeName',
      'district': 'addressDetails.districtName',
      'mandal': 'addressDetails.mandalName',
      'city': 'addressDetails.cityName'
    };
    
    if (fieldMappings[fieldName]) {
      const mapping = fieldMappings[fieldName];
      if (mapping.includes('.')) {
        const [parent, child] = mapping.split('.');
        return profileData[parent]?.[child] || fallback;
      }
      return profileData[mapping] || fallback;
    }
    
    // Direct field access
    return profileData[fieldName] || fallback;
  };

  // Debug logging
  console.log('🔍 StudentProfile Debug:', {
    applicationNumber,
    profileData,
    loading,
    error,
    profileDataKeys: profileData ? Object.keys(profileData) : []
  });

  // Show loading state
  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div>Loading student profile...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.profileContainer}>
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#dc2626'
        }}>
          ⚠️ Error loading student profile: {error}
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        profilePhoto: null
      }}
      onSubmit={(values) => {
        console.log('Profile form submitted:', values);
      }}
    >
      {({ values, setFieldValue, touched, errors }) => (
        <div className={styles.profileContainer}>
      {/* Top section: Profile Pic + Personal Info */}
      <div className={styles.headerSection}>
        <ProfilePhoto touched={touched} errors={errors} viewOnly={true} />
 
        <div className={styles.personalInfo}>
        <div className={styles.label_wrapper}>
    <span className={styles.sectionHeader}>Personal Information</span>
    <div className={styles.dividerLine}></div>
  </div>
          <div className={`${styles.grid} ${styles.gridCols4}`}>
            <InfoField label="First Name" value={getValue('firstName')} />
            <InfoField label="Last Name" value={getValue('lastName')} />
            <InfoField label="Gender" value={getValue('gender')} />
            <InfoField label="Aapar No" value={getValue('apaarNo')} />
            <InfoField label="Date of Birth" value={getValue('dob')} />
            <InfoField label="Admission Referred by" value={getValue('admissionReferedBy')} />
            <InfoField label="Quota" value={getValue('quota')} />
            <InfoField label="Aadhar Card No" value={getValue('aadharCardNo')} />
            <InfoField label="PRO Receipt No" value={getValue('proReceiptNo')} />
          </div>
        </div>
      </div>
{/* --- Parent Information --- */}
<div className={styles.infoSection}>
  <div className={styles.label_wrapper}>
    <span className={styles.sectionHeader}>Parent Information</span>
    <div className={styles.dividerLine}></div>
  </div>
  <div className={`${styles.grid} ${styles.gridCols2}`}>
    <InfoField label="Father Name" value={getValue('fatherName')} />
    <InfoField label="Phone Number" value={getValue('fatherMobileNo')} />
  </div>
</div>
 
{/* --- Orientation Information --- */}
<div className={styles.infoSection}>
  <div className={styles.label_wrapper}>
    <span className={styles.sectionHeader}>Orientation Information</span>
    <div className={styles.dividerLine}></div>
  </div>
  <div className={`${styles.grid} ${styles.gridCols4}`}>
    <InfoField label="Academic Year" value={getValue('academicYear')} />
    <InfoField label="Branch" value={getValue('branch')} />
    <InfoField label="Student Type" value={getValue('studentType')} />
    <InfoField label="Joining Class" value={getValue('joiningClass')} />
    <InfoField label="Orientation Name" value={getValue('orientation')} />
    <InfoField label="City" value={getValue('city')} />
    <InfoField label="Branch Type" value={getValue('branchType')} />
    <InfoField label="Admission Type" value={getValue('admissionType')} />
  </div>
</div>
 
{/* --- Address Information --- */}
<div className={styles.infoSection}>
  <div className={styles.label_wrapper}>
    <span className={styles.General_Info_Section_general_field_label}>Address Information</span>
    <div className={styles.General_Info_Section_general_line}></div>
  </div>
  <div className={`${styles.grid} ${styles.gridCols4}`}>
    <InfoField label="Door No" value={getValue('doorNo')} />
    <InfoField label="Street" value={getValue('street')} />
    <InfoField label="Landmark" value={getValue('landmark')} />
    <InfoField label="Area" value={getValue('area')} />
    <InfoField label="Pincode" value={getValue('pincode')} />
    <InfoField label="District" value={getValue('district')} />
    <InfoField label="Mandal" value={getValue('mandal')} />
    <InfoField label="City" value={getValue('city')} />
    <InfoField label="G-pin" value={getValue('gpin')} />
  </div>
  </div>
 
        </div>
      )}
    </Formik>
  );
};
 
export default StudentProfile;