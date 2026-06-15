import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import PaymentSummary from '../components/PaymentSummary';
import { fetchCart, fetchProducts, updateCartItem, removeFromCart, placeOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/shared/general.css';
import '../styles/pages/checkout/checkout-header.css';
import '../styles/pages/checkout/checkout.css';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const { getCartOrderId, getIdentifier } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const [cartData, productsData] = await Promise.all([
        fetchCart(getCartOrderId()),
        fetchProducts()
      ]);
      setCartItems(cartData?.items || []);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading checkout data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [getCartOrderId()]);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const updatedCart = await updateCartItem(getIdentifier(), productId, { quantity });
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleUpdateDelivery = async (productId, deliveryOptionId) => {
    try {
      const updatedCart = await updateCartItem(getIdentifier(), productId, { deliveryOptionId });
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      console.error('Error updating delivery option:', error);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      const updatedCart = await removeFromCart(getCartOrderId(), productId);
      setCartItems(updatedCart?.items || []);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handlePlaceOrder = () => {
    navigate('/payment');
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/">
              ApexStore
            </Link>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (<Link className="return-to-home-link" to="/">{totalItemsCount} items</Link>)
          </div>

          <div className="checkout-header-right-section">
            <img src="/images/icons/checkout-lock-icon.png" alt="Lock Icon" />
          </div>
        </div>
      </div>

      <div className="main">
        <div className="page-title">Review your order</div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Loading checkout items...
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Your cart is empty. <Link to="/" className="link-primary">Shop products</Link>
          </div>
        ) : (
          <div className="checkout-grid">
            <div className="order-summary">
              {cartItems.map((item) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <CartItem
                    key={item.productId}
                    item={item}
                    product={product}
                    onUpdateQuantity={handleUpdateQuantity}
                    onDelete={handleDeleteItem}
                    onUpdateDelivery={handleUpdateDelivery}
                  />
                );
              })}
            </div>

            <PaymentSummary
              cartItems={cartItems}
              products={products}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={false}
              buttonText="Proceed to Payment"
            />
          </div>
        )}
      </div>
    </div>
  );
}
