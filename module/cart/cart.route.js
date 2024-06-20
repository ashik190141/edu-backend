const express = require("express");
const { cartAddIntoDB, getCartFromDB, deleteCartFromDB, updatePackage } = require("./cart.service");

const cartRouter = express.Router();

cartRouter.post("/addToCart", cartAddIntoDB);
cartRouter.get("/addToCart/:email", getCartFromDB);
cartRouter.put("/addToCart/update-package/:id", updatePackage);
cartRouter.delete("/delete-cart/:email/:id", deleteCartFromDB);

module.exports = cartRouter;