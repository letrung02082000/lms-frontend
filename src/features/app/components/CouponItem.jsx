import { PATH } from 'constants/path';
import React from 'react';
import { Image, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CouponItem({ coupon }) {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);

  return (
    <>
    <div onClick={() => setShow(true)}>
      <div className='w-100 mb-2'>
        <Image src={coupon?.image} className='w-100 rounded' />
      </div>
      <h6
        style={{
          fontSize: '0.9rem',
        }}
      >{coupon?.title}</h6>
    </div>
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết ưu đãi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{coupon?.title}</h5>
        <p>Ưu đãi dùng cho {coupon?.store?.name}.</p>
        <p>{coupon?.description}</p>
        <Image src={coupon?.image} className='w-100 rounded' />
      </Modal.Body>
    </Modal>
    </>
  );
}

export default CouponItem;
