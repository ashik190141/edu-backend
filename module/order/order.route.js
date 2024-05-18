const express = require("express");
const { orderAddIntoDB, getUserOrderProductFromDB } = require("./order.service");

const orderRouter = express.Router();

orderRouter.post("/create-order", orderAddIntoDB);
orderRouter.get("/my-orders/:email", getUserOrderProductFromDB);

module.exports = orderRouter;
