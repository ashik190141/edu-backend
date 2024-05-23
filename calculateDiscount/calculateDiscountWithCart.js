const { bookShop, school } = require("../module/discount/discount.model");
const discountModel = require("../module/discount/discount.model");
const productModel = require("../module/product/product.model");
const userDiscountModel = require("../module/userDiscount/userDiscount.model");

const d = new Date();
let month = d.getMonth();

const calculateDiscountOfCart = async (uniqueIDs, user, allData) => {
  let result = [];
  let totalPrice = 0;
  const userDiscountData = await userDiscountModel.find().exec();
  let userDiscountInfo = userDiscountData[0];

  for (let i = 0; i < uniqueIDs.length; i++) {
    let id = uniqueIDs[i];
    let products = allData.filter((data) => data.productId == id);
    let productInfo = await productModel.findOne({ _id: id });
      let price = productInfo.price;
      
    let discountInfo = await discountModel.findOne({
      productId: allData[i]._id,
    });
    let discountParentage =
      price * (discountInfo?.discountParentage / 100) || 0;

    if (user.role == "school") {
        if (allData[i].category == "Pen") {
          price = price - ((price * (userDiscountInfo.schoolPen / 100)) + discountParentage);
        } else if (allData[i].category == "Paper") {
          price =
            price -
            (price * (userDiscountInfo.schoolPaper / 100) + discountParentage);
        } else {
          price = price - ((price * (userDiscountInfo.schoolBook / 100)) + discountParentage);
        }
      } else if (user.role == "bookshop") {
        if (allData[i].category == "Pen") {
          price = price - ((price * (userDiscountInfo.bookshopPen / 100)) + discountParentage);
        } else if (allData[i].category == "Paper") {
          price = price - ((price * (userDiscountInfo.bookshopPaper / 100)) + discountParentage);
        } else {
          price = price - ((price * (userDiscountInfo.bookshopBook[month] / 100)) + discountParentage);
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
    });
      
  }
  return [result,totalPrice];
};

module.exports = {
  calculateDiscountOfCart,
};
