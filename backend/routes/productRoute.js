const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
} = require("../controllers/productController");
const router = express.Router();

router.route("/product").get(getAllProducts);
router.route("/product/new").post(createProduct);
router.route("/product/:id").put(updateProduct);

module.exports = router;
