const express = require("express");
const { orderAddIntoDB } = require("./order.service");

const orderRouter = express.Router();

orderRouter.post("/create-order", orderAddIntoDB);

module.exports = orderRouter;
