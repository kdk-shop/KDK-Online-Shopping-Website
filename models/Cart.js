const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId,ref: 'User',
            required: true, unique: true},
  items: [{ product: {type: Schema.Types.ObjectId,ref: 'Product',
            required: true},
            quantity: {type: Number, required: true, min: 1}}]

});

module.exports = mongoose.model('Cart',cartSchema);
