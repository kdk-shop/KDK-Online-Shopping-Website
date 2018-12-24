const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
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
  imagePaths: [String],
  tags: [{
    type: String,
    maxlength: 20
  }],
  price: {
    type: Number,
    index: true
  },
  //Optional field for discounted items
  discountedPrice: {
    type: Number
  },

  available: Boolean,

  rating: {
    score: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },

  date: {
    type: Date,
    default: Date.now
  },

  reviews: [{
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creatorName: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    review: {
      type: String,
      required: true,
      maxlength: 1000
    },
    recommended: Boolean,
    score: {
      type: Number,
      min: 0,
      max: 5
    }
  }],
  description: {
    type: String
  }

});

productSchema.set('autoIndex', false);

module.exports = mongoose.model('Product', productSchema);
