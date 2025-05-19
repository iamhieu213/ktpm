const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        //phone: { type: String, required: true },
        password: { type: String, required: false }, 
        auth_type: { type: String, enum: ['local', 'google'], required: true },
        google_account_id: { type: String, default: null },
        avatar: { type: String, default: null },
        refresh_token: { type: String, default: null },
        is_active: { type: Boolean, default: true },
        last_login: { type: Date, default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
