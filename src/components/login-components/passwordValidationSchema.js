import * as Yup from "yup";

// Password Validation Regex:
// 1st capital letter, min 8, max 12, at least 1 lowercase, 1 number, 1 special character
export const passwordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .required("New Password is required")
    .matches(/^[A-Z].*$/, "Password must start with a capital letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    )
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be at most 12 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm Password is required"),
});
