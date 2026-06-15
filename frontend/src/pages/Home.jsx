import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import { fetchProducts, addToCart, fetchCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/amazon.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchWord = searchParams.get('search') || '';
  const { getCartOrderId, getIdentifier } = useAuth();

  // Fetch products and cart count
  const loadData = async () => {
    try {
      setLoading(true);
      const cartId = getCartOrderId();
      const [productsData, cartData] = await Promise.all([
        fetchProducts(searchWord),
        fetchCart(cartId)
      ]);
      setProducts(productsData);
      
      // Calculate total quantity of items in cart
      const totalQty = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(totalQty);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchWord, getCartOrderId()]);

  const handleAddToCart = async (productId, quantity) => {
    try {
      const updatedCart = await addToCart(getIdentifier(), productId, quantity);
      const totalQty = updatedCart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(totalQty);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleSearch = (searchVal) => {
    setSearchParams(searchVal ? { search: searchVal } : {});
  };

  return (
    <div>
      <Header cartCount={cartCount} onSearch={handleSearch} />
      
      <div className="main" style={{ marginTop: '100px', padding: '0', maxWidth: '100%' }}>
        {!searchWord && <Carousel />}
        
        <div style={{ padding: '0 20px', maxWidth: '1400px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
              No products found matching "{searchWord}"
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
