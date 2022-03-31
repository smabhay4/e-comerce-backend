const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

//---------------------------  Route Imports--------------------------------

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

//errormiddleware Imports
const errorMiddleware = require("./middleware/error");

//-----------------------------  middlewares------------------------------

// express.json() is a built in middleware function .
// It parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json());

//cookie-parser to read what is stored in req.cookies just like bodyparser used to read req.body

app.use(cookieParser());

//route middlewares
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

//error middleware
app.use(errorMiddleware);

module.exports = app;
