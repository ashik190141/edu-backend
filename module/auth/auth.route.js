const express = require("express");
const { addUserIntoDB, loginUser } = require("./auth.service");

const authRouter = express.Router();

authRouter.post("/register", addUserIntoDB);
authRouter.post("/login", loginUser);

module.exports = authRouter;
