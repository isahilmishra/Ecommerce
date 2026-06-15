import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../components/Header';
import { fetchOrderById, fetchCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/shared/general.css';
import '../styles/pages/tracking.css';

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');

  const [order, setOrder] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getCartOrderId } = useAuth();

  const loadData = async () => {
    if (!orderId || !productId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [orderData, cartData] = await Promise.all([
        fetchOrderById(orderId),
        fetchCart(getCartOrderId())
      ]);
      setOrder(orderData);
      
      const totalQty = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(totalQty);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orderId, productId, getCartOrderId()]);

  if (loading) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <div className="main">
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Loading tracking information...
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <div className="main">
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Order details not found.
            <div style={{ marginTop: '15px' }}>
              <Link to="/orders" className="link-primary">Back to orders</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orderProduct = order.products.find(p => p.productId === productId);

  if (!orderProduct) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <div className="main">
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Product details not found in this order.
            <div style={{ marginTop: '15px' }}>
              <Link to="/orders" className="link-primary">Back to orders</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate dynamic delivery progress
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(orderProduct.estimatedDeliveryTime);
  const now = dayjs();

  const totalDuration = deliveryTime.diff(orderTime);
  const elapsed = now.diff(orderTime);

  // Fallback if dates are invalid
  let percent = 0;
  if (totalDuration > 0) {
    percent = Math.min(Math.max(Math.round((elapsed / totalDuration) * 100), 0), 100);
  } else {
    percent = 100; // If delivery date is in the past/same as order date
  }

  let status = 'Preparing';
  if (percent >= 100) {
    status = 'Delivered';
  } else if (percent >= 50) {
    status = 'Shipped';
  }

  const deliveryDateString = deliveryTime.format('dddd, MMMM D');

  return (
    <div>
      <Header cartCount={cartCount} />

      <div className="main">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            View all orders
          </Link>

          <div className="delivery-date">
            Arriving on {deliveryDateString}
          </div>

          <div className="product-info">
            {orderProduct.productName}
          </div>

          <div className="product-info">
            Quantity: {orderProduct.quantity}
          </div>

          <img className="product-image" src={orderProduct.productImage.startsWith('http') ? orderProduct.productImage : `/${orderProduct.productImage}`} alt={orderProduct.productName} />

          <div className="progress-labels-container">
            <div className={`progress-label ${status === 'Preparing' ? 'current-status' : ''}`}>
              Preparing
            </div>
            <div className={`progress-label ${status === 'Shipped' ? 'current-status' : ''}`}>
              Shipped
            </div>
            <div className={`progress-label ${status === 'Delivered' ? 'current-status' : ''}`}>
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
