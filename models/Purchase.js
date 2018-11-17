const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId,ref: 'User', required: true},
  userName: {type: String, maxlength: 40},
  items: [{ product: {type: Schema.Types.ObjectId,ref: 'Product',
                      required: true},
            quantity: {type: Number, required: true, min: 1}}],
  purchaseDate: {type: Date, default:Date.now, index: true},
  address: {type: String, required: true}
});

module.exports = mongoose.model('Purchase',purchaseSchema);
