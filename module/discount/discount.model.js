const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  discountParentage: {
    type:Number,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("discount", cartSchema);
