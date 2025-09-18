const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { ensureAuth } = require('../middlewares/auth');

// GET /suppliers - Show all suppliers
router.get('/', ensureAuth, supplierController.index);

// GET /suppliers/new - Show create form
router.get('/new', ensureAuth, supplierController.new);

// POST /suppliers - Create supplier
router.post('/', ensureAuth, supplierController.create);

// GET /suppliers/:id - Show supplier
router.get('/:id', ensureAuth, supplierController.show);

// GET /suppliers/:id/edit - Show edit form
router.get('/:id/edit', ensureAuth, supplierController.edit);

// PUT /suppliers/:id - Update supplier
router.put('/:id', ensureAuth, supplierController.update);

// DELETE /suppliers/:id - Delete supplier
router.delete('/:id', ensureAuth, supplierController.destroy);

module.exports = router;
