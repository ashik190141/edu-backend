const express = require("express");
const { discountAddIntoDB } = require("./discount.service");

const discountRouter = express.Router();

discountRouter.put("/create-discount/:id", discountAddIntoDB);

module.exports = discountRouter;