const status = require("http-status");
const myModel = require("./chat.model");

const chatAddIntoDB = async (req, res) => {
  const {chats} = req.body;
    
  try {
    
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to insert data",
    });
  }
};

module.exports = {
  chatAddIntoDB
};