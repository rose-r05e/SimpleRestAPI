const mongoose = require("mongoose");

const dogSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String, 
        required: true
    },
    dogImage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Dog", dogSchema);