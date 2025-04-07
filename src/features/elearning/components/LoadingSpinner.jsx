// src/components/LoadingSpinner.jsx
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = ({ size = 'md' }) => {
  // Thêm prop size tùy chọn
  return (
    <div className='d-flex justify-content-center my-3'>
      {' '}
      {/* Căn giữa và thêm margin */}
      <Spinner animation='border' role='status' size={size}>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
