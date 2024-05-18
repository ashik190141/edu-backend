const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  discount: {
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
    type: [orderItemSchema],
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
