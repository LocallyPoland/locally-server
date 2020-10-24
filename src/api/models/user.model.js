const mongoose = require("mongoose");

const User = new mongoose.Schema({
        fName: String,
        lName: String,
        email: String,
        phone: Number,
        password: String,
        address: [{type: mongoose.ObjectId, ref: "Address"}],
        facebookID: String,
        gallery: String,
        role: Boolean,
        isVerified: Boolean,
        deletedAt: Date,
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", User, "users");
