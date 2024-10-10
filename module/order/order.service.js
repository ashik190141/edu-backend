const status = require("http-status");
const myModel = require("./order.model");
const cartModel = require("../cart/cart.model");
const productModel = require("../product/product.model");
const userModel = require("../auth/auth.model");
const packageModel = require("../package/package.model");
const { calculatePercentage } = require("../../calculateDiscount/calculatePercentage");

const orderAddIntoDB = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const orderData = data.data;
    const query = { email: data.email };
    // data retrieve from database
    const allData = await myModel.find(query).exec();
    // select the first order and calculate discount
    let discountSecondPurchase = allData[0]?.totalPrice * 0.1;
    console.log(discountSecondPurchase);
    // apply condition for second order
    if (allData.length == 1) {
      data.totalPrice = data.totalPrice - discountSecondPurchase;
    }
    const document = new myModel(data);
    await document.save();


    // const data = req.body;
    // console.log(data);
    // const orderData = data.data
    // const query = { email: data.email };
    // const document = new myModel(data);
    // await document.save();

    for (let i = 0; i < orderData.length; i++){
      let productId = orderData[i].productId;

      const filterByProductId = { _id: productId };

      const productInfo = await productModel.findOne(filterByProductId);

      const productAvailable = productInfo.available;

      const updatedAvailableProduct = {
        $set: {
          available: productAvailable - orderData[i].quantity,
        },
      };

      const updateAvailableProduct = await productModel.updateOne(
        filterByProductId,
        updatedAvailableProduct
      );

      if (updateAvailableProduct.modifiedCount <= 0)
        return;
    }

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

    const result = []
    for (let i = 0; i < allData.length; i++){
      const dataOfProduct = allData[i].data;
      console.log(dataOfProduct);
      for (let j = 0; j < dataOfProduct.length; j++){
        const id = dataOfProduct[j].productId;
        
        const query = { _id: id };
        const productInfo = await productModel.findOne(query);

        const obj = {
          orderId: allData[i]._id,
          email: email,
          image: productInfo.image,
          name: productInfo.name,
          productId: dataOfProduct[j].productId,
          price: dataOfProduct[j].discount,
          status: dataOfProduct[j].status,
          quantity: dataOfProduct[j].quantity,
          createdAt: productInfo.createdAt,
          totalPrice: allData[i].totalPrice,
          orderDataId: dataOfProduct[j]._id
        };

        result.push(obj);
      }
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

const getAllOrderProductFromDB = async (req, res) => {
  try {
    const allData = await myModel.find().exec();

    const result = [];
    for (let i = 0; i < allData.length; i++) {
      const dataOfProduct = allData[i].data;
      for (let j = 0; j < dataOfProduct.length; j++) {
        const id = dataOfProduct[j].productId;

        const query = { _id: id };
        const productInfo = await productModel.findOne(query);

        const obj = {
          _id: allData[i]._id,
          email: allData[i].email,
          image: productInfo.image,
          name: productInfo.name,
          price: dataOfProduct[j].discount,
          status: dataOfProduct[j].status,
          quantity: dataOfProduct[j].quantity,
          createdAt: productInfo.createdAt,
          totalPrice: allData[i].totalPrice,
          orderDataId: dataOfProduct[j]._id,
        };

        result.push(obj);
      }
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

const updateOrderProductStatusIntoDB = async (req, res) => {
  try {
    const id = req.params.id;
    const updateInfo = req.body;
    const query = { _id: id };
    const targetOrder = await myModel.findOne(query);
    let orderData = targetOrder.data;
    for (let i = 0; i < orderData.length; i++) {
      let orderProductID = orderData[i]._id;
      if (orderProductID == updateInfo.orderDataId) {
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
  try {
    const id = req.params.id;
    const orderDataId = req.params.orderDataId;
    const body = req.body;
    console.log('body', body);

    const query = { _id: id };
    const targetOrder = await myModel.findOne(query);

    let orderData = targetOrder.data;
    for (let i = 0; i < orderData.length; i++) {
      if (orderData[i]._id == orderDataId) {
        const productId = orderData[i].productId;

        const queryByProductId = { _id: productId };

        const productInfo = await productModel.findOne(queryByProductId);
        console.log("productInfo", productInfo);

        const updateProductAvailable = productInfo.available + body.return;

        orderData[i].quantity = body.quantity;

        const updateProductAvailableDoc = {
          $set: {
            available: updateProductAvailable,
          },
        };
        console.log("updateProductAvailableDoc", updateProductAvailableDoc);

        const updateOrderData = {
          $set: {
            totalPrice: body.totalPrice,
            data: orderData,
          },
        };
        console.log("updateOrderData", updateOrderData);

        const resultProductAvailable = await productModel.updateOne(
          queryByProductId,
          updateProductAvailableDoc
        );
        console.log("resultProductAvailable", resultProductAvailable);

        const resultOrderUpdate = await myModel.updateOne(
          query,
          updateOrderData
        );
        console.log("resultOrderUpdate", resultOrderUpdate);

        if (
          resultProductAvailable.modifiedCount > 0 &&
          resultOrderUpdate.modifiedCount > 0
        ) {
          res.json({
            result: true,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to Update data",
    });
  }
}

const getProductInfoFromDB = async (req, res) => {
  try {
    const id = req.params.id;
    const orderDataId = req.params.orderDataId;
    const email = req.params.email;

    const query = { _id: id };
    const targetOrder = await myModel.findOne(query);
    const user = await userModel.findOne({ email: email });

    const targetOrderData = targetOrder.data;
    let obj = {}

    for (let i = 0; i < targetOrderData.length; i++){
      if (targetOrderData[i]._id == orderDataId) {
        const productId = targetOrderData[i].productId;

        const queryByProductId = { _id: productId };

        const productInfo = await productModel.findOne(queryByProductId);
        // console.log("productInfo", productInfo);
        const packageQuery = { _id: productInfo?.package };
        // console.log(packageQuery);
        const packageInfo = await packageModel.findOne(packageQuery);
        // console.log(packageInfo);

        const discountAmount = await calculatePercentage(
          user,
          productInfo.category,
          productInfo._id,
          productInfo.price
        );

        obj = {
          name: productInfo.name,
          image: productInfo.image,
          price: productInfo.price,
          description: productInfo.description,
          category: productInfo.category,
          quantity: targetOrderData[i].quantity,
          totalPrice: targetOrder.totalPrice,
          buy: packageInfo.buyProduct,
          get: packageInfo.getProduct,
          packageQuantity: parseInt(
            targetOrderData[i].quantity /
              (packageInfo.buyProduct + packageInfo.getProduct)
          ),
          discountAmount: discountAmount,
          orderDate: targetOrder.createdAt,
        };
      }
    }

    res.json({
      result: true,
      data: obj
    })

  } catch (error) {
    console.log(error);
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to Update data",
    });
  }
}

module.exports = {
  orderAddIntoDB,
  getUserOrderProductFromDB,
  getAllOrderProductFromDB,
  updateOrderProductStatusIntoDB,
  returnProductIntoDB,
  getProductInfoFromDB,
};