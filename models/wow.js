const mongoose = require("mongoose");

const carsSchema = new mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
  },
);
const carModel= mongoose.model("cars", carsSchema);
module.exports = carModel;