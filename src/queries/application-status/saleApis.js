import { useState, useEffect } from "react";

export const useAdmissionTypes = () => {
  const [appTypeOptions, setAppTypeOptions] = useState([]);
  const [appTypeIdMap, setAppTypeIdMap] = useState({});
  const [appTypesLoading, setAppTypesLoading] = useState(true);

  useEffect(() => {
    const fetchAdmissionTypes = async () => {
      setAppTypesLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/student-admissions-sale/admission-types");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const options = data.map((item) => item.name);
          const idMap = {};
          data.forEach((item) => {
            idMap[item.name] = item.id;
          });
          setAppTypeOptions(options);
          setAppTypeIdMap(idMap);
        } else {
          setAppTypeOptions([]);
          setAppTypeIdMap({});
        }
      } catch (err) {
        console.error("Failed to fetch admission types:", err);
        setAppTypeOptions([]);
        setAppTypeIdMap({});
      } finally {
        setAppTypesLoading(false);
      }
    };
    fetchAdmissionTypes();
  }, []);

  return { appTypeOptions, appTypeIdMap, appTypesLoading };
};
export const useStudentTypes = () => {
    const [studentTypeOptions, setStudentTypeOptions] = useState([]);
    const [studentTypeIdMap, setStudentTypeIdMap] = useState({});
    const [studentTypesLoading, setStudentTypesLoading] = useState(true);
  
    useEffect(() => {
      const fetchStudentTypes = async () => {
        setStudentTypesLoading(true);
        try {
          const response = await fetch("http://localhost:8080/api/student-admissions-sale/student-types");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        const data = await response.json();
        if (Array.isArray(data)) {
            const options = data.map((item) => item.name);
            const idMap = {};
            data.forEach((item) => {
              idMap[item.name] = item.id;
            });
            setStudentTypeOptions(options);
            setStudentTypeIdMap(idMap);
          } else {
            setStudentTypeOptions([]);
            setStudentTypeIdMap({});
          }
        } catch (err) {
          console.error("Failed to fetch student types:", err);
          setStudentTypeOptions([]);
          setStudentTypeIdMap({});
        } finally {
          setStudentTypesLoading(false);
        }
      };
      fetchStudentTypes();
    }, []);
  
    return { studentTypeOptions, studentTypeIdMap, studentTypesLoading };
  };
  export const useCampuses = () => {
    const [campusOptions, setCampusOptions] = useState([]);
    const [campusIdMap, setCampusIdMap] = useState({});
    const [campusesLoading, setCampusesLoading] = useState(true);
  
    useEffect(() => {
      const fetchCampuses = async () => {
        setCampusesLoading(true);
        try {
          const response = await fetch("http://localhost:8080/api/student-admissions-sale/campuses");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        const data = await response.json();
        if (Array.isArray(data)) {
            const options = data.map((item) => item.name);
            const idMap = {};
            data.forEach((item) => {
              idMap[item.name] = item.id;
            });
            setCampusOptions(options);
            setCampusIdMap(idMap);
          } else {
            setCampusOptions([]);
            setCampusIdMap({});
          }
        } catch (err) {
          console.error("Failed to fetch campuses:", err);
          setCampusOptions([]);
          setCampusIdMap({});
        } finally {
          setCampusesLoading(false);
        }
      };
      fetchCampuses();
    }, []);
  
    return { campusOptions, campusIdMap, campusesLoading };
  };
  export const useCourses = () => {
    const [courseOptions, setCourseOptions] = useState([]);
    const [courseIdMap, setCourseIdMap] = useState({});
    const [coursesLoading, setCoursesLoading] = useState(true);
  
    useEffect(() => {
      const fetchCourses = async () => {
        setCoursesLoading(true);
        try {
          const response = await fetch("http://localhost:8080/api/student-admissions-sale/courses");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        const data = await response.json();
        if (Array.isArray(data)) {
            const options = data.map((item) => item.name);
            const idMap = {};
            data.forEach((item) => {
              idMap[item.name] = item.id;
            });
            setCourseOptions(options);
            setCourseIdMap(idMap);
          } else {
            setCourseOptions([]);
            setCourseIdMap({});
          }
        } catch (err) {
          console.error("Failed to fetch courses:", err);
          setCourseOptions([]);
          setCourseIdMap({});
        } finally {
          setCoursesLoading(false);
        }
      };
      fetchCourses();
    }, []);
  
    return { courseOptions, courseIdMap, coursesLoading };
  };
  
export const useStates = () => {
    const [stateOptions, setStateOptions] = useState([]);
    const [stateIdMap, setStateIdMap] = useState({});
    const [statesLoading, setStatesLoading] = useState(true);
  
    useEffect(() => {
      const fetchStates = async () => {
        setStatesLoading(true);
        try {
          const response = await fetch("http://localhost:8080/api/student-admissions-sale/states");
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        const data = await response.json();
        if (Array.isArray(data)) {
            const options = data.map((item) => item.name);
            const idMap = {};
            data.forEach((item) => {
              idMap[item.name] = item.id;
            });
            setStateOptions(options);
            setStateIdMap(idMap);
          } else {
            setStateOptions([]);
            setStateIdMap({});
          }
        } catch (err) {
          console.error("Failed to fetch states:", err);
          setStateOptions([]);
          setStateIdMap({});
        } finally {
          setStatesLoading(false);
        }
      };
      fetchStates();
    }, []);
  
    return { stateOptions, stateIdMap, statesLoading };
  };
  export const useDistricts = (stateId) => {
    const [districtOptions, setDistrictOptions] = useState([]);
    const [districtIdMap, setDistrictIdMap] = useState({});
    const [districtsLoading, setDistrictsLoading] = useState(false);
  
    useEffect(() => {
      const fetchDistricts = async () => {
        if (!stateId) {
          setDistrictOptions([]);
          setDistrictIdMap({});
          setDistrictsLoading(false);
          return;
        }
  
        setDistrictsLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/api/student-admissions-sale/districts/${stateId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        const data = await response.json();
        if (Array.isArray(data)) {
            const options = data.map((item) => item.name);
            const idMap = {};
            data.forEach((item) => {
              idMap[item.name] = item.id;
            });
            setDistrictOptions(options);
            setDistrictIdMap(idMap);
          } else {
            setDistrictOptions([]);
            setDistrictIdMap({});
          }
        } catch (err) {
          console.error("Failed to fetch districts:", err);
          setDistrictOptions([]);
          setDistrictIdMap({});
        } finally {
          setDistrictsLoading(false);
        }
      };
      fetchDistricts();
    }, [stateId]);
  
    return { districtOptions, districtIdMap, districtsLoading };
  };