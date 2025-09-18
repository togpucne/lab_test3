const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// GET /suppliers - Show all suppliers
router.get('/', supplierController.index);

// GET /suppliers/new - Show create form
router.get('/new', supplierController.new);

// POST /suppliers - Create supplier
router.post('/', supplierController.create);

// GET /suppliers/:id - Show supplier
router.get('/:id', supplierController.show);

// GET /suppliers/:id/edit - Show edit form
router.get('/:id/edit', supplierController.edit);

// PUT /suppliers/:id - Update supplier
router.put('/:id', supplierController.update);

// DELETE /suppliers/:id - Delete supplier
router.delete('/:id', supplierController.destroy);

module.exports = router;