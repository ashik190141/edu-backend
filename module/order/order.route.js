const express = require("express");
const { orderAddIntoDB, getUserOrderProductFromDB, getAllOrderProductFromDB, updateOrderProductStatusIntoDB, returnProductIntoDB, getProductInfoFromDB } = require("./order.service");

const orderRouter = express.Router();

orderRouter.post("/create-order", orderAddIntoDB);
orderRouter.get("/my-orders/:email", getUserOrderProductFromDB);
orderRouter.get("/all-orders", getAllOrderProductFromDB);
orderRouter.get("/get-product-info/:id/:orderDataId/:email", getProductInfoFromDB);
orderRouter.put("/order-delivered/:id", updateOrderProductStatusIntoDB);
orderRouter.put("/order-return/:id/:orderDataId", returnProductIntoDB);

module.exports = orderRouter;
