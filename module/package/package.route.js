const express = require("express");
const { packageAddedIntoDB, getPackagesFromDB } = require("./package.service");

const packageRouter = express.Router();

packageRouter.post("/create-package", packageAddedIntoDB);
packageRouter.get("/get-all-package", getPackagesFromDB);

module.exports = packageRouter;
