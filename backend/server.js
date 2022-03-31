const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//handling uncaght exception error
process.on("uncaughtExceptionught", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Sutting Down The Server Due To Uncaght Exception");
  process.exit(1);
});

//config
dotenv.config({ path: "backend/config/config.env" });

//connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `SERVER IS UP AND RUNNING ON http://localhost:${process.env.PORT}`
  );
});

//handling unhandled Promise Rejection error
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Sutting Down The Server Due To Unhandled Promise Rejection");

  //closing server on purpose
  server.close(() => {
    process.exit(1);
  });
});
