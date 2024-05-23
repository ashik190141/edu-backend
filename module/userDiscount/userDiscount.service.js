const status = require("http-status");
const myModel = require("./userDiscount.model");

const userDiscountAddIntoDB = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const updateInfo = req.body;
    const query = {_id:id}
    let updatedDoc;
    if (updateInfo.bookshopPen) {
        updatedDoc = {
          $set: {
            bookshopPen: updateInfo.bookshopPen,
            bookshopPaper: updateInfo.bookshopPaper,
            bookshopBook: updateInfo.bookshopBook,
          },
        };
    } else {
        updatedDoc = {
          $set: {
            schoolPen: updateInfo.schoolPen,
            schoolPaper: updateInfo.schoolPaper,
            schoolBook: updateInfo.schoolBook,
          },
        };
    }
    
    const result = await myModel.updateOne(query, updatedDoc, { upsert: true });
    console.log(result);
    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      res.json({
        result: true,
        message: "Discount Added Successfully",
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

const getAllUserDiscountFromDB = async (req, res) => {
  try {
    const allData = await myModel.find().exec();
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

module.exports = {
  userDiscountAddIntoDB,
  getAllUserDiscountFromDB,
};
