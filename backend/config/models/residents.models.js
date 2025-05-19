const mongoose = require("mongoose");

const ResidentSchema = new mongoose.Schema({
    address_number : {type: Number, required: false},
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: Number, default: 0, enum: [0, 1] },
    phone : {type : String, require : true},
    id_card_number: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Owner", "Family Member", "Guest"], required: true },
    id_card_verified_at: { type: Date, default: null },
    status_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Resident", ResidentSchema);
