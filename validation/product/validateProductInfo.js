const validator = require('validator')
const isEmpty = require('../is-empty')

module.exports = function validateProductInfoCreation(data) {

  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.category = !isEmpty(data.category) ? data.category : ''
  data.brand = !isEmpty(data.brand) ? data.brand : ''

  if (validator.isEmpty(data.title)) {
    errors.title = 'Title field is required'
  }

  if (isNaN(data.price) || data.price <= 0) {
    errors.price = 'Price field is invalid'
  }

  if (validator.isEmpty(data.category)) {
    errors.category = 'Category field is required'
  }

  if (validator.isEmpty(data.brand)) {
    errors.brand = 'Brand field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
