const { bookShop, school } = require ("../constant/discount");
const discountModel = require("../module/discount/discount.model");

const d = new Date();
let month = d.getMonth();

const calculateDiscount = async(allData, user) => {
    const result = [];

    for (let i = 0; i < allData.length; i++) {
      let price = allData[i].price;
      let discountInfo = await discountModel.findOne({ productId : allData[i]._id});
      let discountParentage =(price * (discountInfo?.discountParentage/100)) || 0
      
      if (user.role == "school") {
        if (allData[i].category == "Pen") {
          price = price - ((price * (school.pen / 100)) + discountParentage);
        } else if (allData[i].category == "Paper") {
          price = price - ((price * (school.paper / 100)) + discountParentage);
        } else {
          price = price - ((price * (school.book / 100)) + discountParentage);
        }
      } else if (user.role == "bookshop") {
        if (allData[i].category == "Pen") {
          price = price - ((price * (bookShop.pen / 100)) + discountParentage);
        } else if (allData[i].category == "Paper") {
          price = price - ((price * (bookShop.paper / 100)) + discountParentage);
        } else {
          price = price - ((price * (bookShop.book[month] / 100)) + discountParentage);
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