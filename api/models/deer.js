const mongoose = require("mongoose");

const deerSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String, 
        required: true
    },
    deerImage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Deer", deerSchema);