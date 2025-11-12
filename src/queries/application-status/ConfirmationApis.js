// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api';

// export const getOrientations = async (campusId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/campus/${campusId}/getorientation`);
//     return response.data; // Expected: [{ id: 1934, name: "LONG TERM LEO RES" }, ...]
//   } catch (error) {
//     console.error('Error fetching orientations:', error);
//     throw error;
//   }
// };

// export const getStreams = async (orientationId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/orientation/${orientationId}/getstreams`);
//     return response.data; // Expected: [{ id: 3, name: "leo" }, ...]
//   } catch (error) {
//     console.error('Error fetching streams:', error);
//     throw error;
//   }
// };

// export const getJoinYears = async () => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/application-confirmation/dropdownforjoinyear`,
//       { headers: { "Content-Type": "application/json" } }
//     );
//     return response.data; // { default: {...}, options: [...] }
//   } catch (error) {
//     console.error("Error fetching join years:", {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//     });
//     throw error;
//   }
// };

// export const getProgramsByOrientation = async (orientationId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/orientation/${orientationId}/programs`);
//     return response.data; // Expected: [{ id: 13, name: "Sr_ICON_IPL_IC" }, ...]
//   } catch (error) {
//     console.error('Error fetching programs by orientation:', error);
//     throw error;
//   }
// };

// export const getExamProgramsByProgram = async (programId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/program/${programId}/exam-programs`);
//     return response.data; // Expected: [{ id: 8, name: "Jr_ICON_ISB" }, ...]
//   } catch (error) {
//     console.error('Error fetching exam programs by program:', error);
//     throw error;
//   }
// };

// export const getBatchesByOrientation = async (orientationId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/orientation/${orientationId}/batches`);
//     return response.data; // Expected: [{ batchId: number, name: string }, ...]
//   } catch (error) {
//     console.error('Error fetching batches by orientation:', error);
//     throw error;
//   }
// };

// export const getBatchDetails = async (batchId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/${batchId}/details`);
//     return response.data; // Expected: { startDate: string, endDate: string, fee: number }
//   } catch (error) {
//     console.error('Error fetching batch details:', error);
//     throw error;
//   }
// };

// export const getSectionsByBatch = async (batchId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/by-id/${batchId}/sections`);
//     return response.data; // Expected: [{ id: 4011, name: "Jr_ICON_IPL_IC_BATCH1_2" }, ...]
//   } catch (error) {
//     console.error('Error fetching sections by batch:', error);
//     throw error;
//   }
// };

// export const getLanguages = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/getalllanguages`);
//     return response.data; // Expected: [{ lang_id: 1, lang_name: "English" }, ...]
//   } catch (error) {
//     console.error('Error fetching languages:', error);
//     throw error;
//   }
// };

// export const getConcessionReasons = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/concession-reasons`);
//     return response.data; // Expected: [{ conc_reason_id: number, conc_reason: string }, ...]
//   } catch (error) {
//     console.error('Error fetching concession reasons:', error);
//     throw error;
//   }
// };

// export const getStudentDetailsByAdmissionNo = async (admissionNo) => {
//   try {
//     console.log("🔍 API Call: getStudentDetailsByAdmissionNo with admissionNo:", admissionNo);
//     console.log("🔍 API URL:", `${API_BASE_URL}/application-confirmation/details/${admissionNo}`);
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/details/${admissionNo}`);
//     console.log("🔍 API Response:", response.data);
//     return response.data; // Expected: { studentName: string, surname: string, fathername: string, mothername: string, gender: string, applicationFee: number, confirmationAmount: number, concessionAmounts: [number, number] }
//   } catch (error) {
//     console.error('Error fetching student details by admission number:', error);
//     console.error('Error details:', error.response?.data || error.message);
//     throw error;
//   }
// };
// export const getEmployeeDetails = async (admissionNo) => {
//   try {
//     console.log("🔍 API Call: getEmployeeDetails with admissionNo:", admissionNo);
//     console.log("🔍 API URL:", `${API_BASE_URL}/application-confirmation/employee-details?admissionNo=${admissionNo}`);
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/employee-details?admissionNo=${admissionNo}`);
//     console.log("🔍 Employee Details API Response:", response.data);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch employee details");
//   }
// };
// export const getBatchDetailsByOrientationAndBatch = async (orientationId, batchId) => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/application-confirmation/details/by-orientation/${orientationId}/by-batch/${batchId}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching batch details by orientation and batch:", error);
//     throw error;
//   }
// };
// export const getAllFoodTypes = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/application-confirmation/getallfoodtypes`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching food types:', error);
//     throw error;
//   }
// };

// export const saveConfirmationData = async (data) => {
//   const response = await axios.post("http://localhost:8080/api/application-confirmation/save", data);
//   return response.data;
// };
