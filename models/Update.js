const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const updateSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

module.exports = mongoose.model('Update', updateSchema);
