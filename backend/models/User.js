const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    points: {
        jee: {type: Number, default: 0},
        neet: {type: Number, default: 0},
        gate: {type: Number, default: 0}
    }
});

module.exports = mongoose.model("User", userSchema);