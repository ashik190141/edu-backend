const status = require("http-status");
const myModel = require("./order.model");
const cartModel = require("../cart/cart.model");
const productModel = require("../product/product.model");
const userModel = require("../auth/auth.model");
const { calculatePercentage } = require("../../calculateDiscount/calculatePercentage");

const orderAddIntoDB = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const orderData = data.data
    const query = { email: data.email };
    const document = new myModel(data);
    await document.save();

    for (let i = 0; i < orderData.length; i++){
      let packageId = orderData[i].productId;
      let productOfPackageId = orderData[i].packageProductId;

      const filterByPackageId = { _id: packageId };
      const queryByProductOfPackageId = { _id: productOfPackageId };

      const packageInfo = await productModel.findOne(filterByPackageId);
      
      const productInfoForPackage = await productModel.findOne(queryByProductOfPackageId);

      const productAvailable = productInfoForPackage.available;
      const packageAvailable = packageInfo.available;

      const totalProductForPackage =
        (packageInfo?.data?.buyProduct +
          packageInfo?.data?.getProduct) || 0;

      const updatedAvailablePackage = {
        $set: {
          available: packageAvailable - orderData[i].quantity,
        },
      };

      const updatedAvailableProduct = {
        $set: {
          available: productAvailable - totalProductForPackage*orderData[i].quantity,
        },
      };

      const updateAvailablePackage = await productModel.updateOne(
        filterByPackageId,
        updatedAvailablePackage
      );

      const updateAvailableProduct = await productModel.updateOne(
        queryByProductOfPackageId,
        updatedAvailableProduct
      );

      if (updateAvailableProduct.modifiedCount <= 0 || updateAvailablePackage.modifiedCount <= 0)
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
          _id: allData[i]._id,
          email: email,
          image: productInfo.image,
          name: productInfo.name,
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

    const query = { _id: id };
    const targetOrder = await myModel.findOne(query);

    let orderData = targetOrder.data;
    for (let i = 0; i < orderData.length; i++) {
      if (orderData[i]._id == orderDataId) {
        const productId = orderData[i].productId;
        const packageProductId = orderData[i].packageProductId;

        const queryByProductId = { _id: productId };
        const queryByPackageProductId = { _id: packageProductId };

        const productInfo = await productModel.findOne(queryByProductId);
        const packageProductInfo = await productModel.findOne(
          queryByPackageProductId
        );

        const updatePackageProductAvailable =
          packageProductInfo.available + body.return;
        const updatePackageAvailable = productInfo.available + body.quantity;
        orderData[i].quantity = body.quantity;

        const updatePackageAvailableDoc = {
          $set: {
            available: updatePackageAvailable,
          },
        };

        const updateProductAvailableDoc = {
          $set: {
            available: updatePackageProductAvailable,
          },
        };

        const updateOrderData = {
          $set: {
            totalPrice: body.totalPrice,
            data: orderData,
          },
        };

        const resultPackageAvailable = await productModel.updateOne(
          queryByProductId,
          updatePackageAvailableDoc
        );

        const resultProductAvailable = await productModel.updateOne(
          queryByPackageProductId,
          updateProductAvailableDoc
        );

        const resultOrderUpdate = await myModel.updateOne(
          query,
          updateOrderData
        );

        if (
          resultPackageAvailable.modifiedCount > 0 &&
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
        const packageProductId = targetOrderData[i].packageProductId;

        const queryByProductId = { _id: productId };
        const queryByPackageProductId = { _id: packageProductId };

        const productInfo = await productModel.findOne(queryByProductId);
        const packageProductInfo = await productModel.findOne(
          queryByPackageProductId
        );

        const discountAmount = await calculatePercentage(
          user,
          packageProductInfo.category,
          packageProductInfo._id,
          packageProductInfo.price
        );

        obj = {
          name: packageProductInfo.name,
          image: packageProductInfo.image,
          price: packageProductInfo.price,
          description: packageProductInfo.description,
          category: packageProductInfo.category,
          buy: productInfo.data.buyProduct,
          get: productInfo.data.getProduct,
          quantity: targetOrderData[i].quantity,
          totalGet:
            (productInfo.data.buyProduct + productInfo.data.getProduct) *
            targetOrderData[i].quantity,
          totalPrice: targetOrder.totalPrice,
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