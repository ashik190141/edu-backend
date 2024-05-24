const mongoose = require("mongoose");

const discountSchema = mongoose.Schema({
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

module.exports = mongoose.model("discount", discountSchema);
