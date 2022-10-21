const bcrypt = require("bcrypt");
const saltRounds = 10;

const encrypt = async (data) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  } catch (error) {
    return false;
  }
};

const compare = async (data, hash) => {
  const value = await bcrypt.compare(data, hash);
  return value;
};
module.exports.compare = compare;
module.exports.encrypt = encrypt;
