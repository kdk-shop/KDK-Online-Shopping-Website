const validator = require('validator')
const isEmpty = require('../is-empty')

module.exports = function validateProductInfoCreation(data) {

  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.category = !isEmpty(data.category) ? data.category : ''

  if (validator.isEmpty(data.title)) {
    errors.title = 'Title field is required'
  }

  if (isNaN(data.price)) {
    errors.price = 'Price field is required'
  }

  if (validator.isEmpty(data.category)) {
    errors.category = 'Category field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
