const status = require("http-status");
const myModel = require("./order.model");
const cartModel = require("../cart/cart.model");
const productModel = require("../product/product.model")

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
      for (let j = 0; j < dataOfProduct.length; j++){
        const id = dataOfProduct[i].productId;
        
        const query = { _id: id };
        const productInfo = await productModel.findOne(query);

        const obj = {
          email: email,
          image: productInfo.image,
          name: productInfo.name,
          price: dataOfProduct[j].discount,
          status: dataOfProduct[j].status,
          quantity: dataOfProduct[j].quantity,
          createdAt: productInfo.createdAt,
          totalPrice: allData[i].totalPrice,
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
        const id = dataOfProduct[i].productId;

        const query = { _id: id };
        const productInfo = await productModel.findOne(query);

        const obj = {
          email: allData[i].email,
          image: productInfo.image,
          name: productInfo.name,
          price: dataOfProduct[j].discount,
          status: dataOfProduct[j].status,
          quantity: dataOfProduct[j].quantity,
          createdAt: productInfo.createdAt,
          totalPrice: allData[i].totalPrice,
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