const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userID: { type: mongoose.ObjectId, ref: "User" },
    parcel: String,
    sum: Number,
    weight: Number,
    length: Number,
    status: String,
    comments: String,
    pickUp: String,
    deliveryTime: Date,
    deliveryAddress: String,
    paymentType: String,
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", OrderSchema, "orders");

module.exports = Order;
