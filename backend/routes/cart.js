const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Helper to find a cart by userId or sessionId
const findCart = async (id) => {
  let cart = null;
  // If it's a valid MongoDB ObjectId format, check userId first
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    cart = await Cart.findOne({ userId: id });
  }
  if (!cart) {
    cart = await Cart.findOne({ sessionId: id });
  }
  return cart;
};

// GET /api/cart/:id — Get cart for a user or session
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let cart = await findCart(id);
    if (!cart) {
      // Create a default structure if not found
      cart = { items: [] };
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/cart — Add item to cart
router.post('/', async (req, res) => {
  try {
    const { sessionId, userId, productId, quantity = 1, deliveryOptionId = '1' } = req.body;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId or userId is required' });
    }

    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      cart = new Cart({
        sessionId: userId ? undefined : sessionId,
        userId: userId || undefined,
        items: []
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, deliveryOptionId });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/cart — Update a cart item (quantity or delivery option)
router.put('/', async (req, res) => {
  try {
    const { sessionId, userId, productId, quantity, deliveryOptionId } = req.body;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId or userId is required' });
    }

    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity !== undefined) item.quantity = quantity;
    if (deliveryOptionId !== undefined) item.deliveryOptionId = deliveryOptionId;

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error updating cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/cart/:id/:productId — Remove item from cart
router.delete('/:id/:productId', async (req, res) => {
  try {
    const { id, productId } = req.params;

    let cart = await findCart(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error removing from cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/cart/merge — Merge guest cart into user cart on login
router.post('/merge', async (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      return res.status(400).json({ message: 'sessionId and userId are required' });
    }

    // Find the guest cart and the user's cart
    const guestCart = await Cart.findOne({ sessionId });
    let userCart = await Cart.findOne({ userId });

    if (!guestCart || guestCart.items.length === 0) {
      // No guest cart to merge, just return user's cart (or create one)
      if (!userCart) {
        userCart = new Cart({ userId, items: [] });
        await userCart.save();
      }
      return res.json(userCart);
    }

    if (!userCart) {
      // User has no cart yet, we can convert the guest cart to user cart
      guestCart.userId = userId;
      guestCart.sessionId = undefined; // clear session link
      await guestCart.save();
      return res.json(guestCart);
    }

    // Both carts exist. Merge items.
    guestCart.items.forEach(guestItem => {
      const existingUserItem = userCart.items.find(item => item.productId === guestItem.productId);
      if (existingUserItem) {
        existingUserItem.quantity += guestItem.quantity;
        // Keep the faster shipping selection if conflict
        if (guestItem.deliveryOptionId > existingUserItem.deliveryOptionId) {
          existingUserItem.deliveryOptionId = guestItem.deliveryOptionId;
        }
      } else {
        userCart.items.push(guestItem);
      }
    });

    await userCart.save();

    // Delete guest cart since it's merged
    await Cart.deleteOne({ sessionId });

    res.json(userCart);
  } catch (error) {
    console.error('Error merging carts:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
