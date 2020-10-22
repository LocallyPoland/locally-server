const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CounterSchema = new Schema(
    {
        _id: String,
        seq: Number
    }
);

const Counter = mongoose.model("Counter", CounterSchema, "counter");

module.exports = {Counter};
