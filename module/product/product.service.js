const status = require("http-status");
const myModel = require("./product.model");

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
}

const getProductFromDB = async (req, res) => {
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
}



module.exports = {
  productAddIntoDB,
  getProductFromDB,
};