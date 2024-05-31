const status = require("http-status");
const myModel = require("./order.model");
const cartModel = require("../cart/cart.model");
const productModel = require("../product/product.model")

const orderAddIntoDB = async (req, res) => {
  try {
    const data = req.body;
    const orderData = data.data
    const query = { email: data.email };
    const document = new myModel(data);

    for (let i = 0; i < orderData.length; i++){
      let productId = orderData[i].id
      const filter = { _id: productId };
      const updatedDoc = {
        $inc: {
          available: -1
        },
      };
      const updateAvailableProduct = await productModel.updateOne(filter, updatedDoc);
      if (updateAvailableProduct.modifiedCount <= 0) return;
    }

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

const getUserOrderProductFromDB = async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const allData = await myModel.find(query).exec();
    // console.log(email);

    res.json({
      statusCode: status.OK,
      data: allData,
    });
  } catch (error) {
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to get data",
    });
  }
};

const getAllOrderProductFromDB = async (req, res) => {
  try {
    const allData = await myModel.find().exec();

    res.json({
      statusCode: status.OK,
      data: allData,
    });
  } catch (error) {
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to get data",
    });
  }
};

const updateOrderProductStatusIntoDB = async (req, res) => {
  try {
    const id = req.params.id;
    const updateInfo = req.body;
    const query = { _id: id };
    const targetOrder = await myModel.findOne(query);
    let orderData = targetOrder.data;
    for (let i = 0; i < orderData.length; i++) {
      let orderProductID = orderData[i]._id;
      if (orderProductID == updateInfo.productId) {
        orderData[i].status = "Delivered";
      }
    }
    const updatedDoc = {
      data: orderData,
    };
    await myModel.findOneAndUpdate(query, updatedDoc, { new: true });
    res.json({
      result: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to Update data",
    });
  }
};

const returnProductIntoDB = async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  const targetOrder = await myModel.findOne(query);
  let flag = 0;

  let orderData = targetOrder.data;
  for (let i = 0; i < orderData.length; i++) {
    let orderProductID = orderData[i].productId;
    const filter = { _id: orderProductID };
      const updatedDoc = {
        $inc: {
          available: 1
        },
      };
      const updateAvailableProduct = await productModel.updateOne(filter, updatedDoc);
      if (updateAvailableProduct.modifiedCount <= 0) {
        flag = 1;
        return
      }
  }

  if (flag == 0) {
    const result = await myModel.deleteOne(query);
    if (result.deletedCount > 0) {
      res.json({
        result:true
      })
    }
  }
}

module.exports = {
  orderAddIntoDB,
  getUserOrderProductFromDB,
  getAllOrderProductFromDB,
  updateOrderProductStatusIntoDB,
  returnProductIntoDB,
};