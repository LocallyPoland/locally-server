const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userID: { type: mongoose.ObjectId, ref: "users" },
  parcel: Array,
  sum: Number,
  status: String,
  pickUp: String,
  deliveryCity: String,
  deliveryStreet: String,
  deliveryHouse: String,
  deliveryApartament: String,
  deliveryWarehouse: String,
  paymentType: String,
  deletedAt: Date,
}, {
  timestamps: true
}
);

const Order = mongoose.model("Order", OrderSchema, "orders");

module.exports = Order;
