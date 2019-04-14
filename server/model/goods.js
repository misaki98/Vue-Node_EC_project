const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/config', {useMongoClient: true});

var ProductSchema = new mongoose.Schema({
  "productId": {type: String},
  "productName": String,
  "salePrice": Number,
  "checked": Boolean,
  "productNum": Number,
  "productImage": String
});



module.exports = mongoose.model('Good', ProductSchema);

