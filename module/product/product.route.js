const express = require("express");

const {
  productAddIntoDB,
  getProductFromDB,
  getSingleProductFromDB,
  packageAddedIntoDB,
  getPackagesFromDB,
  getAllDiscountWithUserRole,
} = require("./product.service");

const productRouter = express.Router();

productRouter.post('/create-product', productAddIntoDB);
productRouter.get('/all-product/:email', getProductFromDB);
productRouter.get("/get-single-product/:id", getSingleProductFromDB);
productRouter.post("/create-package", packageAddedIntoDB);
productRouter.get("/get-all-package", getPackagesFromDB);
productRouter.get("/get-all-product-withUserRole", getAllDiscountWithUserRole);

module.exports = productRouter;