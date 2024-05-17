const express = require("express");
const { productAddIntoDB, getProductFromDB } = require("./product.service");


const productRouter = express.Router();

productRouter.post('/create-product', productAddIntoDB);
productRouter.get('/all-product/:email', getProductFromDB);

module.exports = productRouter;