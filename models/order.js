const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  created_at: {
    type: Date,
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
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
