const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdressSchema = new Schema({
  userID: { type: mongoose.ObjectId, ref: "users" },
  deliveryCity: String,
  deliveryStreet: String,
  deliveryHouse: String,
  deliveryApartament: String,
  deletedAt: Date,
}, {
  timestamps: true
});

const Adress = mongoose.model("Adress", AdressSchema, "address");

module.exports = Adress;
