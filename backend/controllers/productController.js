const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
// ===create product(Admin)
exports.createProduct = catchAsyncErrors(async (req, res) => {
  const newProduct = await Product.create(req.body);
  if (newProduct) {
    res.status(201).json({
      success: true,
      newProduct,
    });
  }
});

// ===get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const productCount = await Product.countDocuments();
  const resultPerPage = 5;
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const allProducts = await apiFeatures.query;
  if (allProducts) {
    res.status(200).json({
      success: true,
      productCount,
      allProducts,
    });
  } else {
    return next(new ErrorHandler("Product not found", 404));
  }
});

// ==== update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  const deletedProduct = await product.remove();
  res.status(200).json({
    success: true,
    message: "product removed",
    deletedProduct,
  });
  next();
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
  next();
});
