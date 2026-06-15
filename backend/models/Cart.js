const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  deliveryOptionId: {
    type: String,
    default: '1'
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: false,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique: true,
    sparse: true,
    index: true
  },
  items: {
    type: [cartItemSchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
