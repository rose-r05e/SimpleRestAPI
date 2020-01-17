const mongoose = require("mongoose");

const catSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String, 
        required: true
    },
    catImage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Cat", catSchema);