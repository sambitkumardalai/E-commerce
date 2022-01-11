const Product = require("../models/productModel");

// ===create product(Admin)
exports.createProduct = async (req, res) => {
  const newProduct = await Product.create(req.body);
  if (newProduct) {
    res.status(201).json({
      success: true,
      newProduct,
    });
  }
};

// ===get all products
exports.getAllProducts = async (req, res) => {
  const allProducts = await Product.find();
  if (Object.keys(allProducts).length) {
    res.status(200).json({
      success: true,
      allProducts,
    });
  }
};

// ==== update product
exports.updateProduct = async (req, res, next) => {
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
};
