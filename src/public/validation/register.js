const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.username2 = !isEmpty(data.username2) ? data.username2 : "";
  data.email2 = !isEmpty(data.email2) ? data.email2 : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
// Name checks
  if (Validator.isEmpty(data.username2)) {
    errors.username_err = "Name field is required";
  }
// Email checks
  if (Validator.isEmpty(data.email2)) {
    errors.email_err = "Email field is required";
  } else if (!Validator.isEmail(data.email2)) {
    errors.email_err = "Invalid email";
  }
// Password checks
  if (Validator.isEmpty(data.password2)) {
    errors.password_err = "Password field is required";
  }
if (!Validator.isLength(data.password2, { min: 6, max: 30 })) {
    errors.password_err = "Password must be at least 6 characters";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};