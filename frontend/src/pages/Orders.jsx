import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import OrderCard from '../components/OrderCard';
import { fetchOrders, fetchCart, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/shared/general.css';
import '../styles/pages/orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getCartOrderId, getIdentifier } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, cartData] = await Promise.all([
        fetchOrders(getCartOrderId()),
        fetchCart(getCartOrderId())
      ]);
      setOrders(ordersData);
      
      const totalQty = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(totalQty);
    } catch (error) {
      console.error('Error loading orders data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [getCartOrderId()]);

  const handleBuyAgain = async (productId) => {
    try {
      const updatedCart = await addToCart(getIdentifier(), productId, 1);
      const totalQty = updatedCart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(totalQty);
    } catch (error) {
      console.error('Error in buy again action:', error);
    }
  };

  return (
    <div>
      <Header cartCount={cartCount} />

      <div className="main">
        <div className="page-title">Your Orders</div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            You have not placed any orders yet.
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onBuyAgain={handleBuyAgain}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
