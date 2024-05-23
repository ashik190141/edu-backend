const status = require("http-status");
const myModel = require("./cart.model");
const userModel = require("../auth/auth.model");
const { calculateDiscountOfCart } = require("../../calculateDiscount/calculateDiscountWithCart");

const cartAddIntoDB = async (req, res) => {
    try {
        const data = req.body;
        const document = new myModel(data);
        await document.save();

        res.json({
        result: true,
        statusCode: status.CREATED,
        });
    } catch (error) {
        console.log(error);
        res.json({
        statusCode: status.INTERNAL_SERVER_ERROR,
        message: "Failed to insert data",
        });
    }
};

const getCartFromDB = async (req, res) => {
  try {
    const email = req.params.email;
    const query = {email:email}
    const allData = await myModel.find(query).exec();
    const user = await userModel.findOne({ email: email });
    
    let allId = []
    for (let i = 0; i < allData.length; i++) {
      let id = allData[i].productId;
      allId.push(id);
    }

    const uniqueIDs = Array.from(new Set(allId));

    const result = await calculateDiscountOfCart(uniqueIDs, user, allData);
      

    res.json({
      statusCode: status.OK,
      data: result[0],
      totalPrice: result[1]
    });
  } catch (error) {
      console.log(error);
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to get data",
    });
  }
};

module.exports = {
    cartAddIntoDB,
    getCartFromDB
}