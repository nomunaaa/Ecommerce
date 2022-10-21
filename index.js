const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/auth.route");
const emProuter = require("./routes/emp");
var app = express();

app.get("/", function (req, res) {
  res.send("Connesadfcted.");
});
app.use(cors());
app.options("*", cors());
app.use("/emp", router);
app.use("/auth", router);

mongoose.connect(
  "mongodb+srv://testUser:Test123@testnomuna.uj68c.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
mongoose.connection
  .once("open", function () {
    console.log("Database connected Successfully");
  })
  .on("error", function (err) {
    console.log("Error", err);
  });

app.listen(4000, function () {
  console.log("Server is Up");
});
// const router = require("express").Router();
// router.use("/auth", require("./routes/auth.route"));

// auth.route.js file in ./routes/auth.route.js

module.exports = router;
