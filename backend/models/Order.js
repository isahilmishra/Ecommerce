const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderProductSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  quantity: { type: Number, required: true },
  priceCents: { type: Number, required: true },
  deliveryOptionId: { type: String, default: '1' },
  estimatedDeliveryTime: { type: Date }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    default: () => uuidv4(),
    unique: true
  },
  sessionId: {
    type: String,
    required: false,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  orderTime: {
    type: Date,
    default: Date.now
  },
  totalCents: {
    type: Number,
    required: true
  },
  products: {
    type: [orderProductSchema],
    required: true
  },
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentDetails: {
    paymentMethod: { type: String, default: 'Credit Card' },
    last4: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
