const status = require("http-status");
const myModel = require("./product.model");
const userModel = require("../auth/auth.model");
const discountModel = require("../discount/discount.model");
const { calculateDiscount } = require("../../calculateDiscount/calculateDiscount");

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
    const email = req.params.email;
    const query = { sellingType: "1" };
    const allData = await myModel.find(query).exec();
    const user = await userModel.findOne({ email: email });

    if (email == 'null') {
      return res.json({
        statusCode: status.OK,
        data: allData,
      });
    }

    const result = await calculateDiscount(allData,user)

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

const getSingleProductFromDB = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const allData = await myModel.findById(id);
    const dataWithDiscount = await discountModel.findOne({ productId: id })

    const result = {
      _id: allData._id,
      name: allData.name,
      image: allData.image,
      price: allData.price,
      category: allData.category,
      description: allData.description,
      discountParentage: dataWithDiscount?.discountParentage || 0,
    };

    res.json({
      result: true,
      statusCode: status.OK,
      data: result,
    });
  } catch (error) {
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to get data",
    });
  }
};

const packageAddedIntoDB = async (req, res) => {
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

const getPackagesFromDB = async (req, res) => {
  try {
    const query = { sellingType: "0" };
    const allData = await myModel.find(query).exec();

    res.json({
      statusCode: status.OK,
      data: allData,
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
  getSingleProductFromDB,
  packageAddedIntoDB,
  getPackagesFromDB,
};
