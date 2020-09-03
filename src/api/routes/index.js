const User = require("./user.route");
const Order = require("./order.route");
const Address = require("./address.route");
const Settings = require('./settings.route');

module.exports = {
    User,
    Order,
    Address,
    Settings
};

//TODO: variables for price and priceForCustomers 
//TODO: variables for time when app will start working and stop working