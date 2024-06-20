const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  buyProduct: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  getProduct: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("package", packageSchema);