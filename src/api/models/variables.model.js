const mongoose = require("mongoose");

const Variables = new mongoose.Schema({
  timeStart: Number,
  timeStop: Number,
  price: Number,
  priceForCustomer: Number,
});

module.exports = mongoose.model("Variables", Variables, "variables");
