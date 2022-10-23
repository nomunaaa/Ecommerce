const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  created: {
    type: String,
    default: new Date().toISOString(),
  },
  description: {
    type: String,
  },
  salerId: {
    type: mongoose.Schema.ObjectId,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
});

module.exports = mongoose.model("product", productSchema);
