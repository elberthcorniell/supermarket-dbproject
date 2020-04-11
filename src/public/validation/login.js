const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.Correo_electronico = !isEmpty(data.Correo_electronico) ? data.Correo_electronico : "";
  data.Contraseña = !isEmpty(data.Contraseña) ? data.Contraseña : "";
// Correo_electronico checks
  if (Validator.isEmpty(data.Correo_electronico)) {
    errors.Correo_electronico_err = "Correo_electronico field is required";
  } 
// Contraseña checks
  if (Validator.isEmpty(data.Contraseña)) {
    errors.Contraseña_err = "Contraseña field is required";
  }
return {
    errors,
    isValid: isEmpty(errors)
  };
};