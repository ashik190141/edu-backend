const mongoose = require("mongoose");

const userDiscountSchema = mongoose.Schema({
  schoolPen: {
    type: Number,
  },
  schoolPaper: {
    type: Number,
  },
  schoolBook: {
    type: Number,
  },
  bookshopPen: {
    type: Number,
  },
  bookshopPaper: {
    type: Number,
  },
  bookshopBook: {
    type: [Number],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userDiscount", userDiscountSchema);
