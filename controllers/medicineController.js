const Medicine = require('../models/Medicine');

exports.addMedicine = async (req, res) => {
  try {
    const { name, description, quantity, price, prescription } = req.body;
    
    const medicine = new Medicine({
      name,
      description,
      pharmacy: req.user.id,
      quantity,
      price,
      prescription
    });

    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error: error.message });
  }
};

exports.updateMedicineStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, pharmacy: req.user.id },
      { $inc: { quantity } },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine stock', error: error.message });
  }
};

exports.searchMedicines = async (req, res) => {
  try {
    const { name, inStock, pharmacyId } = req.query;
    
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (inStock) query.quantity = { $gt: 0 };
    if (pharmacyId) query.pharmacy = pharmacyId;

    const medicines = await Medicine.find(query).populate('pharmacy', 'name address');
    
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error searching medicines', error: error.message });
  }
};