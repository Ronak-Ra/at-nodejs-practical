const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user_name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  password : {
    type :String
  },
  token:{
    type:String
  },
  is_active: {
    type: String,
    description: "0: inActive, 1: Active",
    default: "1",
    enum: ["0", "1"],
  },
  is_delete: {
    type: String,
    description: "0: Not Deleted, 1: Delete",
    default: "0",
    enum: ["0", "1"],
  },
  is_deactive: {
    type: String,
    description: "0: Active, 1: Deactive",
    default: "0",
    enum: ["0", "1"],
  },
   login_status:{
    type: String,
    description: "1: online, 0: offline",
    default: "0",
    enum: ["0", "1"],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const userModel = mongoose.model('tbl_user', userSchema);

module.exports = userModel;
