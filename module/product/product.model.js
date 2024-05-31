const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productNumber: {
    type: Number,
    required: true,
  },
});

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  available: {
    type: Number,
    required: true,
  },
  data: {
    type: [packageSchema],
  },
  description: {
    type: String,
    required: true,
  },
  sellingType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("products", ProductSchema);
