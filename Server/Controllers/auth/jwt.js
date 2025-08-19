const jwt = require("jsonwebtoken");
require("dotenv").config()




const secretKey = process.env.secretKey;
const setsessionID = (user) => {
  const payload = {
    id: user._id,
    Name: user.Name,
    Email: user.Email,
  };

  return jwt.sign(payload, secretKey,{
  expiresIn: "1h"
})
};

const getsessionID = (token) => {
  if (!token) return null;

  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    console.error("Something went wrong: " + err.message);
    return null;
  }
};

module.exports = { setsessionID, getsessionID };
