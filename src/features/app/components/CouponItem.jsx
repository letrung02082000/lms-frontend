import { PATH } from 'constants/path';
import React from 'react';
import { Button, Image, Modal } from 'react-bootstrap';
import { BsCopy } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { toastWrapper } from 'utils';

function CouponItem({ coupon }) {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);

  const handleCouponButtonClick = () => {
    if(coupon?.store?._id) {
      navigate(PATH.APP.STORE_DETAIL.replace(':storeId', coupon?.store?._id), {
        state: { backTo: PATH.EXPLORE, coupon },
      });
    }
  }

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
        >
          {coupon?.title}
        </h6>
      </div>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết ưu đãi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>{coupon?.title}</h5>
          {coupon?.store?._id && (
            <p>
              Ưu đãi dùng cho {coupon?.store?.name} từ{' '}
              {new Date(coupon?.validFrom).toLocaleDateString('en-GB')} đến{' '}
              {new Date(coupon?.validUntil).toLocaleDateString('en-GB')}.
            </p>
          )}
          <Button
            onClick={() => {
              navigator.clipboard.writeText(coupon?.code);
              toastWrapper('Đã sao chép mã ưu đãi', 'success');
            }}
            variant='outline-primary'
            className='text-center fw-bold border-primary'
          >
            <span className='me-2'>{coupon?.code}</span>
            <BsCopy />
          </Button>
          <Button variant='outline-primary' className='fw-bold ms-2' onClick={handleCouponButtonClick}>
            Dùng ngay
          </Button>
          <p>{coupon?.description}</p>
          <Image src={coupon?.image} className='w-100 rounded' />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CouponItem;
