const express = require("express");
const { userDiscountAddIntoDB, getAllUserDiscountFromDB } = require("./userDiscount.service");

const userDiscountRouter = express.Router();

userDiscountRouter.put("/create-user-discount/:id", userDiscountAddIntoDB);
userDiscountRouter.get("/get-all-userDiscount", getAllUserDiscountFromDB);

module.exports = userDiscountRouter;
