const status = require("http-status");
const myModel = require("./cart.model");
const userModel = require("../auth/auth.model");
const productModel = require("../product/product.model")
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
    const query = { email: email };
    const filter = { sellingType: "0" };
    const allData = await myModel.find(query).exec();
    const user = await userModel.findOne({ email: email });
    const allPackage = await productModel.find(filter).exec();
    // console.log(allPackage);
    
    let allId = []
    for (let i = 0; i < allData.length; i++) {
      let id = allData[i].productId;
      allId.push(id);
    }

    const uniqueIDs = Array.from(new Set(allId));

    const result = await calculateDiscountOfCart(uniqueIDs, user, allData);
    const cartInfo = result[0];
    let suggestion = [];
    const targetData = cartInfo.filter(cart => cart.isType == "Package")

    for (let i = 0; i < targetData.length; i++){
      let buyProduct = (targetData[i].data.buyProduct * targetData[i].quantity);
      let suggestionData = allPackage.filter(
        (package) =>
          package.data.buyProduct == buyProduct &&
          package.category == targetData[i].category &&
          package._id != targetData[i].productId.toString()
      );
      suggestion.push(...suggestionData)
    }

    res.json({
      statusCode: status.OK,
      data: result[0],
      totalPrice: result[1],
      suggestion: suggestion
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