const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    invoice_number: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    issue_date: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    due_date: { 
        type: Date, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["Electricity", "Water", "Service", "Contribute"],
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);
