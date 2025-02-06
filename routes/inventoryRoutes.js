const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.post("/add", inventoryController.addInventory);
router.get("/", inventoryController.getAllInventory);
router.get("/:id", inventoryController.getInventoryById);
router.put("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);

module.exports = router;
