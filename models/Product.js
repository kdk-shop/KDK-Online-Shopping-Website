const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {type: String, unique: true, required: true, maxlength: 40},
  category: {type: String, index:true, required: true, maxlength: 40},
  brand: {type: String, index:true, required: true, maxlength: 40},
  imagePath: [String],
  tags: [{type: String, maxlength: 20}],
  price: {type: Number, index: true},
  specification: Schema.Types.Mixed,
  available: Boolean,
  technicalReview: String,
  rating:{
    score: {type:Number,min:0, max:10, required: true},
    count: Number  
  }
  //Keep track of what score each user has given to product in case it's needed in future sprints
  userRates: [{
    userId: {type: Schema.Types.ObjectId, ref:'User', required: true},
    score:{type: Number, min:0, max:10, required: true}
  }],
  comments: [{
    creatorId: {type: Schema.Types.ObjectId, ref:'User', required: true},
    creatorName: {type: String, maxlength: 40},
    date: {type: Date, default: Date.now},
    title: {type: String, maxlength:40, required: true},
    pros: [String],
    cons: [String],
    review: {type: String, required: true, maxlength: 600},
    recommended: Boolean
  }]

});

module.exports = mongoose.model('Product',productSchema);
