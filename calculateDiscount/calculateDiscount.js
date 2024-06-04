const discountModel = require("../module/discount/discount.model");
const userDiscountModel = require("../module/userDiscount/userDiscount.model");

const d = new Date();
let month = d.getMonth();

const calculateDiscount = async (allData, user) => {
  const result = [];
  const userDiscountData = await userDiscountModel.find().exec();
  let userDiscountInfo = userDiscountData[0];

  for (let i = 0; i < allData.length; i++) {
    let price = allData[i].price;
    let discountInfo = await discountModel.findOne({
      productId: allData[i]._id,
    });
    let discountParentage = discountInfo?.discountParentage || 0;
    

    if (user.role == "school") {
      if (allData[i].category == "Pen") {
        // discount price = orginal price - (orginal price * userBaseCount + perproductDiscount)
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
    
    const productInfo = {
      _id: allData[i]._id,
      name: allData[i].name,
      image: allData[i].image,
      description: allData[i].description,
      category: allData[i].category,
      price: allData[i].price,
      discountPrice: price,
      available: allData[i].available
    };

    result.push(productInfo);
  }
  return result;
};

module.exports = {
  calculateDiscount,
};
