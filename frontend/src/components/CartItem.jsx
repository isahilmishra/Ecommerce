import React from 'react';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/money';

const deliveryOptions = [
  { id: '1', deliveryDays: 7, priceCents: 0 },
  { id: '2', deliveryDays: 3, priceCents: 499 },
  { id: '3', deliveryDays: 1, priceCents: 999 }
];

export default function CartItem({ item, product, onUpdateQuantity, onDelete, onUpdateDelivery }) {
  if (!product) return null;

  const selectedDelivery = deliveryOptions.find(opt => opt.id === item.deliveryOptionId) || deliveryOptions[0];
  const deliveryDateString = dayjs().add(selectedDelivery.deliveryDays, 'day').format('dddd, MMMM D');

  return (
    <div className="cart-item-container">
      <div className="delivery-date">
        Delivery date: {deliveryDateString}
      </div>

      <div className="cart-item-details-grid">
        <img className="product-image" src={product.image.startsWith('http') ? product.image : `/${product.image}`} alt={product.name} />

        <div className="cart-item-details">
          <div className="product-name">
            {product.name}
          </div>
          <div className="product-price">
            ₹{formatCurrency(product.priceCents)}
          </div>
          <div className="product-quantity">
            <span>
              Quantity: <span className="quantity-label">{item.quantity}</span>
            </span>
            <span 
              className="update-quantity-link link-primary"
              style={{ marginLeft: '8px', cursor: 'pointer' }}
              onClick={() => {
                const newQty = prompt(`Enter new quantity for ${product.name}:`, item.quantity);
                const parsed = parseInt(newQty, 10);
                if (!isNaN(parsed) && parsed > 0) {
                  onUpdateQuantity(product.id, parsed);
                }
              }}
            >
              Update
            </span>
            <span 
              className="delete-quantity-link link-primary"
              style={{ marginLeft: '8px', cursor: 'pointer' }}
              onClick={() => onDelete(product.id)}
            >
              Delete
            </span>
          </div>
        </div>

        <div className="delivery-options">
          <div className="delivery-options-title">
            Choose a delivery option:
          </div>
          {deliveryOptions.map((option) => {
            const dateStr = dayjs().add(option.deliveryDays, 'day').format('dddd, MMMM D');
            const priceStr = option.priceCents === 0 ? 'FREE' : `₹${formatCurrency(option.priceCents)} -`;
            const isChecked = option.id === item.deliveryOptionId;

            return (
              <div 
                key={option.id} 
                className="delivery-option"
                onClick={() => onUpdateDelivery(product.id, option.id)}
              >
                <input
                  type="radio"
                  checked={isChecked}
                  onChange={() => onUpdateDelivery(product.id, option.id)}
                  className="delivery-option-input"
                  name={`delivery-option-${product.id}`}
                />
                <div>
                  <div className="delivery-option-date">
                    {dateStr}
                  </div>
                  <div className="delivery-option-price">
                    {priceStr} Shipping
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
