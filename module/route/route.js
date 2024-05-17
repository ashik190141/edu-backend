const authRouter = require ("../auth/auth.route");

const express = require("express");
const productRouter = require("../product/product.route");

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
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

module.exports = router;
