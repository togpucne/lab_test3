const Supplier = require('../models/supplier');

// Get all suppliers
exports.index = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.render('suppliers/index', { suppliers });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Show create form
exports.new = (req, res) => {
  res.render('suppliers/new');
};

// Create supplier
exports.create = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const supplier = new Supplier({ name, address, phone });
    await supplier.save();
    res.redirect('/suppliers');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Show supplier
exports.show = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    res.render('suppliers/show', { supplier });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Show edit form
exports.edit = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    res.render('suppliers/edit', { supplier });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update supplier
exports.update = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    await Supplier.findByIdAndUpdate(req.params.id, { name, address, phone });
    res.redirect('/suppliers');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete supplier
exports.destroy = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.redirect('/suppliers');
  } catch (error) {
    res.status(500).send(error.message);
  }
};