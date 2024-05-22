const express = require("express");
const {chatAddIntoDB} = require("./chat.service");

const chatbotRouter = express.Router();

chatbotRouter.post("/create-chat", chatAddIntoDB);

module.exports = chatbotRouter;
