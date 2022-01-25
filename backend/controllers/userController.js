const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsync");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is a sample id",
      url: "profilepicUrl",
    },
  });
  sendToken(user, 201, res);
});

// === Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & pasword", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or pasword", 401));
  }
  const isPasswordMatched = await user.comparePasswrod(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or pasword", 401));
  }
  sendToken(user, 200, res);
});
