const express = require("express");
var router = express();
const OrderController = require("../controller/order");
const bodyparser = require("body-parser");

router.use(bodyparser.json());
router.post("/add", OrderController.addOrder);
router.get("/list", OrderController.getOrders);
router.get("/listSellerOrders", OrderController.getOrdersBySeller);
router.patch("/statusOnWay", OrderController.updateStatusOnWay);
router.patch("/statusReceived", OrderController.updateStatusReceived);
router.get("/highestEarn", OrderController.highestEarningProduct);
router.get("/data", OrderController.earnData);

module.exports = router;
