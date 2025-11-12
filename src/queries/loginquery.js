import axiosInstance from "../axiosInstance";
import axios from "axios";
 
const LOGIN_URL = "http://localhost:8081/sc/emp"
 
const AUTH_URL ="http://localhost:9000/api/common/auth/token"
 
const loginDto = (values) =>({
    email: values.emailId,
    password: values.password,
});
 
 
const loginSubmit = async(formValues) =>{
    const response = await axios.post(`${LOGIN_URL}/login`, loginDto(formValues));
    return response.data;
}
 
 
const getScreenPermissions = async()=>{
    const response = await axios.get(`${AUTH_URL}`);
    return response.data;
}
 
const getScreenPermissions2 = async(accessToken, tokenType= "Bearer")=>{
    const response = await axios.get(`${AUTH_URL}`,{
        headers:{Authorization: `${tokenType} ${accessToken}`}
    })
 
    return response.data;
}
 
export  {loginSubmit, getScreenPermissions, getScreenPermissions2};