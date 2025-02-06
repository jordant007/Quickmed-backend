const Inventory = require("../models/Inventory");

// Add New Inventory Item
exports.addInventory = async (req, res) => {
  try {
    const { name, description, quantity, price, category, expiryDate, supplier } = req.body;

    const newInventory = new Inventory({
      name,
      description,
      quantity,
      price,
      category,
      expiryDate,
      supplier,
    });

    const savedInventory = await newInventory.save();
    res.status(201).json(savedInventory);
  } catch (error) {
    res.status(500).json({ message: "Error adding inventory", error });
  }
};

// Get All Inventory Items
exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error });
  }
};

// Get Single Inventory Item
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Item not found" });

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory item", error });
  }
};

// Update Inventory Item
exports.updateInventory = async (req, res) => {
  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedInventory) return res.status(404).json({ message: "Item not found" });

    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory", error });
  }
};

// Delete Inventory Item
exports.deleteInventory = async (req, res) => {
  try {
    const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedInventory) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Inventory item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory", error });
  }
};
