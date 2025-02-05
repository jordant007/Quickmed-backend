const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const { findNearbyPharmacies } = require('../config/googleMapsConfig');

exports.createPharmacy = async (req, res) => {
  try {
    const { name, address, phone, email, location, operatingHours, services } = req.body;
    
    const pharmacy = new Pharmacy({
      name,
      owner: req.user.id,
      address,
      phone,
      email,
      location: {
        type: 'Point',
        coordinates: location
      },
      operatingHours,
      services
    });

    await pharmacy.save();
    res.status(201).json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: 'Error creating pharmacy', error: error.message });
  }
};

exports.updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pharmacy', error: error.message });
  }
};

exports.findNearbyPharmacies = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    // First, use Google Maps to find nearby pharmacies
    const googlePharmacies = await findNearbyPharmacies(latitude, longitude);
    
    // Then, find pharmacies in our database near this location
    const dbPharmacies = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          distanceField: 'distance',
          maxDistance: 5000, // 5 km
          spherical: true
        }
      },
      {
        $lookup: {
          from: 'medicines',
          localField: '_id',
          foreignField: 'pharmacy',
          as: 'medicines'
        }
      }
    ]);

    // Combine and enrich results
    const combinedResults = dbPharmacies.map(pharmacy => ({
      ...pharmacy,
      medicines: pharmacy.medicines.map(med => med.name)
    }));

    res.json({
      googleResults: googlePharmacies,
      databaseResults: combinedResults
    });
  } catch (error) {
    res.status(500).json({ message: 'Error finding pharmacies', error: error.message });
  }
};