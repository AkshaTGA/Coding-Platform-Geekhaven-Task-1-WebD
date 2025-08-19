const mongoose = require("mongoose");

const ConnectToMongoDB = async (url) => {
  return await mongoose.connect(url);
};

module.exports = ConnectToMongoDB;
