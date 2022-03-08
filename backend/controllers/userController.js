const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsync");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const { use } = require("express/lib/router");
const crypto = require("crypto");

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
//  Logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :\n\n ${resetPasswordUrl}\n\n if you have not requested this email then please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user)
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});
