import React from 'react';
import { Button } from 'react-bootstrap';
import { MdChevronLeft } from 'react-icons/md';

function BackButton() {
  return (
    <Button
      variant='outline-primary'
      className='mb-4 d-flex align-items-center'
      onClick={() => {
        window.history.back();
      }}
    >
      <MdChevronLeft size={25}/>
      <span>Quay lại</span>
    </Button>
  );
}

export default BackButton;
