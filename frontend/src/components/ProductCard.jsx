import React, { useState } from 'react';
import { formatCurrency } from '../utils/money';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    await onAddToCart(product.id, quantity);
    setShowAdded(true);
    setIsAdding(false);

    // Fade out after 2 seconds
    setTimeout(() => {
      setShowAdded(false);
    }, 2000);
  };

  const mrpCents = Math.floor(product.priceCents * 1.4);
  const discountPercent = Math.round(((mrpCents - product.priceCents) / mrpCents) * 100);

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img className="product-image" src={product.image.startsWith('http') ? product.image : `/${product.image}`} alt={product.name} />
      </div>

      <div className="product-name limit-text-to-2-lines">
        {product.name}
      </div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
          alt={`${product.rating.stars} stars`}
        />
        <div className="product-rating-count">
          ({product.rating.count})
        </div>
      </div>

      <div className="product-price-row">
        <span className="product-price">₹{formatCurrency(product.priceCents)}</span>
        <span className="product-mrp"><del>₹{formatCurrency(mrpCents)}</del></span>
        <span className="product-discount">{discountPercent}% off</span>
      </div>

      <div className="product-quantity-container">
        <select className="qty-select" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
          {[...Array(10).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              Qty: {num + 1}
            </option>
          ))}
        </select>
      </div>

      {product.type === 'clothing' && product.sizeChartLink && (
        <div className="extra-info">
          <a href={`/${product.sizeChartLink}`} target="_blank" rel="noopener noreferrer">
            Size Chart
          </a>
        </div>
      )}

      <div className="product-spacer"></div>

      <div className={`added-to-cart ${showAdded ? 'visible' : ''}`} style={{ opacity: showAdded ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}>
        <img src="/images/icons/checkmark.png" alt="Added" />
        Added to Cart
      </div>

      <button
        className="add-to-cart-button button-primary js-add-to-cart"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
