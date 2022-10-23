const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

const addOrder = async (req, res) => {
  const { productId, email } = req.body;

  try {
    const buyer = await findUserByEmail(email);
    const product = await findSellerId(productId);
    const newOrder = await createOrder(
      productId,
      buyer._id,
      product.salerId,
      product.price
    );
    res.send({
      code: 200,
      message: "Successful",
      preview: newOrder,
    });
    return newOrder;
  } catch (err) {
    console.log(err);
    res.send({
      message: `${err.message}`,
      code: 400,
    });
  }
};
const updateStatusOnWay = async (req, res) => {
  const { orderId } = req.query;

  try {
    const filter = { _id: orderId };
    const updateDoc = {
      $set: {
        status: 1,
      },
    };
    const options = { upsert: true };
    const newOrder = await Order.updateOne(filter, updateDoc, options);
    res.send({
      code: 200,
      message: "Successful",
      preview: newOrder,
    });
    return newOrder;
  } catch (err) {
    console.log(err);
    res.send({
      message: `${err.message}`,
      code: 400,
    });
  }
};
const updateStatusReceived = async (req, res) => {
  const { orderId } = req.query;
  console.log(req, "asdgsa");
  try {
    const filter = { _id: orderId };
    const updateDoc = {
      $set: {
        status: 2,
      },
    };
    const options = { upsert: true };
    const newOrder = await Order.updateOne(filter, updateDoc, options);
    res.send({
      code: 200,
      message: "Successful",
      preview: newOrder,
    });
    return newOrder;
  } catch (err) {
    console.log(err);
    res.send({
      message: `${err.message}`,
      code: 400,
    });
  }
};
const findUserByEmail = async (email) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return false;
  }
  return user;
};
const findSellerId = async (productId) => {
  const product = await Product.findOne({
    _id: productId,
  });
  if (!product) {
    return false;
  }
  return product;
};

const createOrder = async (productId, buyerId, salerId, price) => {
  const newOrder = await Order.create({
    productId,
    buyerId,
    salerId,
    price,
    status: 0,
  });
  if (!newOrder) {
    return [false, "Unable to create order"];
  }
};
const getOrders = async (req, res) => {
  const { email } = req.query;
  const user = await findUserByEmail(email);
  try {
    const newOrder = await Order.aggregate([
      {
        $match: {
          buyerId: user._id,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "salerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $unwind: {
          path: "$product",
        },
      },
      {
        $unwind: {
          path: "$seller",
        },
      },
      {
        $project: {
          _id: 1,
          created: 1,
          status: 1,
          price: 1,
          productName: "$product.name",
          productImage: "$product.image",
          seller: "$seller.email",
        },
      },
    ]);
    res.json({ newOrder });
  } catch (err) {
    res.send(err.message);
  }
};
const getOrdersBySeller = async (req, res) => {
  const { email } = req.query;
  const user = await findUserByEmail(email);
  try {
    const newOrder = await Order.aggregate([
      {
        $match: {
          salerId: user._id,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "buyerId",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: {
          path: "$product",
        },
      },
      {
        $unwind: {
          path: "$buyer",
        },
      },
      {
        $project: {
          _id: 1,
          created: 1,
          status: 1,
          price: 1,
          productName: "$product.name",
          productImage: "$product.image",
          buyer: "$buyer.email",
        },
      },
    ]);
    res.json({ newOrder });
  } catch (err) {
    res.send(err.message);
  }
};
const highestEarningProduct = async (req, res) => {
  const { email } = req.query;
  const user = await findUserByEmail(email);
  try {
    const earner = await Order.aggregate([
      {
        $match: {
          salerId: user._id,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: {
          path: "$product",
        },
      },
      {
        $group: {
          _id: "$product.name",
          earn: {
            $sum: "$product.price",
          },
        },
      },
      {
        $sort: {
          earn: -1,
        },
      },
    ]);
    res.json({ earner });
  } catch (err) {
    res.send(err.message);
  }
};
const earnData = async (req, res) => {
  const { email } = req.query;
  const user = await findUserByEmail(email);
  try {
    const allOrders = await Order.aggregate([
      {
        $match: {
          salerId: user._id,
        },
      },
      {
        $count: "allOrders",
      },
    ]);
    const soldOrders = await Order.aggregate([
      {
        $match: {
          salerId: user._id,
          status: 2,
        },
      },
      {
        $count: "soldOrders",
      },
    ]);
    const onWayOrders = await Order.aggregate([
      {
        $match: {
          salerId: user._id,
          status: 1,
        },
      },
      {
        $count: "onWayOrders",
      },
    ]);
    const revenue = await Order.aggregate([
      {
        $match: {
          salerId: user._id,
          status: 2,
        },
      },
      {
        $group: {
          _id: "$status",
          revenue: {
            $sum: "$price",
          },
        },
      },
    ]);
    const averagePrice = await Order.aggregate([
      {
        $match: {
          salerId: user._id,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
        },
      },
      {
        $group: {
          _id: "$salerId",
          avgPrice: {
            $avg: "$product.price",
          },
        },
      },
    ]);
    const chartData = await Order.aggregate([
      {
        $match: {
          salerId: user._id,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
        },
      },
      {
        $group: {
          _id: "$product.name",
          chartData: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          chartData: -1,
        },
      },
      {
        $limit: 3,
      },
    ]);
    res.json({
      chartData,
      allOrders,
      soldOrders,
      revenue,
      averagePrice,
      onWayOrders,
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.addOrder = addOrder;
module.exports.getOrders = getOrders;
module.exports.updateStatusOnWay = updateStatusOnWay;
module.exports.updateStatusReceived = updateStatusReceived;
module.exports.highestEarningProduct = highestEarningProduct;
module.exports.getOrdersBySeller = getOrdersBySeller;
module.exports.earnData = earnData;
