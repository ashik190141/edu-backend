const status = require("http-status");
const myModel = require("./order.model");
const cartModel = require("../cart/cart.model");

const orderAddIntoDB = async (req, res) => {
  try {
    const data = req.body;
    const query = { email: data.email };
    const document = new myModel(data);
    await document.save();
    const res1 = await cartModel.deleteMany(query);
    if (res1.deletedCount > 0) {
      res.json({
        result: true,
        statusCode: status.CREATED,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to insert data",
    });
  }
};


module.exports = {
  orderAddIntoDB,
};