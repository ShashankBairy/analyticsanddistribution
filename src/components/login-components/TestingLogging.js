
export const loggingValues = (values)=>{
    const emailId = "abc@varsitymgmt.com";
    const password = "123456";
    if(values){
        if(values.emailId === emailId && values.password === password){
            return "Success";
        }
        else if(values.emailId === emailId && values.password !== password ){
            return "Password is incorrect";
        }
        else if(values.emailId !== emailId && values.password === password){
            return "Invalid Email Id";
        }
        else{
            return "Invalid Email Id and Password";
        }
    }
}

export const checkEmailId = (values) =>{
    const emailId = "abc@varsitymgmt.com";
    if(values){
        if(values.emailId === emailId){
            return true;
        }
        else{
            return false; 
        }
    }
}

export const otpValue = (values)=>{
    // console.log(values)
    const otp = "123456";
    if(values && values.otp){
        return values.otp === otp;
    }
    return false;
}

