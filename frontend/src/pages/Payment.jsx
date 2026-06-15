import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PaymentSummary from '../components/PaymentSummary';
import { fetchCart, fetchProducts, placeOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/shared/general.css';
import '../styles/pages/payment.css';

export default function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const { getCartOrderId, getIdentifier } = useAuth();

  // Shipping Form State
  const [shipping, setShipping] = useState(() => {
    const saved = localStorage.getItem('savedShipping');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    };
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem('savedPaymentMethod') || 'credit_card';
  });
  const [payment, setPayment] = useState(() => {
    const saved = localStorage.getItem('savedCard');
    return saved ? JSON.parse(saved) : {
      cardNumber: '',
      expiry: '',
      cvv: ''
    };
  });
  const [upiId, setUpiId] = useState(() => {
    return localStorage.getItem('savedUpi') || '';
  });
  const [bank, setBank] = useState(() => {
    return localStorage.getItem('savedBank') || '';
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cartData, productsData] = await Promise.all([
          fetchCart(getCartOrderId()),
          fetchProducts()
        ]);
        setCartItems(cartData?.items || []);
        setProducts(productsData);

        if (!cartData?.items || cartData.items.length === 0) {
          navigate('/checkout'); // Redirect back if cart is empty
        }
      } catch (error) {
        console.error('Error loading payment data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [getCartOrderId(), navigate]);

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length >= 3) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
      }
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }
    setPayment({ ...payment, [name]: value });
  };

  const handlePlaceOrder = async () => {
    // Basic Validation
    if (!shipping.fullName || !shipping.addressLine1 || !shipping.city || !shipping.zipCode) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    let last4 = '';
    let methodString = '';

    if (paymentMethod === 'credit_card') {
      if (payment.cardNumber.length < 19 || payment.expiry.length < 5 || payment.cvv.length < 3) {
        alert("Please enter valid credit card details.");
        return;
      }
      last4 = payment.cardNumber.slice(-4);
      methodString = 'Credit Card';
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        alert("Please enter a valid UPI ID.");
        return;
      }
      last4 = upiId;
      methodString = 'UPI';
    } else if (paymentMethod === 'net_banking') {
      if (!bank) {
        alert("Please select a bank.");
        return;
      }
      last4 = bank;
      methodString = 'Net Banking';
    }

    try {
      setIsPlacingOrder(true);
      
      // Save form state to localStorage
      localStorage.setItem('savedShipping', JSON.stringify(shipping));
      localStorage.setItem('savedPaymentMethod', paymentMethod);
      if (paymentMethod === 'credit_card') {
        localStorage.setItem('savedCard', JSON.stringify(payment));
      } else if (paymentMethod === 'upi') {
        localStorage.setItem('savedUpi', upiId);
      } else if (paymentMethod === 'net_banking') {
        localStorage.setItem('savedBank', bank);
      }

      const orderData = {
        shippingAddress: shipping,
        paymentDetails: { paymentMethod: methodString, last4 }
      };

      const order = await placeOrder(getIdentifier(), orderData);
      
      // Navigate to tracking for the first product in the new order
      if (order && order.orderId && order.products && order.products.length > 0) {
        navigate(`/tracking?orderId=${order.orderId}&productId=${order.products[0].productId}`);
      } else {
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <Header cartCount={totalItemsCount} />

      <div className="main payment-page-container">
        {loading ? (
           <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
             Loading your secure checkout...
           </div>
        ) : (
          <div className="payment-content">
            <div className="payment-form-section">
              <div className="section-title">Shipping Address</div>
              <div className="form-grid">
                <div className="form-group-full">
                  <label className="payment-label">Full Name</label>
                  <input type="text" name="fullName" className="payment-input" placeholder="John Doe" value={shipping.fullName} onChange={handleShippingChange} required />
                </div>
                <div className="form-group-full">
                  <label className="payment-label">Address Line 1</label>
                  <input type="text" name="addressLine1" className="payment-input" placeholder="123 Galaxy Way" value={shipping.addressLine1} onChange={handleShippingChange} required />
                </div>
                <div>
                  <label className="payment-label">City</label>
                  <input type="text" name="city" className="payment-input" placeholder="Mumbai" value={shipping.city} onChange={handleShippingChange} required />
                </div>
                <div>
                  <label className="payment-label">State / Province</label>
                  <input type="text" name="state" className="payment-input" placeholder="MH" value={shipping.state} onChange={handleShippingChange} required />
                </div>
                <div>
                  <label className="payment-label">Pincode</label>
                  <input type="text" name="zipCode" className="payment-input" placeholder="400001" value={shipping.zipCode} onChange={handleShippingChange} required />
                </div>
                <div>
                  <label className="payment-label">Country</label>
                  <input type="text" name="country" className="payment-input" value={shipping.country} onChange={handleShippingChange} required />
                </div>
              </div>

              <div className="section-title" style={{ marginTop: '20px' }}>Payment Method</div>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="paymentMethod" value="credit_card" checked={paymentMethod === 'credit_card'} onChange={() => setPaymentMethod('credit_card')} />
                  <span style={{ color: 'var(--text-primary)' }}>Credit Card</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                  <span style={{ color: 'var(--text-primary)' }}>UPI</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="paymentMethod" value="net_banking" checked={paymentMethod === 'net_banking'} onChange={() => setPaymentMethod('net_banking')} />
                  <span style={{ color: 'var(--text-primary)' }}>Net Banking</span>
                </label>
              </div>

              {paymentMethod === 'credit_card' && (
                <>
                  <div className="credit-card-preview">
                    <div className="card-chip"></div>
                    <div className="card-number-preview">
                      {payment.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-details-preview">
                      <div>Name on Card <span>{shipping.fullName || 'CARDHOLDER NAME'}</span></div>
                      <div>Valid Thru <span>{payment.expiry || 'MM/YY'}</span></div>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group-full">
                      <label className="payment-label">Card Number</label>
                      <input type="text" name="cardNumber" className="payment-input" placeholder="0000 0000 0000 0000" value={payment.cardNumber} onChange={handlePaymentChange} required />
                    </div>
                    <div>
                      <label className="payment-label">Expiration Date</label>
                      <input type="text" name="expiry" className="payment-input" placeholder="MM/YY" value={payment.expiry} onChange={handlePaymentChange} required />
                    </div>
                    <div>
                      <label className="payment-label">CVV</label>
                      <input type="password" name="cvv" className="payment-input" placeholder="123" value={payment.cvv} onChange={handlePaymentChange} required />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div className="form-grid" style={{ marginBottom: '20px' }}>
                  <div className="form-group-full">
                    <label className="payment-label">UPI ID</label>
                    <input type="text" className="payment-input" placeholder="username@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} required />
                  </div>
                </div>
              )}

              {paymentMethod === 'net_banking' && (
                <div className="form-grid" style={{ marginBottom: '20px' }}>
                  <div className="form-group-full">
                    <label className="payment-label">Select Bank</label>
                    <select className="payment-input" value={bank} onChange={(e) => setBank(e.target.value)} required>
                      <option value="">Choose a bank...</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="Axis">Axis Bank</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="payment-summary-sticky">
              <PaymentSummary
                cartItems={cartItems}
                products={products}
                onPlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
                buttonText="Simulate Payment"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
