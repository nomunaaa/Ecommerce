const express = require("express");
var router = express();
const ProductController = require("../controller/product");
const bodyparser = require("body-parser");

router.use(bodyparser.json());
router.post("/add", ProductController.addProduct);
router.get("/list", ProductController.listProducts);

module.exports = router;
