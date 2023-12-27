import * as yup from "yup";
import { emailValidationRegex, strong_password_regex } from "../regex";

export const loginValidationSchema = yup.object().shape({
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
});
