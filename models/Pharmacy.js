const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  locationLink: { type: String },
  medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
}, { timestamps: true });

module.exports = mongoose.model('Pharmacy', PharmacySchema);