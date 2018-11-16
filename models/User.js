const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//create Schema 
const UserSchema=new Schema({
  email:{ type: String, required: true, lowercase: true, maxlength:40,unique: true},
  password: { type: String, required: true},
  name: {type: String , maxlength: 80},
  date: { type: Date, default: Date.now, index:true },
  phoneNumber: { type: Number },
  address: {type: String, maxlength: 200}
})

module.exports=User=mongoose.model('users',UserSchema);
