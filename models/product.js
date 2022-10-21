const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
  },
  description: {
    type: String,
  },
  salerId: {
    type: ObjectId,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("product", productSchema);
