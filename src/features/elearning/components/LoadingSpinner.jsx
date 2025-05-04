// src/components/LoadingSpinner.jsx
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = ({ size = 'md', message }) => {
  // Thêm prop size tùy chọn
  return (
    <div className='d-flex flex-column align-items-center justify-content-center my-3'>
      <div>
        <Spinner animation='border' role='status' size={size}></Spinner>
      </div>
      <div>{message || 'Đang tải dữ liệu...'}</div>
    </div>
  );
};

export default LoadingSpinner;
