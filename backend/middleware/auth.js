const catchAsyncErrors = require("./catchAsync");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    console.log('ok');
//   const token = req.cookies;
  next();
});