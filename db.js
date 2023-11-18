const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectToDB = async () => {
  return await mongoose.connect(MONGO_URI);
};

module.exports = {
  connectToDB,
};
