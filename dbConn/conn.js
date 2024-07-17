const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
const db = mongoose.connection;

module.exports = db;
