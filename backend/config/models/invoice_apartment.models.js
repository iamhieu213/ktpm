const mongoose = require('mongoose');

const InvoiceApartmentSchema = new mongoose.Schema({
    apartment_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "Apartment" 
    },
    invoice_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "Invoice" 
    },
    payment_status: { 
        type: String, 
        enum: ["Paid", "Unpaid", "Overdue"],
        default: "Unpaid"
    },
    payment_date: { 
        type: Date 
    },
    payment_method: { 
        type: String,
        enum: ["Cash", "Bank Transfer", "Credit Card", "Other"]
    },
    amount_paid: { 
        type: Number,
        default: 0
    },
    payment_history: [{
        amount: { type: Number, required: true },
        payment_date: { type: Date, required: true },
        payment_method: { type: String, required: true },
        transaction_id: { type: String },
        notes: { type: String }
    }],
    notes: { 
        type: String 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

InvoiceApartmentSchema.index({ apartment_id: 1, invoice_id: 1 }, { unique: true });
InvoiceApartmentSchema.index({ payment_status: 1 });
InvoiceApartmentSchema.index({ payment_date: 1 });

module.exports = mongoose.model("InvoiceApartment", InvoiceApartmentSchema);
