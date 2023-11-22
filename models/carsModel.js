const mongoose = require('mongoose')
const { Schema } = mongoose;

const carsdataSchema = new Schema({
    url: { type: String },
    carname: String,
    description: String,
    price: Number,
});

module.exports = mongoose.model('carsdata', carsdataSchema);