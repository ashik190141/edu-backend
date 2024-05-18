const status = require("http-status");
const myModel = require("./product.model");
const userModel = require("../auth/auth.model");
const { school, bookShop } = require("../../constant/discount");

const d = new Date();
let month = d.getMonth();

const productAddIntoDB = async (req, res) => {
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

const getProductFromDB = async (req, res) => {
  try {
    const result = [];
    const email = req.params.email;
    const allData = await myModel.find().exec();
    const user = await userModel.findOne({ email: email });

    if (email == 'null') {
      return res.json({
        statusCode: status.OK,
        data: allData,
      });
    }

    for (let i = 0; i < allData.length; i++) {
      let price = allData[i].price;
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
          price = price - price * (bookShop.pen/100);
        } else if (allData[i].category == "Paper") {
          price = price - price * (bookShop.paper/100);
        } else {
          price = price - price * (bookShop.book[month]/100);
        }
      }

      const productInfo = {
        _id:allData[i]._id,
        name: allData[i].name,
        image: allData[i].image,
        description: allData[i].description,
        category: allData[i].category,
        price: allData[i].price,
        discountPrice: price,
      };
      
      result.push(productInfo);
    }

    res.json({
      statusCode: status.OK,
      data: result,
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
  productAddIntoDB,
  getProductFromDB,
};
