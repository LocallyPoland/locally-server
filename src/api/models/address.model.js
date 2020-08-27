const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdressSchema = new Schema({
  userID: { type: mongoose.ObjectId, ref: "users" },
  deliveryCity: String,
  deliveryStreet: String,
  deliveryHouse: String,
  deliveryApartament: String,
  deliveryWarehouse: String,
  paymentType: String,
  deletedAt: Date,
}, {
  timestamps: true
});

const Adress = mongoose.model("Adress", AdressSchema, "adress");

module.exports = Adress;