const { encrypt, compare } = require("../services/crypto");
const { generateOTP } = require("../services/OTP");
const { sendMail } = require("../services/MAIL");
const User = require("../models/user");
const { signToken } = require("../services/JWT");
const { JWT_SECRET } = require("../constants/constants");
let refreshTokens = [];
const signUpUser = async (req, res) => {
  console.log(req.body, "ag");
  const { email, password, userStatus } = req.body;

  const isExisting = await findUserByEmail(email);
  if (isExisting) {
    return res.send("Already existing");
  }
  // create new user
  const newUser = await createUser(email, password, userStatus);
  if (!newUser[0]) {
    return res.status(400).send({
      message: "Unable to create new user",
    });
  }
  res.send(newUser);
};
const Login = async (req, res) => {
  try {
    // Get user input
    console.log(req.body, "adsg");
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    console.log(user);
    if (user && (await compare(password, user.password))) {
      // const accessToken = signToken(user);

      var views = "";
      if (user.userStatus == 1) {
        views = "/buyerBoard";
      } else if (user.userStatus == 0) {
        views = "/sellerBoard";
      }
      const refreshToken = signToken(user);
      refreshTokens.push(refreshToken);
      // res.json({ accessToken: accessToken });
      const accessToken = generateAccessToken({
        id: user._id,
        email: user.email,
        created: user.created,
        views: views,
      });

      res
        .status(200)
        .json({ accessToken: accessToken, refreshToken: refreshToken, user });
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

function generateAccessToken(id, email, created, views) {
  return signToken(id, email, created, views, { expiresIn: "2m" });
}

const verifyEmail = async (req, res) => {
  console.log(req.body, "verify");
  const { email, otp } = req.body;
  const user = await validateUserSignUp(email, otp);
  res.send(user);
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

const createUser = async (email, password, userStatus) => {
  const hashedPassword = await encrypt(password);
  const otpGenerated = generateOTP();
  const newUser = await User.create({
    email,
    password: hashedPassword,
    otp: otpGenerated,
    userStatus,
  });
  if (!newUser) {
    return [false, "Unable to sign you up"];
  }

  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    return [true, newUser];
  } catch (error) {
    return [false, "Unable to sign up, Please try again later", error];
  }
};

const validateUserSignUp = async (email, otp) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return [false, "User not found"];
  }
  if (user && user.otp !== otp) {
    return [false, "Invalid OTP"];
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    $set: { active: true },
  });
  return [true, updatedUser];
};
module.exports.signUpUser = signUpUser;
module.exports.verifyEmail = verifyEmail;
module.exports.Login = Login;
