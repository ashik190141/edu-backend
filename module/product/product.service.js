const status = require("http-status");
const myModel = require("./product.model");
const userModel = require("../auth/auth.model");
const discountModel = require("../discount/discount.model");
const userDiscountModel = require("../userDiscount/userDiscount.model");
const { calculateDiscount } = require("../../calculateDiscount/calculateDiscount");

const d = new Date();
let month = d.getMonth()

const productAddIntoDB = async (req, res) => {
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

const getProductFromDB = async (req, res) => {
  try {
    const email = req.params.email;
    const allData = await myModel.find().exec();
    const user = await userModel.findOne({ email: email });

    if (email == 'null') {
      return res.json({
        statusCode: status.OK,
        data: allData,
      });
    }

    const result = await calculateDiscount(allData,user)

    res.json({
      statusCode: status.OK,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to get data",
    });
  }
};

const getSingleProductFromDB = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const allData = await myModel.findById(id);
    const dataWithDiscount = await discountModel.findOne({ productId: id })

    const result = {
      _id: allData._id,
      name: allData.name,
      image: allData.image,
      price: allData.price,
      category: allData.category,
      description: allData.description,
      discountParentage: dataWithDiscount?.discountParentage || 0,
    };

    res.json({
      result: true,
      statusCode: status.OK,
      data: result,
    });
  } catch (error) {
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to get data",
    });
  }
};

const getAllDiscountWithUserRole = async(req,res)=> {
  try{
  const allData = await myModel.find().exec();
  const discountWithRole = await userDiscountModel.find().exec();
  console.log('discountWithRole',discountWithRole);
  let category=null;
  let afterDiscountSchool = null
  let afterDiscountBookshop = null
  let general = null
  const result = []

  for(let i=0;i<allData.length;i++){
    let price = allData[i].price;
    console.log("price",price);
    let discountInfo = await discountModel.findOne({ productId : allData[i]._id});
    let discountParentage = (price * (discountInfo?.discountParentage / 100)) || 0;
    console.log("discountParentage",discountParentage);

    if(allData[i].category=='Pen'){
      category="Pen";
      afterDiscountSchool =  price - ((price * (discountWithRole[0].schoolPen / 100)) + discountParentage);
      afterDiscountBookshop = price - ((price * (discountWithRole[0].bookshopPen / 100)) + discountParentage);
      general = price - discountParentage
    }else if(allData[i].category=='Paper'){
      category="Paper";
      afterDiscountSchool = price - ((price * (discountWithRole[0].schoolPaper / 100)) + discountParentage);
      afterDiscountBookshop = price - ((price * (discountWithRole[0].bookshopPaper / 100)) + discountParentage);
      general = price - discountParentage
    }else{
      category="Book"
      afterDiscountSchool = price - ((price * (discountWithRole[0].schoolBook / 100)) + discountParentage);
      afterDiscountBookshop = price - ((price * (discountWithRole[0].bookshopBook[month] / 100)) + discountParentage);
      general = price - discountParentage
    }

    let obj = {
      name: allData[i].name,
      category: category,
      school: afterDiscountSchool,
      bookshop: afterDiscountBookshop,
      user: general
    }

    result.push(obj)
  }

  res.json({
    result: true,
    data: result
  })
  }catch(error){
    console.log(error);
  }
}

module.exports = {
  productAddIntoDB,
  getProductFromDB,
  getSingleProductFromDB,
  getAllDiscountWithUserRole
};
