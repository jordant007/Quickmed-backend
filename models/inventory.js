const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String },
    expiryDate: { type: Date },
    supplier: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
