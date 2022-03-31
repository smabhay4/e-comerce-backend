//CREATING TOKEN AND SAVING IN COOKIES USING USER DETAIL

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //options for cookies
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //HTTPOnly attribute Forbids JavaScript from accessing the cookie. Note that a cookie that has been created with HttpOnly will still be sent with JavaScript fetch().
  };

  //sending token in cookie of user's browser
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
