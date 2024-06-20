const authRouter = require ("../auth/auth.route");

const express = require("express");
const productRouter = require("../product/product.route");
const cartRouter = require("../cart/cart.route");
const orderRouter = require("../order/order.route");
const discountRouter = require("../discount/discount.route");
const userDiscountRouter = require("../userDiscount/userDiscount.route");
const packageRouter = require("../package/package.route");

const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/product",
    route: productRouter,
  },
  {
    path: "/package",
    route: packageRouter,
  },
  {
    path: "/cart",
    route: cartRouter,
  },
  {
    path: "/order",
    route: orderRouter,
  },
  {
    path: "/discount",
    route: discountRouter,
  },
  {
    path: "/userDiscount",
    route: userDiscountRouter,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

module.exports = router;
