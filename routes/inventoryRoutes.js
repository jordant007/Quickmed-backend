const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.post("/add", inventoryController.addInventory);
router.get("/", inventoryController.getAllInventory);
router.get("/:id", inventoryController.getInventoryById);
router.put("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);
router.get('/user/:userId', async (req, res) => {
    try {
      const inventory = await Inventory.find({ userId: req.params.userId });
      res.json(inventory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
