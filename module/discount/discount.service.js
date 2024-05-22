const status = require("http-status");
const myModel = require("./discount.model");

const discountAddIntoDB = async (req, res) => {
  try {
    const newData = req.body;
    const document = new myModel(newData);
    await document.save();

    res.json({
      result: true,
      statusCode: status.CREATED,
    });
  } catch (error) {
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to insert data",
    });
  }
};

module.exports = {
  discountAddIntoDB
};
