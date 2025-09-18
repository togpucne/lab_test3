const Product = require('../models/product');
const Supplier = require('../models/supplier');

// Get all products
exports.index = async (req, res) => {
  try {
    const products = await Product.find().populate('supplierId');
    res.render('products/index', { products });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Show create form
exports.new = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.render('products/new', { suppliers });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create product
exports.create = async (req, res) => {
  try {
    const { name, price, quantity, supplierId } = req.body;
    const product = new Product({ name, price, quantity, supplierId });
    await product.save();
    res.redirect('/products');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Show product
exports.show = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId');
    res.render('products/show', { product });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Show edit form
exports.edit = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const suppliers = await Supplier.find();
    res.render('products/edit', { product, suppliers });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update product
exports.update = async (req, res) => {
  try {
    const { name, price, quantity, supplierId } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, quantity, supplierId });
    res.redirect('/products');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete product
exports.destroy = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error.message);
  }
};