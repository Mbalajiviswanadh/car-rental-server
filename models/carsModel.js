// const mongoose =require('mongoose');

// module.exports = mongoose.model('carstypes',{
//     carname:String,
//     description:String,
//     imageUrl:String,
// });

const mongoose = require('mongoose')
const { Schema } = mongoose;

const carsdataSchema = new Schema({
    url: { type: String },
    carname: String,
    description: String,
    price: Number,
});

module.exports = mongoose.model('carsdata', carsdataSchema);