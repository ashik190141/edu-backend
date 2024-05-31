const express = require("express");
const { orderAddIntoDB, getUserOrderProductFromDB, getAllOrderProductFromDB, updateOrderProductStatusIntoDB, returnProductIntoDB } = require("./order.service");

const orderRouter = express.Router();

orderRouter.post("/create-order", orderAddIntoDB);
orderRouter.get("/my-orders/:email", getUserOrderProductFromDB);
orderRouter.get("/all-orders", getAllOrderProductFromDB);
router.put("/order-delivered/:id", updateOrderProductStatusIntoDB);
router.put("/order-return/:id", returnProductIntoDB);

module.exports = orderRouter;
