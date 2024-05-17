const express = require("express");
const { productAddIntoDB, getProductFromDB } = require("./product.service");


const productRouter = express.Router();

productRouter.post('/product', productAddIntoDB);
productRouter.get('/product', getProductFromDB);

module.exports = productRouter;