const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//---------------------------LOGGED IN USER OR NOT----------
//it check whether user has logged in before or not
//if it is a logged in user it saves user data in "req object" by decoding token

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("please Login To Access This Resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedData);
  //adding user's id from database to req object
  req.user = await User.findById(decodedData.id); //not ._id refers userModel's getJWTToken function

  next();
});

//-----------------------------AUTHORIZED ROLE OR NOT----------------
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role:${req.user.role} Is Not Allowed To Accces This Resource`,
          403
        )
      );
    }

    next();
  };
};
