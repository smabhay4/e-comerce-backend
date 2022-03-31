const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");
const validator = require("validator");
const crypto = require("crypto");

//-----------------------------USER SCHEMA ------------------
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxlength: [30, "Nmae Cannot Exceed 30 Characters"],
    minlength: [4, "Name Should Have More Than 4 Characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [8, "Password Should Be At Least 8 Characters"],
    slect: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//----------------------------HASHING PASSWORD USING BCRYPT-------
userSchema.pre("save", async function (next) {
  //this function gets called everytime on updation of any  detail (password or other data) in userSchema , which we dont want in case of updation on other detail that password also gets hashed again tht's why we are checking in "if"
  if (!this.isModified("password")) {
    //if password is not modified
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//----------------------------CREATING JWT(JASON WEB TOKEN) using jwt---------
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//----------------------------COMPARE PASSWORD---------------------------------

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

//-----------------------------GENERATING PASSWORD-RESET TOKEN------------------------------------
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token

  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding resetPasswordToken to userSchema

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
