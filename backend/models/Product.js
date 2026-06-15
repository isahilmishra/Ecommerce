const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    stars: { type: Number, required: true },
    count: { type: Number, required: true }
  },
  priceCents: {
    type: Number,
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    default: null
  },
  sizeChartLink: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
