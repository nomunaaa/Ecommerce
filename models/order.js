const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  created: {
    type: String,
    default: new Date().toISOString(),
  },
  productId: {
    type: ObjectId,
  },
  buyerId: {
    type: ObjectId,
  },
  salerId: {
    type: ObjectId,
  },
  status: {
    type: Number,
  },
  price: {
    type: Number,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
