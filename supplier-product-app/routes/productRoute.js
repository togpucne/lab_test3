const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { ensureAuth } = require("../middlewares/auth");

// Show all products (trang riêng)
router.get("/", ensureAuth, productController.index);

// Show create product form
router.get("/new", ensureAuth, productController.new);

// Create product
router.post("/", ensureAuth, productController.create);

// Show edit form
router.get("/:id/edit", ensureAuth, productController.edit);

// Update product
router.put("/:id", ensureAuth, productController.update);

// Delete product
router.delete("/:id", ensureAuth, productController.destroy);

// Show product detail
router.get("/:id", ensureAuth, productController.show);

module.exports = router;