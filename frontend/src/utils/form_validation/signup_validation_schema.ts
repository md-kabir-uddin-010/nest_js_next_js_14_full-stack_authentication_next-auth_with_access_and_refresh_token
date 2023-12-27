import * as yup from "yup";
import { emailValidationRegex, strong_password_regex } from "../regex";

export const signUpValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .trim("Email is required")
    .min(2)
    .max(30),
  email: yup
    .string()
    .required("Email is required")
    .trim()
    .email()
    .matches(emailValidationRegex, "Email must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      strong_password_regex,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .min(8)
    .max(30),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must match")
    .required("Please confirm your password"),
});
