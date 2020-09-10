const mongoose = require("mongoose");

const Variables = new mongoose.Schema({
    timeStart: Number,
    timeStop: Number,
    price: Number,
    priceForCustomer: Number,
    switcher: Boolean
});

module.exports = mongoose.model("Variables", Variables, "variables");
