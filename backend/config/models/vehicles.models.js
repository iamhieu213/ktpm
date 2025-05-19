const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
    vehicle_number : {type : String, required: true},
    category: { type: String, enum: ["Motorbike", "Car"], required: true },
    apartment_address_number: { type: Number, required: true },
    register_date: { type: Date },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
