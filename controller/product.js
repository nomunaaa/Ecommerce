const User = require("../models/user");
const Product = require("../models/product");

const addProduct = async (req, res) => {
  console.log(req.body, "ag");
  const { name, image, description, price, email } = req.body;

  try {
    const user = await findUserByEmail(email);
    console.log(user, "user");
    const newProduct = await createProduct(
      name,
      image,
      description,
      price,
      user._id
    );
    res.send({
      code: 200,
      message: "Successful",
      preview: newProduct,
    });
    return newProduct;
  } catch (err) {
    res.send({
      message: `${err.message}`,
      code: 400,
    });
  }
};
const findUserByEmail = async (email) => {
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    return false;
  }
  return user;
};

const createProduct = async (name, image, description, price, salerId) => {
  const newProduct = await Product.create({
    name,
    image,
    description,
    price,
    salerId,
  });
  if (!newProduct) {
    return [false, "Unable to create product"];
  }
};
const listProducts = async (req, res) => {
  try {
    const products = await Product.find({ salerId: { $exists: true } });

    res.json(products);
  } catch (err) {
    res.send({
      message: `${err.message}`,
      code: 400,
    });
  }
};

module.exports.addProduct = addProduct;
module.exports.listProducts = listProducts;
