import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/money';

export default function OrderCard({ order, onBuyAgain }) {
  const [addingProductIds, setAddingProductIds] = useState({});

  const handleBuyAgain = async (productId) => {
    setAddingProductIds(prev => ({ ...prev, [productId]: true }));
    await onBuyAgain(productId);
    setAddingProductIds(prev => ({ ...prev, [productId]: false }));
  };

  const orderDate = dayjs(order.orderTime).format('MMMM D');

  return (
    <div className="order-container">
      <div className="order-header">
        <div className="order-header-left-section">
          <div className="order-date">
            <div className="order-header-label">Order Placed:</div>
            <div>{orderDate}</div>
          </div>
          <div className="order-total">
            <div className="order-header-label">Total:</div>
            <div>₹{formatCurrency(order.totalCents)}</div>
          </div>
        </div>

        <div className="order-header-right-section">
          <div className="order-header-label">Order ID:</div>
          <div>{order.orderId}</div>
        </div>
      </div>

      <div className="order-details-grid">
        {order.products.map((item, idx) => {
          const isAdding = !!addingProductIds[item.productId];
          const arrivalDate = dayjs(item.estimatedDeliveryTime).format('MMMM D');

          return (
            <React.Fragment key={`${item.productId}-${idx}`}>
              <div className="product-image-container">
                <img src={item.productImage.startsWith('http') ? item.productImage : `/${item.productImage}`} alt={item.productName} />
              </div>

              <div className="product-details">
                <div className="product-name">{item.productName}</div>
                <div className="product-delivery-date">
                  Arriving on: {arrivalDate}
                </div>
                <div className="product-quantity">Quantity: {item.quantity}</div>
                <button
                  className="buy-again-button button-primary"
                  onClick={() => handleBuyAgain(item.productId)}
                  disabled={isAdding}
                >
                  <img className="buy-again-icon" src="/images/icons/buy-again.png" alt="Buy Again" />
                  <span className="buy-again-message">
                    {isAdding ? 'Adding...' : 'Buy it again'}
                  </span>
                </button>
              </div>

              <div className="product-actions">
                <Link to={`/tracking?orderId=${order.orderId}&productId=${item.productId}`}>
                  <button className="track-package-button button-secondary">
                    Track package
                  </button>
                </Link>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
