const express = require("express");
const { addUserIntoDB, loginUser, allUser } = require("./auth.service");

const authRouter = express.Router();

authRouter.post("/register", addUserIntoDB);
authRouter.post("/login", loginUser);
authRouter.get("/all-users", allUser);

module.exports = authRouter;
