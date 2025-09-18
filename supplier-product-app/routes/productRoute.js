const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAuth } = require('../middlewares/auth');

// GET /products - Show all products
router.get('/', ensureAuth, productController.index);

// GET /products/new - Show create form
router.get('/new', ensureAuth, productController.new);

// POST /products - Create product
router.post('/', ensureAuth, productController.create);

// GET /products/:id - Show product
router.get('/:id', ensureAuth, productController.show);

// GET /products/:id/edit - Show edit form
router.get('/:id/edit', ensureAuth, productController.edit);

// PUT /products/:id - Update product
router.put('/:id', ensureAuth, productController.update);

// DELETE /products/:id - Delete product
router.delete('/:id', ensureAuth, productController.destroy);

module.exports = router;
