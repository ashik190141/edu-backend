const express = require("express");
const { discountAddIntoDB } = require("./discount.service");

const discountRouter = express.Router();

discountRouter.post("/create-discount", discountAddIntoDB);

module.exports = discountRouter;