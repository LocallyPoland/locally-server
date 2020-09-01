const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  userID: { type: mongoose.ObjectId, ref: "User" },
  deliveryCity: String,
  deliveryStreet: String,
  deliveryHouse: String,
  deliveryApartament: String,
  deletedAt: Date,
}, {
  timestamps: true
});

const Address = mongoose.model("Address", AddressSchema, "address");

module.exports = Address;
