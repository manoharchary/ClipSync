const mongoose = require("mongoose");

const clipSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // ⏳ 24 hours in seconds
    }
});

module.exports = mongoose.model("Clip", clipSchema);