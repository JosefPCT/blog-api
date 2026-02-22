const { body } = require("express-validator");

// Messages
const emptyErr = `must not be empty`;
const booleanErr = `must be a boolean value`;


// Custom Validation

const isSamePass = (value, { req }) => {
  if(value != req.body.password){
    throw new Error(`Password field and Confirm Password field must be the same`)
  }
  return true
}

// Validation
module.exports.validateUser = [
  body("email").trim()
    .notEmpty().withMessage(`Email field ${emptyErr}`)
    .normalizeEmail()
    .isEmail().withMessage(`Email must be a valid email`),
  body("password").trim()
    .notEmpty().withMessage(`Password field ${emptyErr}`),
  body("confirm_password").trim()
    .notEmpty().withMessage(`Confirm Password field ${emptyErr}`)
    .custom(isSamePass),
  body("firstName").trim()
    .notEmpty().withMessage(`First name field ${emptyErr}`),
  body("lastName").trim()
    .notEmpty().withMessage(`Last name field ${emptyErr}`),
  body("isAuthor")
    .isBoolean().withMessage(`isAuthor field ${booleanErr}`)
];

module.exports.validateUpdateUser = [
  body("email").trim()
    .notEmpty().withMessage(`Email field ${emptyErr}`)
    .normalizeEmail()
    .isEmail().withMessage(`Email must be a valid email`)
    .optional(),
  body("password").trim()
    .notEmpty().withMessage(`Password field ${emptyErr}`)
    .optional(),
  body("confirm_password").trim()
    .notEmpty().withMessage(`Confirm Password field ${emptyErr}`)
    .custom(isSamePass)
    .optional(),
  body("firstName").trim()
    .notEmpty().withMessage(`First name field ${emptyErr}`)
    .optional(),
  body("lastName").trim()
    .notEmpty().withMessage(`Last name field ${emptyErr}`)
    .optional(),
  body("isAuthor")
    .isBoolean().withMessage(`isAuthor field ${booleanErr}`)
    .optional()
]
