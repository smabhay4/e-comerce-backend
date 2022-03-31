const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

//-------------------------------------------PRODUCT ROUTE-----------------------------------------------------

//get all product
router.route("/products").get(getAllProducts);

//create a product
router.route("/product/new").post(isAuthenticatedUser, createProduct);

//--------------------------------------------ADMIN ROUTE------------------------------------------------------
//update a product
//delete a product
//get a product

router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
  .get(getProductDetails);

module.exports = router;
