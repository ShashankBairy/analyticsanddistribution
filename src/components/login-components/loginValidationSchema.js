import * as Yup from "yup";

const loginValidationSchema =() =>{
    return Yup.object({
    emailId: Yup.string()
      .email("Invalid email address")
      .required("Email Id required"),
    password: Yup.string().required("Password Required"),
  });
}

export default loginValidationSchema;