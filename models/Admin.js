const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const AdminSchema = new Schema({
  name: {
    type: String,
    maxlength: 80,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Admin', AdminSchema);
