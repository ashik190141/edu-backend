const express = require("express");
const { cartAddIntoDB, getCartFromDB } = require("./cart.service");

const cartRouter = express.Router();

cartRouter.post("/addToCart", cartAddIntoDB);
cartRouter.get("/addToCart/:email", getCartFromDB);

module.exports = cartRouter;