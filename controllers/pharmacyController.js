const Pharmacy = require('../models/Pharmacy');

exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().populate('medicines');
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPharmacy = async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();
    res.status(201).json(pharmacy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json({ message: 'Pharmacy deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
