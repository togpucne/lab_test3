const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products - Show all products
router.get('/', productController.index);

// GET /products/new - Show create form
router.get('/new', productController.new);

// POST /products - Create product
router.post('/', productController.create);

// GET /products/:id - Show product
router.get('/:id', productController.show);

// GET /products/:id/edit - Show edit form
router.get('/:id/edit', productController.edit);

// PUT /products/:id - Update product
router.put('/:id', productController.update);

// DELETE /products/:id - Delete product
router.delete('/:id', productController.destroy);

module.exports = router;