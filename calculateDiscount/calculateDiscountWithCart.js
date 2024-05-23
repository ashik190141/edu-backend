const { bookShop, school } = require("../module/discount/discount.model");
const discountModel = require("../module/discount/discount.model");
const productModel = require("../module/product/product.model");

const d = new Date();
let month = d.getMonth();

const calculateDiscountOfCart = async (uniqueIDs, user, allData) => {
  let result = [];
  let totalPrice = 0;

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
        price = price - (price * (school.pen / 100) + discountParentage);
      } else if (allData[i].category == "Paper") {
        price = price - (price * (school.paper / 100) + discountParentage);
      } else {
        price = price - (price * (school.book / 100) + discountParentage);
      }
    } else if (user.role == "bookshop") {
      if (allData[i].category == "Pen") {
        price = price - (price * (bookShop.pen / 100) + discountParentage);
      } else if (allData[i].category == "Paper") {
        price = price - (price * (bookShop.paper / 100) + discountParentage);
      } else {
        price =
          price - (price * (bookShop.book[month] / 100) + discountParentage);
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
