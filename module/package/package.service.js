const myModel = require("./package.model");
const status = require("http-status");

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
  packageAddedIntoDB,
  getPackagesFromDB,
};
