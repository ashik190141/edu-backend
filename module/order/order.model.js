const mongoose = require("mongoose");

const productInfoSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  packageProductId: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
});

const orderSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  data: {
    type: [productInfoSchema],
  },
  totalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", orderSchema);
