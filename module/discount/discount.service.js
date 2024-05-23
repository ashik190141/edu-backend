const status = require("http-status");
const myModel = require("./discount.model");

const discountAddIntoDB = async (req, res) => {
  try {
    const id = req.params.id;
    const updateInfo = req.body;
    const query = { productId: id };
    const updatedDoc = {
      $set: {
        productId: updateInfo.productId,
        discountParentage: updateInfo.discountParentage,
      },
    };
    const result = await myModel.updateOne(query, updatedDoc, { upsert: true });
    console.log(result);
    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      res.json({
        result: true,
        message: "Discount Added Successfully",
      });
    }
    
  } catch (error) {
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to insert data",
    });
  }
};

module.exports = {
  discountAddIntoDB
};
