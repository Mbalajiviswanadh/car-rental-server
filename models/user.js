const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  // Add more fields specific to users if needed
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
