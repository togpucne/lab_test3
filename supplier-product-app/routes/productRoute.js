const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { ensureAuth } = require("../middlewares/auth");

const Product = require("../models/product");
const Supplier = require("../models/supplier");

// ------------------ 🔹 Route đặc biệt trước ------------------

// Search product by name
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    const suppliers = await Supplier.find();
    const products = await Product.find({ name: new RegExp(name, "i") })
                                  .populate("supplierId");

    res.render("index", {
      user: req.session.user || null,
      suppliers,
      products,
      message: products.length > 0 ? null : "Không tìm thấy sản phẩm"
    });
  } catch (err) {
    console.error("Search error:", err);
    res.redirect("/?message=Lỗi tìm kiếm");
  }
});

// Filter products by supplier
router.get("/by-supplier", async (req, res) => {
  try {
    const { supplierId } = req.query;
    const suppliers = await Supplier.find();
    let products = [];

    if (supplierId) {
      products = await Product.find({ supplierId: supplierId })
                              .populate("supplierId");
    }

    res.render("index", {
      user: req.session.user || null,
      suppliers,
      products,
      message: products.length > 0 ? null : "Không có sản phẩm nào cho supplier này"
    });
  } catch (err) {
    console.error("Filter error:", err);
    res.redirect("/?message=Lỗi lọc sản phẩm");
  }
});

// ------------------ 🔹 Route CRUD ------------------

// Homepage: show all products with suppliers
router.get("/", ensureAuth, async (req, res) => {
  try {
    const products = await Product.find().populate("supplierId");
    const suppliers = await Supplier.find();

    res.render("index", {
      user: req.session.user || null,
      suppliers,
      products,
      message: products.length > 0 ? null : "Chưa có sản phẩm nào"
    });
  } catch (err) {
    console.error("Homepage error:", err);
    res.render("index", {
      user: req.session.user || null,
      suppliers: [],
      products: [],
      message: "Không tải được dữ liệu!"
    });
  }
});

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
