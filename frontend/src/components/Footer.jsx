import React from 'react';
import '../styles/components/footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-column">
          <div className="footer-title">ABOUT</div>
          <a href="#" className="footer-link">Contact Us</a>
          <a href="#" className="footer-link">About Us</a>
          <a href="#" className="footer-link">Careers</a>
          <a href="#" className="footer-link">Press</a>
          <a href="#" className="footer-link">Corporate Information</a>
        </div>
        <div className="footer-column">
          <div className="footer-title">HELP</div>
          <a href="#" className="footer-link">Payments</a>
          <a href="#" className="footer-link">Shipping</a>
          <a href="#" className="footer-link">Cancellation & Returns</a>
          <a href="#" className="footer-link">FAQ</a>
          <a href="#" className="footer-link">Report Infringement</a>
        </div>
        <div className="footer-column">
          <div className="footer-title">CONSUMER POLICY</div>
          <a href="#" className="footer-link">Return Policy</a>
          <a href="#" className="footer-link">Terms Of Use</a>
          <a href="#" className="footer-link">Security</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Sitemap</a>
        </div>
        <div className="footer-column footer-border-left">
          <div className="footer-title">Mail Us:</div>
          <p className="footer-text">
            ApexStore Internet Private Limited, <br/>
            Buildings Alyssa, Begonia & <br/>
            Clove Embassy Tech Village, <br/>
            Outer Ring Road, Devarabeesanahalli Village, <br/>
            Bengaluru, 560103, <br/>
            Karnataka, India
          </p>
        </div>
        <div className="footer-column">
          <div className="footer-title">Registered Office Address:</div>
          <p className="footer-text">
            ApexStore Internet Private Limited, <br/>
            Buildings Alyssa, Begonia & <br/>
            Clove Embassy Tech Village, <br/>
            Outer Ring Road, Devarabeesanahalli Village, <br/>
            Bengaluru, 560103, <br/>
            Karnataka, India <br/>
            CIN : U51109KA2012PTC066107 <br/>
            Telephone: 044-45614700
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <a href="#"><span>🛍️</span> Become a Seller</a>
          <a href="#"><span>⭐</span> Advertise</a>
          <a href="#"><span>🎁</span> Gift Cards</a>
          <a href="#"><span>❓</span> Help Center</a>
          <span>© 2007-2026 ApexStore.com</span>
        </div>
        <div className="footer-payment-methods">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg" alt="Payment Methods" />
        </div>
      </div>
    </footer>
  );
}
