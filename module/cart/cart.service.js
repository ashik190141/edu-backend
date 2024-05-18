const status = require("http-status");
const myModel = require("./cart.model");
const productModel = require("../product/product.model")
const userModel = require("../auth/auth.model");
const { school, bookShop } = require("../../constant/discount");

const d = new Date();
let month = d.getMonth();

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
    
    let result=[];
    let totalPrice=0;
    for (let i = 0; i < uniqueIDs.length; i++){
        let id = uniqueIDs[i];
        let products = allData.filter(data => data.productId == id);
        let productInfo = await productModel.findOne({ _id: id })
        let price = productInfo.price;

        if (user.role == "school") {
          if (allData[i].category == "Pen") {
            price = price - price * (school.pen / 100);
          } else if (allData[i].category == "Paper") {
            price = price - price * (school.paper / 100);
          } else {
            price = price - price * (school.book / 100);
          }
        } else if (user.role == "bookshop") {
          if (allData[i].category == "Pen") {
            price = price - price * (bookShop.pen / 100);
          } else if (allData[i].category == "Paper") {
            price = price - price * (bookShop.paper / 100);
          } else {
            price = price - price * (bookShop.book[month] / 100);
          }
        }

        totalPrice = totalPrice + products.length * price

        result.push({
          quantity: products.length,
          name: productInfo.name,
          image: productInfo.image,
          price: productInfo.price,
          productId: productInfo._id,
          discount: price,
        });
    }
      

    res.json({
      statusCode: status.OK,
      data: result,
      totalPrice: totalPrice
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