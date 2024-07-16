const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://horsman:O7cuZ373TI03QWyp@books.5mis1h3.mongodb.net/school-app?retryWrites=true&w=majority&appName=Books/school-app"
);
const db = mongoose.connection;

module.exports = db;
