const isEmpty = require('is-empty'); // 
const validator = require('validator'); // 

/** 
 * LOGIN FORM VALIDATION
 */
module.exports.loginValidator = (data) => {
  const errors = {};

  // check to see if there is data present, if undefined or null set property to empty string
  data.email = !(isEmpty(data.email)) ? data.email : '';
  data.password = !(isEmpty(data.password)) ? data.password : '';
    
  let emailError = validator.isEmpty(data.email) ? 'Email is required' : (!validator.isEmail(data.email) ? 'Please provide a valid email' : '');
  let passwordError = validator.isEmpty(data.password) ? 'Password is required' : '';

  if (emailError) { errors.email = emailError }
  if (passwordError) { errors.password = passwordError }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

/** 
 * REGISTRATION FORM VALIDATION
 */
module.exports.registerValidator = (data) => {
  const errors = {};

  // check to see if there is data present, if undefined or null set property to empty string
  data.email = !(isEmpty(data.email)) ? data.email : '';
  data.password = !(isEmpty(data.password)) ? data.password : '';
  data.firstName = !(isEmpty(data.firstName)) ? data.firstName : '';
  data.lastName = !(isEmpty(data.lastName)) ? data.lastName : '';

  let emailError = validator.isEmpty(data.email) ? 'Email is required' : (!validator.isEmail(data.email) ? 'Please provide a valid email' : '');
  let passwordError = validator.isEmpty(data.password) ? 'Password is required' : '';
  let firstNameError = validator.isEmpty(data.firstName) ? 'FirstName is required' : '';
  let lastNameError = validator.isEmpty(data.lastName) ? 'LastName is required' : '';

  if (emailError) { errors.email = emailError }
  if (passwordError) { errors.password = passwordError }
  if (firstNameError || lastNameError ) { errors.firstName = 'Full Name is required' }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
