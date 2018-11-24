const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    maxlength: 40,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    maxlength: 80,
    index: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  phoneNumber: {
    type: Number
  },
  address: {
    type: String,
    maxlength: 200
  },
  //Keep track of items user has rated in case it's needed in future sprints
  rates: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    }
  }],
  purchaseHistory: [{
    type: Schema.Types.ObjectId,
    ref: "Purchase"
  }],
  shoppingCart: {
    type: Schema.Types.ObjectId,
    ref: "Cart"
  }
})

module.exports = mongoose.model('User', UserSchema);
