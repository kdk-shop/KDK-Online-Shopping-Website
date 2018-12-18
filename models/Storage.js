const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storageSchema = new Schema({
  name: {
    type: String,
    maxlength: 80,
    required: true,
    unique: true
  },
  address: {
    type: String,
    maxlength: 200
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  inventory: {
    type: Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  }
});

module.exports = mongoose.model('Storage', storageSchema);
