import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/shared/general.css';
import '../styles/shared/amazon-header.css';

export default function Header({ cartCount = 0, onSearch }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(search);
    } else {
      navigate(`/?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <>
      <header className="apex-header">
        <div className="header-left">
          <Link to="/" className="header-logo">
            <span className="header-logo-icon">⚡</span> ApexStore
          </Link>
        </div>

        <form className="header-center search-form" onSubmit={handleSearchSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <div className="header-right">
          <Link className="header-link" to="/orders">
            <span>📦</span>
            <span>Orders</span>
          </Link>

          <Link className="header-link" to="/checkout">
            <span>🛒</span>
            <span>Cart</span>
            <span className="cart-badge">{cartCount}</span>
          </Link>

          <div className="header-user-area">
            {user ? (
              <>
                <span className="user-greeting">Hi, <strong>{user.name.split(' ')[0]}</strong></span>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/auth">
                <button className="header-auth-btn">Login</button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="subheader">
        {['Electronics', 'TVs & Appliances', 'Men', 'Women', 'Baby & Kids', 'Home & Furniture', 'Sports, Books & More', 'Flights', 'Offer Zone'].map(category => (
          <span 
            key={category} 
            className="subheader-link" 
            onClick={() => {
              if (onSearch) {
                onSearch(category);
              } else {
                navigate(`/?search=${encodeURIComponent(category)}`);
              }
            }}
          >
            {category}
          </span>
        ))}
      </div>
    </>
  );
}
