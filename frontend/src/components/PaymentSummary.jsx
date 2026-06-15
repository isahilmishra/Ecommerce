import React from 'react';
import { formatCurrency } from '../utils/money';

export default function PaymentSummary({ cartItems, products, onPlaceOrder, isPlacingOrder, buttonText }) {
  const deliveryOptions = [
    { id: '1', priceCents: 0 },
    { id: '2', priceCents: 499 },
    { id: '3', priceCents: 999 }
  ];

  // Calculate pricing
  let itemsCount = 0;
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cartItems.forEach((cartItem) => {
    const product = products.find(p => p.id === cartItem.productId);
    if (product) {
      itemsCount += cartItem.quantity;
      productPriceCents += product.priceCents * cartItem.quantity;
    }
    const deliveryOption = deliveryOptions.find(opt => opt.id === cartItem.deliveryOptionId) || deliveryOptions[0];
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTax = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTax * 0.1);
  const totalCents = totalBeforeTax + taxCents;

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">
        Order Summary
      </div>

      <div className="payment-summary-row">
        <div>Items ({itemsCount}):</div>
        <div className="payment-summary-money">₹{formatCurrency(productPriceCents)}</div>
      </div>

      <div className="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div className="payment-summary-money">₹{formatCurrency(shippingPriceCents)}</div>
      </div>

      <div className="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div className="payment-summary-money">₹{formatCurrency(totalBeforeTax)}</div>
      </div>

      <div className="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div className="payment-summary-money">₹{formatCurrency(taxCents)}</div>
      </div>

      <div className="payment-summary-row total-row">
        <div>Order total:</div>
        <div className="payment-summary-money">₹{formatCurrency(totalCents)}</div>
      </div>

      <button 
        className="place-order-button button-primary"
        onClick={onPlaceOrder}
        disabled={isPlacingOrder || cartItems.length === 0}
      >
        {isPlacingOrder ? 'Processing...' : (buttonText || 'Place your order')}
      </button>
    </div>
  );
}
