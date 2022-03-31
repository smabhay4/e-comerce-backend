const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncEror = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

//------------------------------------------CREATE PRODUCT--------------------------------------------------------
//Create Product --ADMIN

exports.createProduct = catchAsyncEror(async (req, res, next) => {
  //adding user's id from req.user.id (inserted at time of isAuthenticatedUser )to req.body
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//------------------------------------------GET ALL PRODUCT---------------------------------------------------------
//Get All product

exports.getAllProducts = catchAsyncEror(async (req, res) => {
  const resultPerPage = 5;

  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  //const products = await Product.find();
  const products = await apiFeature.query;

  res.status(200).json({ success: true, products, productCount });
});

//------------------------------------------GET PRODUCT DETAILS--------------------------------------------------------
//Get product Detail

exports.getProductDetails = catchAsyncEror(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    // return res.status(500).json({
    //   success: false,
    //   message: "product not found",
    // });

    //better way of error handling :

    //handling error by creating custom class(Handle Error's object)
    //sending error object to errormiddleware by using express's next object

    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//------------------------------------------UPDATE PRODUCT--------------------------------------------------------
//update product ---ADMIN

exports.updateProduct = catchAsyncEror(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    // return res.status(500).json({
    //   success: false,
    //   message: "Product not found",
    // });

    return next(new ErrorHandler("product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//------------------------------------------DELETE PRODUCT--------------------------------------------------------
//Delete product

exports.deleteProduct = catchAsyncEror(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    // return res.status(500).json({
    //   success: false,
    //   message: "product Not Found",
    // });
    return next(new ErrorHandler("product not found", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "product Deleted Successfully",
  });
});
