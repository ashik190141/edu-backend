const discountModel = require("../module/discount/discount.model");
const userDiscountModel = require("../module/userDiscount/userDiscount.model");

const calculatePercentage = async (user, category, productId,price) => {
    const userDiscountData = await userDiscountModel.find().exec();
    let userDiscountInfo = userDiscountData[0];

    let discountInfo = await discountModel.findOne({
      productId: productId,
    });
    let discountParentage = discountInfo?.discountParentage || 0;

    if (user.role == "school") {
      if (category == "Pen") {
        discountPrice =
          price -
          price * ((userDiscountInfo.schoolPen + discountParentage) / 100);
      } else if (category == "Paper") {
        discountPrice =
          price -
          price * ((userDiscountInfo.schoolPaper + discountParentage) / 100);
      } else {
        discountPrice =
          price -
          price * ((userDiscountInfo.schoolBook + discountParentage) / 100);
      }
    } else if (user.role == "bookshop") {
      if (category == "Pen") {
        discountPrice =
          price -
          price * ((userDiscountInfo.bookshopPen + discountParentage) / 100);
      } else if (category == "Paper") {
        discountPrice =
          price -
          price * ((userDiscountInfo.bookshopPaper + discountParentage) / 100);
      } else {
        discountPrice =
          price -
          price *
            ((userDiscountInfo.bookshopBook[month] + discountParentage) / 100);
      }
    } else {
      if (category == "Pen") {
        discountPrice = price - discountParentage;
      } else if (category == "Paper") {
        discountPrice = price - discountParentage;
      } else {
        discountPrice = price - discountParentage;
      }
    }

    return price - discountPrice
};

module.exports = {
  calculatePercentage,
};
