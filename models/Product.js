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
  specification: Schema.Types.Mixed,
  available: Boolean,
  rating: {
    score: {
      type: Number,
      min: 0,
      max: 10
    },
    count: Number
  },

  /*
   *Keep track of what score each user has given to product
   * in case it's needed in future sprints
   */
  userRates: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      min: 0,
      max: 10
    }
  }],
  reviews: [{
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    recommended: Boolean
  }]

});

productSchema.set('autoIndex', false);

module.exports = mongoose.model('Product', productSchema);
