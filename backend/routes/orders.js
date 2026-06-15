const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Delivery options (same as frontend)
const deliveryOptions = [
  { id: '1', deliveryDays: 7, priceCents: 0 },
  { id: '2', deliveryDays: 3, priceCents: 499 },
  { id: '3', deliveryDays: 1, priceCents: 999 }
];

function getDeliveryOption(id) {
  return deliveryOptions.find(opt => opt.id === id) || deliveryOptions[0];
}

// POST /api/orders — Place a new order from cart
router.post('/', async (req, res) => {
  try {
    const { sessionId, userId, shippingAddress, paymentDetails } = req.body;

    if (!sessionId && !userId) {
      return res.status(400).json({ message: 'sessionId or userId is required' });
    }

    // Find the cart associated with user or session
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order products with full details
    let totalCents = 0;
    const orderProducts = [];

    for (const cartItem of cart.items) {
      const product = await Product.findOne({ id: cartItem.productId });
      if (!product) continue;

      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      const itemTotal = product.priceCents * cartItem.quantity;
      const shippingCents = deliveryOption.priceCents;

      const estimatedDeliveryTime = new Date();
      estimatedDeliveryTime.setDate(estimatedDeliveryTime.getDate() + deliveryOption.deliveryDays);

      orderProducts.push({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        quantity: cartItem.quantity,
        priceCents: product.priceCents,
        deliveryOptionId: cartItem.deliveryOptionId,
        estimatedDeliveryTime
      });

      totalCents += itemTotal + shippingCents;
    }

    // Add 10% tax
    const taxCents = Math.round(totalCents * 0.1);
    totalCents += taxCents;

    const order = new Order({
      sessionId: userId ? undefined : sessionId,
      userId: userId || undefined,
      totalCents,
      products: orderProducts,
      shippingAddress,
      paymentDetails
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/:id — Get all orders for a user or session
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let query = { sessionId: id };

    // If it's a valid MongoDB ObjectId format, check userId
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { userId: id };
    }

    const orders = await Order.find(query)
      .sort({ orderTime: -1 })
      .select('-__v -createdAt -updatedAt');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/detail/:orderId — Get a single order by orderId
router.get('/detail/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .select('-__v -createdAt -updatedAt');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
