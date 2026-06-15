import React, { useState, useEffect } from 'react';
import '../styles/components/carousel.css';

const banners = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=2000&q=80"
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="carousel-container">
      <div 
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((url, idx) => (
          <div className="carousel-slide" key={idx}>
            <img src={url} alt={`Promo ${idx + 1}`} />
          </div>
        ))}
      </div>
      
      <button className="carousel-nav-btn prev" onClick={prevSlide}>❮</button>
      <button className="carousel-nav-btn next" onClick={nextSlide}>❯</button>

      <div className="carousel-dots">
        {banners.map((_, idx) => (
          <span 
            key={idx} 
            className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
}
