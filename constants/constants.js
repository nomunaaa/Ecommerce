require("dotenv").config();
module.exports = {
  allowedOrigins: ["http://localhost:3000/"],
  // SERVER_PORT: process.env.PORT || 3000,
  // SERVER_DB_URI: process.env.DB_URI,
  JWT_SECRET:
    "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1GB4t7NXp98C",
  OTP_LENGTH: 10,
  OTP_CONFIG: {
    upperCaseAlphabets: false,
    specialChars: false,
  },
  MAIL_SETTINGS: {
    service: "gmail",
    auth: {
      user: "testNomuna@gmail.com",
      pass: "wtuywptpoplewxmy",
    },
  },
};
