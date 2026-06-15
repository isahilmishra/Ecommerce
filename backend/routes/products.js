const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products — Get all products
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { name: searchRegex },
          { keywords: searchRegex }
        ]
      };
    }

    const products = await Product.find(query).select('-__v -createdAt -updatedAt');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id — Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).select('-__v -createdAt -updatedAt');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
