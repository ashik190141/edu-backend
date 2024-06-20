const discountModel = require("../module/discount/discount.model");
const productModel = require("../module/product/product.model");
const userDiscountModel = require("../module/userDiscount/userDiscount.model");

const d = new Date();
let month = d.getMonth();

const calculateDiscountOfCart = async (uniqueIDs, user, allData) => {
  let result = [];
  let totalPrice = 0;
  let isType = null;
  const userDiscountData = await userDiscountModel.find().exec();
  let userDiscountInfo = userDiscountData[0];

  for (let i = 0; i < uniqueIDs.length; i++) {
    let id = uniqueIDs[i];
    let products = allData.filter((data) => data.productId == id);
    let productInfo = await productModel.findOne({ _id: id });
    let price = productInfo.price;

    if (productInfo.sellingType == '1') {
      isType = "Product"
    } else {
      isType = "Package"
    }

    let discountInfo = await discountModel.findOne({
      productId: allData[i]._id,
    });
    let discountParentage = discountInfo?.discountParentage || 0;

    if (user.role == "school") {
      if (allData[i].category == "Pen") {
        price =
          price -
          price * ((userDiscountInfo.schoolPen + discountParentage) / 100);
      } else if (allData[i].category == "Paper") {
        price =
          price -
          price * ((userDiscountInfo.schoolPaper + discountParentage) / 100);
      } else {
        price =
          price -
          price * ((userDiscountInfo.schoolBook + discountParentage) / 100);
      }
    } else if (user.role == "bookshop") {
      if (allData[i].category == "Pen") {
        price =
          price -
          price * ((userDiscountInfo.bookshopPen + discountParentage) / 100);
      } else if (allData[i].category == "Paper") {
        price =
          price -
          price * ((userDiscountInfo.bookshopPaper + discountParentage) / 100);
      } else {
        price =
          price -
          price *
            ((userDiscountInfo.bookshopBook[month] + discountParentage) / 100);
      }
    } else {
      if (allData[i].category == "Pen") {
        price = price - discountParentage;
      } else if (allData[i].category == "Paper") {
        price = price - discountParentage;
      } else {
        price = price - discountParentage;
      }
    }

    totalPrice = totalPrice + products.length * price;

    result.push({
      quantity: products.length,
      name: productInfo.name,
      image: productInfo.image,
      price: productInfo.price,
      productId: productInfo._id,
      discount: price,
      isType: isType,
      category: productInfo?.category
    });
  }
  return [result, totalPrice];
};

module.exports = {
  calculateDiscountOfCart,
};
