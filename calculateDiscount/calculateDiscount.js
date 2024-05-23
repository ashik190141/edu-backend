const { bookShop, school } = require ("../constant/discount");
const discountModel = require("../module/discount/discount.model");
const userDiscountModel = require("../module/userDiscount/userDiscount.model");

const d = new Date();
let month = d.getMonth();

const calculateDiscount = async(allData, user) => {
    const result = [];
    const userDiscountData = await userDiscountModel.find().exec();
    let userDiscountInfo = userDiscountData[0]

    for (let i = 0; i < allData.length; i++) {
      let price = allData[i].price;
      let discountInfo = await discountModel.findOne({ productId : allData[i]._id});
      let discountParentage = (price * (discountInfo?.discountParentage / 100)) || 0;
      
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

      const productInfo = {
        _id: allData[i]._id,
        name: allData[i].name,
        image: allData[i].image,
        description: allData[i].description,
        category: allData[i].category,
        price: allData[i].price,
        discountPrice: price,
      };

      result.push(productInfo);
    }
    return result
}

module.exports = {
    calculateDiscount
}