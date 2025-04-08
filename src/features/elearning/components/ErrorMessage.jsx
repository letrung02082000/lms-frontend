// src/components/ErrorMessage.jsx
import React from 'react';
import Alert from 'react-bootstrap/Alert';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  // Sử dụng variant="danger" cho lỗi
  return (
    <Alert variant='danger' className='mt-3'>
      {' '}
      {/* Thêm margin top */}
      <Alert.Heading as='h6'>Lỗi</Alert.Heading> {/* Thêm tiêu đề nhỏ */}
      <p className='mb-0'>{message}</p> {/* Bỏ margin bottom mặc định của p */}
    </Alert>
  );
};

export default ErrorMessage;
