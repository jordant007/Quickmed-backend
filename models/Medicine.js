const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  prescription: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);