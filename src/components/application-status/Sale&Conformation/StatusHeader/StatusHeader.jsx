import React, { useState, useEffect } from "react";
import styles from "./StatusHeader.module.css";

const StatusHeader = ({ applicationNo, campusName, zoneName, academicYear, applicationFee, category, onDataFetched }) => {
  const DEBUG = false;
  DEBUG && console.log('🚀 ===== STATUS HEADER COMPONENT RENDERED ===== 🚀');
  DEBUG && console.log('📋 StatusHeader Props:', { applicationNo, campusName, zoneName, academicYear, applicationFee, category });
 
  const [fetchedData, setFetchedData] = useState({
    campusName: campusName || "-",
    zoneName: zoneName || "-",
    academicYear: academicYear || "-",
    academicYearId: null, // Store the ID as well
    applicationFee: applicationFee || "-"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Unified API service function
  const fetchApplicationData = async (applicationNo) => {
    try {
      const url = `http://localhost:8080/api/student-admissions-sale/by-application-no/${applicationNo}?appNo=${applicationNo}`;
      console.log('🌐 Making UNIFIED API request to:', url);
     
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
     
      if (!response.ok) {
        // Log the error response details
        console.log('❌ API Error Response Details:');
        console.log('❌ Status:', response.status);
        console.log('❌ Status Text:', response.statusText);
        console.log('❌ Headers:', Object.fromEntries(response.headers.entries()));
       
        // Try to get error response body
        try {
          const errorText = await response.text();
          console.log('❌ Error Response Body:', errorText);
        } catch (e) {
          console.log('❌ Could not read error response body:', e.message);
        }
       
        throw new Error(`HTTP error! status: ${response.status}`);
      }
     
      // Check if response has content
      const contentType = response.headers.get('content-type');
      console.log('📡 UNIFIED API Response Status:', response.status);
      console.log('📡 UNIFIED API Response Content-Type:', contentType);
      console.log('📡 UNIFIED API Response Headers:', Object.fromEntries(response.headers.entries()));
     
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, get as text
        const textResponse = await response.text();
        console.log('📄 UNIFIED API Non-JSON Response Text:', textResponse);
        console.log('📄 UNIFIED API Response Length:', textResponse.length);
       
        // Return empty data if no content
        if (!textResponse || textResponse.trim() === '') {
          console.log('⚠️ UNIFIED API returned empty response');
          return {};
        }
       
        // Try to parse as JSON if it looks like JSON
        try {
          const parsedData = JSON.parse(textResponse);
          console.log('🎯 UNIFIED API SUCCESS - Parsed from Text:', parsedData);
          return parsedData;
        } catch (parseError) {
          console.warn('❌ Could not parse UNIFIED response as JSON:', textResponse);
          console.warn('❌ Parse Error:', parseError.message);
          return {};
        }
      }
     
      const data = await response.json();
     
      // === BACKEND DATA CONSOLE LOGS ===
      console.log('🚀 ===== BACKEND API RESPONSE START ===== 🚀');
      console.log('📡 API URL:', url);
      console.log('📡 Response Status:', response.status);
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
     
      // === MAIN BACKEND OBJECT DISPLAY ===
      console.log('🎯 ===== BACKEND OBJECT FROM API ===== 🎯');
      console.log('📦 Complete Backend Response Object:', data);
      console.log('📦 Backend Object Type:', typeof data);
      console.log('📦 Backend Object Keys:', Object.keys(data));
      console.log('📦 Backend Object Values:', Object.values(data));
     
      // Display the nested data object if it exists
      if (data.data) {
        console.log('📦 ===== NESTED DATA OBJECT ===== 📦');
        console.log('📦 Nested Data Object:', data.data);
        console.log('📦 Nested Data Type:', typeof data.data);
        console.log('📦 Nested Data Keys:', Object.keys(data.data));
        console.log('📦 Nested Data Values:', Object.values(data.data));
        console.log('📦 ===== END NESTED DATA OBJECT ===== 📦');
      }
     
      console.log('🎯 ===== END BACKEND OBJECT FROM API ===== 🎯');
     
      // Legacy logs for compatibility
      console.log('📡 Raw Response Data:', data);
      console.log('📡 Response Data Type:', typeof data);
      console.log('📡 Response Data Keys:', Object.keys(data));
      console.log('📡 Response Data Values:', Object.values(data));
     
      // Extract specific fields for easy viewing
      console.log('📡 === EXTRACTED FIELD VALUES ===');
      console.log('📡 Campus Name:', data.data?.campusName || data.campusName);
      console.log('📡 Zone Name:', data.data?.zoneName || data.zoneName);
      console.log('📡 Academic Year:', data.data?.academicYear || data.academicYear);
      console.log('📡 Academic Year ID:', data.data?.academicYearId || data.academicYearId);
      console.log('📡 Application Fee:', data.data?.applicationFee || data.applicationFee);
      console.log('📡 Campus ID:', data.data?.campusId || data.campusId);
      console.log('📡 Zone ID:', data.data?.zoneId || data.zoneId);
      console.log('📡 ===== BACKEND API RESPONSE END =====');
     
      // Extract data from the response structure
      const extractedData = data.data || data;
      console.log('📡 Final Extracted Data:', extractedData);
      return extractedData;
    } catch (error) {
      console.error('Error fetching application data:', error);
      throw error;
    }
  };

  // Fetch data using unified API when applicationNo changes
  useEffect(() => {
    console.log('🔄 StatusHeader useEffect - applicationNo:', applicationNo);
   
    const fetchData = async (retryCount = 0) => {
      console.log('🔥 StatusHeader fetchData - applicationNo:', applicationNo);
     
      if (!applicationNo) return;
     
      const maxRetries = 2;
     
      console.log('🚀 === STATUS HEADER UNIFIED API CALL STARTED === 🚀');
      console.log('📋 Application No:', applicationNo);
      console.log('📋 Application No Type:', typeof applicationNo);
      console.log('📋 Application No Length:', applicationNo ? applicationNo.length : 'N/A');
      console.log('📋 Category:', category);
      console.log('📋 Props Data:', { campusName, zoneName, academicYear, applicationFee });
     
      setLoading(true);
      setError(null);
     
      try {
        let data = {};
        let apiSuccess = false;
       
        console.log('🌐 Calling UNIFIED API...');
        try {
          data = await fetchApplicationData(applicationNo);
          apiSuccess = true;
         
          // === MAIN BACKEND OBJECT DISPLAY IN useEffect ===
          console.log('🎯 ===== BACKEND OBJECT RECEIVED IN useEffect ===== 🎯');
          console.log('📦 Backend Object from API:', data);
          console.log('📦 Backend Object Type:', typeof data);
          console.log('📦 Backend Object Keys:', Object.keys(data));
          console.log('📦 Backend Object Values:', Object.values(data));
         
          // Display nested data if it exists
          if (data.data) {
            console.log('📦 Nested Data Object:', data.data);
            console.log('📦 Nested Data Keys:', Object.keys(data.data));
            console.log('📦 Nested Data Values:', Object.values(data.data));
          }
          console.log('🎯 ===== END BACKEND OBJECT IN useEffect ===== 🎯');
         
          console.log('✅ API Success - Extracted Data:', data);
          console.log('✅ API Success - Data Type:', typeof data);
          console.log('✅ API Success - Data Keys:', Object.keys(data));
          console.log('✅ API Success - Data Values:', Object.values(data));
        } catch (apiError) {
          console.warn('⚠️ UNIFIED API failed, trying fallback:', apiError.message);
          console.warn('⚠️ API Error Details:', {
            message: apiError.message,
            stack: apiError.stack,
            name: apiError.name
          });
          data = {};
        }
       
        console.log('📊 API Call Status:', apiSuccess ? 'SUCCESS' : 'FAILED - Using Fallback');
        console.log('📊 Raw Backend Data:', data);
        console.log('📊 Raw Backend Data Type:', typeof data);
        console.log('📊 Raw Backend Data Length:', data ? Object.keys(data).length : 'N/A');
        console.log('🔍 Raw Data Structure Check:', {
          hasData: !!data,
          hasDataProperty: !!data?.data,
          dataKeys: data ? Object.keys(data) : [],
          dataDataKeys: data?.data ? Object.keys(data.data) : []
        });
       
        // Log each field individually for better debugging
        console.log('🔍 === INDIVIDUAL FIELD ANALYSIS === 🔍');
        console.log('🏫 Campus Name Fields:', {
          'data.campusName': data.campusName,
          'data.campus': data.campus,
          'props.campusName': campusName
        });
        console.log('🌍 Zone Name Fields:', {
          'data.zoneName': data.zoneName,
          'data.zone': data.zone,
          'props.zoneName': zoneName
        });
        console.log('📅 Academic Year Fields:', {
          'data.academicYear': data.academicYear,
          'data.academicYearId': data.academicYearId,
          'data.year': data.year,
          'props.academicYear': academicYear
        });
        console.log('💰 Application Fee Fields:', {
          'data.applicationFee': data.applicationFee,
          'data.fee': data.fee,
          'props.applicationFee': applicationFee
        });
       
        // Process only actual API data - no localStorage fallback
        console.log('🔍 Processing Data - Before Extraction:', {
          'data.academicYear': data.academicYear,
          'data.applicationFee': data.applicationFee,
          'props.academicYear': academicYear,
          'props.applicationFee': applicationFee,
          'API Success': apiSuccess,
          'Data Object': data
        });
       
        // Extract payment amount - check multiple possible locations for sold applications
        // Priority: paymentDetails.amount > paymentDetails[0].amount (array) > amount > totalAmount
        let paymentAmount;
        if (data.paymentDetails) {
          // Check if paymentDetails is an array
          if (Array.isArray(data.paymentDetails) && data.paymentDetails.length > 0) {
            paymentAmount = data.paymentDetails[0]?.amount || data.paymentDetails[0]?.paymentAmount;
          } else if (data.paymentDetails.amount) {
            // paymentDetails is an object with amount
            paymentAmount = data.paymentDetails.amount;
          }
        }
        // Fallback to top-level fields
        if (!paymentAmount) {
          paymentAmount = data.amount != null ? data.amount :
                         (data.totalAmount != null ? data.totalAmount :
                         (data.paymentAmount != null ? data.paymentAmount : undefined));
        }
       
        console.log('💰 Payment Amount Extraction:', {
          'data.paymentDetails': data.paymentDetails,
          'paymentDetails.type': Array.isArray(data.paymentDetails) ? 'array' : typeof data.paymentDetails,
          'extractedPaymentAmount': paymentAmount,
          'data.amount': data.amount,
          'data.totalAmount': data.totalAmount
        });

        const processedData = {
          campusName: data.campusName || data.campus || campusName || "-",
          zoneName: data.zoneName || data.zone || zoneName || "-",
          academicYear: data.academicYear || data.year || academicYear || "-",
          academicYearId: data.academicYearId || null,
          applicationFee: data.applicationFee || data.fee || applicationFee || "-",
          amount: paymentAmount
        };

        // Compute combined total if both values are present
        const appFeeNum = Number(processedData.applicationFee) || 0;
        const amountNum = Number(processedData.amount) || 0;
        processedData.totalAmountDue = appFeeNum + amountNum;
       
        // === FINAL PROCESSED DATA DISPLAY ===
        console.log('🎯 ===== FINAL PROCESSED DATA FOR DISPLAY ===== 🎯');
        console.log('📦 Processed Data Object:', processedData);
        console.log('📦 Processed Data Type:', typeof processedData);
        console.log('📦 Processed Data Keys:', Object.keys(processedData));
        console.log('📦 Processed Data Values:', Object.values(processedData));
        console.log('🎯 ===== END FINAL PROCESSED DATA ===== 🎯');
       
        console.log('🔍 Processing Data - After Processing:', {
          'processedData.academicYear': processedData.academicYear,
          'processedData.applicationFee': processedData.applicationFee
        });
       
        console.log('🔄 Processed Data for Display:', processedData);
        console.log('📋 Data Mapping Logic:', {
          'campusName': `${processedData.campusName} (from: ${data.campusName ? 'data.campusName' : data.campus ? 'data.campus' : campusName ? 'props.campusName' : 'default'})`,
          'zoneName': `${processedData.zoneName} (from: ${data.zoneName ? 'data.zoneName' : data.zone ? 'data.zone' : zoneName ? 'props.zoneName' : 'default'})`,
          'academicYear': `${processedData.academicYear} (from: ${data.academicYear ? 'data.academicYear' : data.year ? 'data.year' : academicYear ? 'props.academicYear' : 'default'})`,
          'applicationFee': `${processedData.applicationFee} (from: ${data.applicationFee ? 'data.applicationFee' : data.fee ? 'data.fee' : applicationFee ? 'props.applicationFee' : 'default'})`
        });
       
        // Don't save to localStorage - only show actual API data
        console.log('📊 API Data Only - No localStorage caching');
       
        setFetchedData(processedData);
       
        // Call the callback to pass data back to parent component
        if (onDataFetched && typeof onDataFetched === 'function') {
          onDataFetched(processedData);
        }
       
        console.log('🎯 === STATUS HEADER API CALL COMPLETED === 🎯');
        console.log('📋 === FINAL STATE SUMMARY === 📋');
        console.log('🎯 Final Display Values:', {
          'Academic Year': processedData.academicYear,
          'Application No': applicationNo,
          'Branch (Campus)': processedData.campusName,
          'Zone': processedData.zoneName,
          'Application Fee': processedData.applicationFee,
          'Amount': processedData.amount,
          'Total Amount Due': processedData.totalAmountDue
        });
       
        // === BACKEND DATA SUMMARY ===
        console.log('📊 === BACKEND DATA SUMMARY === 📊');
        console.log('📊 Backend API URL:', `http://localhost:8080/api/student-admissions-sale/by-application-no/${applicationNo}`);
        console.log('📊 Backend Response Status:', apiSuccess ? 'SUCCESS' : 'FAILED');
        console.log('📊 Backend Data Received:', data);
        console.log('📊 Backend Data Fields:', {
          'campusName': data.campusName,
          'zoneName': data.zoneName,
          'academicYear': data.academicYear,
          'academicYearId': data.academicYearId,
          'applicationFee': data.applicationFee,
          'campusId': data.campusId,
          'zoneId': data.zoneId
        });
        console.log('📊 Frontend Display Values:', processedData);
        console.log('📊 === BACKEND DATA CONSOLE LOGGING COMPLETE === 📊');
       
        // Clear any previous errors if successful
        setError(null);
      } catch (err) {
        console.warn(`⚠️ StatusHeader: API call failed (attempt ${retryCount + 1}/${maxRetries + 1})`);
        console.warn('⚠️ Error details:', err.message);
       
        // Retry logic
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying API call in 1 second... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            fetchData(retryCount + 1);
          }, 1000);
          return;
        }
       
        // After max retries, use only props data - no localStorage fallback
        console.log('🔄 Max retries reached, using props data only');
        const fallbackData = {
          campusName: campusName || "-",
          zoneName: zoneName || "-",
          academicYear: academicYear || "-",
          academicYearId: null,
          applicationFee: applicationFee || "-"
        };
       
        console.log('🔄 Using Fallback Data:', fallbackData);
        setFetchedData(fallbackData);
        setError(null); // Don't show error to user, just use fallback
      } finally {
        if (retryCount === 0) { // Only set loading false on first attempt
          setLoading(false);
        }
      }
    };

    console.log('🚀 ===== CALLING fetchData() ===== 🚀');
    console.log('🚀 About to call fetchData with applicationNo:', applicationNo);
    fetchData();
  }, [applicationNo]); // Removed category dependency since we use unified API

  const headerItems = [
    { label: "Academic Year", value: fetchedData.academicYear },
    { label: "Application No", value: applicationNo || "-" },
    { label: "Branch", value: fetchedData.campusName },
    { label: "Zone", value: fetchedData.zoneName },
    { label: "Application Fee", value: fetchedData.applicationFee },
  ];

  console.log('🎨 ===== STATUS HEADER RENDERING UI ===== 🎨');
  console.log('🎨 Header Items:', headerItems);
  console.log('🎨 Loading State:', loading);
  console.log('🎨 Error State:', error);
  console.log('🎨 Fetched Data:', fetchedData);

  return (
    <div className={styles.status_info_header}>
      <div className={styles.status_text_header}>
        {headerItems.map((item) => (
          <div key={item.label} className={styles.status_info_item}>
            <div className={styles.status_label}>{item.label}</div>
            <div className={styles.status_value}>
              {loading ? "Loading..." : item.value}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className={styles.error_message}>
          Error loading data: {error}
        </div>
      )}
    </div>
  );
};

export default StatusHeader;
