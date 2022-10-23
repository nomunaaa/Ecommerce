const express = require("express");
const cors = require("cors");
const multer = require("multer");

const mongoose = require("mongoose");
const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const router = require("./routes/auth.route");
const orderRouter = require("./routes/order.route");
var app = express();

app.get("/", function (req, res) {
  res.send("Connesadfcted.");
});
app.use(cors());
app.options("*", cors());
app.use("/product", productRouter);
app.use("/auth", authRouter);
app.use("/order", orderRouter);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("photo"), function (req, res, next) {
  return res.send("http://localhost:4000/" + req.file.path);
});

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
