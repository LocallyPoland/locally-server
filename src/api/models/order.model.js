const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
        userID: {type: mongoose.ObjectId, ref: "User"},
        parcel: String,
        sum: Number,
        weight: Number,
        length: Number,
        status: String,
        pickUp: String,
        deliveryTime: Date,
        deliveryCity: String,
        deliveryStreet: String,
        deliveryHouse: String,
        deliveryApartament: String,
        paymentType: String,
        deletedAt: Date,
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", OrderSchema, "orders");

module.exports = Order;
