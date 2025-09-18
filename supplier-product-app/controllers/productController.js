


// controllers/productController.js
const Product = require("../models/product");
const Supplier = require("../models/supplier");

module.exports = {
  // Hiển thị tất cả sản phẩm (trang riêng /products)
  index: async (req, res) => {
    try {
      const products = await Product.find().populate("supplierId");
      const suppliers = await Supplier.find();

      res.render("products/index", {
        products,
        suppliers,
        user: req.session.user || null,
        message: products.length > 0 ? null : "Chưa có sản phẩm nào"
      });
    } catch (err) {
      console.error("Error loading products:", err);
      res.render("products/index", {
        products: [],
        suppliers: [],
        user: req.session.user || null,
        message: "Không tải được dữ liệu!"
      });
    }
  },

  // Form tạo sản phẩm mới
  new: async (req, res) => {
    try {
      const suppliers = await Supplier.find();
      res.render("products/new", { suppliers, user: req.session.user || null });
    } catch (err) {
      console.error(err);
      res.redirect("/products");
    }
  },

  // Tạo sản phẩm
  create: async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.redirect("/products");
    } catch (err) {
      console.error("Error creating product:", err);
      res.redirect("/products/new");
    }
  },

  // Form edit sản phẩm
  edit: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const suppliers = await Supplier.find();
      res.render("products/edit", { product, suppliers, user: req.session.user || null });
    } catch (err) {
      console.error("Error loading edit form:", err);
      res.redirect("/products");
    }
  },

  // Cập nhật sản phẩm
  update: async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, req.body);
      res.redirect("/products");
    } catch (err) {
      console.error("Error updating product:", err);
      res.redirect(`/products/${req.params.id}/edit`);
    }
  },

  // Xóa sản phẩm
  destroy: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.redirect("/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      res.redirect("/products");
    }
  },

  // Hiển thị chi tiết sản phẩm
  show: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate("supplierId");
      res.render("products/show", { product, user: req.session.user || null });
    } catch (err) {
      console.error("Error showing product:", err);
      res.redirect("/products");
    }
  }
};
