const mongoose = require("mongoose");

const ownerloginSchema = new mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
  },
);
const ownerloginModel= mongoose.model("ownerlogin", ownerloginSchema);
module.exports = ownerloginModel;