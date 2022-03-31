const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncEror = require("../middleware/catchAsyncError");

//---------------------------CREATE ORDER--------------------------------------

exports.newOrder = catchAsyncEror(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//---------------------------GET SINGLE ORDER DETAIL--------------------------------------

exports.getSingleOrder = catchAsyncEror(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order Not Found With This Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//---------------------------GET LOGGED IN USER'S  ORDER(s)--------------------------------------

exports.myOrders = catchAsyncEror(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//---------------------------GET ALL ORDERS--------------------------------------

exports.getAllOrders = catchAsyncEror(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//---------------------------UPDATE ORDER STATUS--------------------------------------

exports.updateOrders = catchAsyncEror(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found With This Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You Have Already Delivered This Order", 404));
  }

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

//---------------------------DELETE ORDER--------------------------------------

exports.deleteOrders = catchAsyncEror(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found With This Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
