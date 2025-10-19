import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import './LazyImage.css';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div ref={ref} className={`lazy-image ${className || ''}`}>
      {isIntersecting ? (
        <img src={src} alt={alt} {...props} />
      ) : (
        <div className="image-placeholder"></div>
      )}
    </div>
  );
};

export default LazyImage;
