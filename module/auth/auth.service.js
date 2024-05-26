const status = require("http-status");
const myModel = require("./auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const addUserIntoDB = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await myModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const userInfo = {
      name,
      email,
      password,
      role
    };
    userInfo.role = userInfo.role.toLowerCase();
    const newUser = new myModel(userInfo);
    await newUser.save();

    const token = jwt.sign(
      { email: userInfo.email, role: userInfo.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );

    res.json({
      result: true,
      message: "Registration Successful",
      token
    });
  } catch (error) {
    console.log(error);
    res.json({
    statusCode: status.INTERNAL_SERVER_ERROR,
    message: "Failed to insert data",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await myModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: status.INTERNAL_SERVER_ERROR,
      message: "Failed to login",
    });
  }
}

const allUser = async (req, res) => {
  const allUser = await myModel.find().exec();
  res.json({
    result: true,
    data:allUser
  })
}

module.exports = {
  addUserIntoDB,
  loginUser,
  allUser
};
