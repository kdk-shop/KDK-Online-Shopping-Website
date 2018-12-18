const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    qty: {
      type: Number,
      default: 1,
      min: 1
    }
  }]

});

module.exports = mongoose.model('Inventory', inventorySchema);
