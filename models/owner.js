const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  // Add more fields specific to owners if needed
});

const ownerModel = mongoose.model("owners", ownerSchema);
module.exports = ownerModel;
