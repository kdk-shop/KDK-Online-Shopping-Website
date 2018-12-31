const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  user: {
    email: {
      type: String,
      required: true,
      lowercase: true,
      maxlength: 40,
      unique: true
    },
    name: {
      type: String,
      maxlength: 80
    },
    phoneNumber: {
      type: Number
    },
    address: {
      type: String,
      maxlength: 200
    }
  },

  products: [{
    product: {
      _id: {
        type: Schema.Types.ObjectId,
        required: true
      },
      title: {
        type: String,
        unique: true,
        required: true
      },
      category: {
        type: String,
        index: true,
        required: true,
        maxlength: 40
      },
      brand: {
        type: String,
        index: true,
        required: true,
        maxlength: 40
      },
      price: {
        type: Number,
        index: true,
        required: true
      }
    },
    qty: {
      type: Number,
      required: true,
      min: 1
    }
  }],

  purchaseDate: {
    type: Date,
    default: Date.now,
    index: true
  },

  price: {
    type: Number,
    require: true
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
