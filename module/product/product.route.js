const express = require("express");

const {
  productAddIntoDB,
  getProductFromDB,
  getSingleProductFromDB,
  packageAddedIntoDB,
  getPackagesFromDB,
} = require("./product.service");

productRouter.post('/create-product', productAddIntoDB);
productRouter.get('/all-product/:email', getProductFromDB);
productRouter.get("/get-single-product/:id", getSingleProductFromDB);
productRouter.post("/create-package", packageAddedIntoDB);
productRouter.post("/get-all-package", getPackagesFromDB);

module.exports = productRouter;