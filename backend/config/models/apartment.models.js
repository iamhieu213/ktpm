const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema({
    address_number: { type: Number, required: true, unique: true },
    area: { type: Number, required: true }, 
    status: { type: String, enum: ["Residential", "Business", "Vacant"], required: true },
    type: { type: String, enum: ["1B", "2B", "3B", "4B"], required: true },
    floor: { type: Number, required: true },
    block: { type: String, required: true },
    number_of_members: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Apartment", ApartmentSchema);
