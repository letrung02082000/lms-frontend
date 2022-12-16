import React from 'react';
import { Pagination } from 'react-bootstrap';

function Pagy({ onPrevClick, onNextClick, current }) {
  return (
    <Pagination>
      <Pagination.Prev onClick={onPrevClick} />
      <Pagination.Ellipsis />
      <Pagination.Item>{current || '1'}</Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Next onClick={onNextClick} />
    </Pagination>
  );
}

export default Pagy;
