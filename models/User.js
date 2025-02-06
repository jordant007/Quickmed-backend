const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    pharmacyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
