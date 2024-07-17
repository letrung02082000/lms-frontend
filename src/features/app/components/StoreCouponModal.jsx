import couponApi from 'api/couponApi';
import Loading from 'components/Loading';
import React, { useEffect } from 'react';
import { Button, Col, Image, Modal, Row } from 'react-bootstrap';
import { formatCurrency } from 'utils/commonUtils';

function StoreCouponModal({ show, setShow, storeId, addCoupon }) {
  const [coupons, setCoupons] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    couponApi
      .queryCoupons({ store: storeId })
      .then((res) => {
        setCoupons(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [storeId]);

  const handleCouponButtonClick = (coupon) => {
    addCoupon(coupon);
    setShow(false);
  };

  return (
    <>
      <Modal show={show} closeButton onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nhập ưu đãi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Loading />}
          {!loading &&
            coupons.map((coupon) => {
              return (
                <Row className='border mb-2 p-2 rounded'>
                  <Col>
                    <Image src={coupon?.image} className='w-100 rounded' />
                  </Col>
                  <Col xs={8}>
                    <h6>{coupon?.title}</h6>
                    {coupon?.store?._id && (
                      <div className='mb-2'>
                        <small>
                          Ưu đãi dùng cho đơn cửa hàng{' '}
                          <strong>{coupon?.store?.name}</strong> từ{' '}
                          {formatCurrency(coupon?.minValue)}đ.
                          <br />
                          Thời gian áp dụng:{' '}
                          {new Date(coupon?.validFrom).toLocaleDateString(
                            'en-GB'
                          )}{' '}
                          -{' '}
                          {new Date(coupon?.validUntil).toLocaleDateString(
                            'en-GB'
                          )}
                          .
                        </small>
                      </div>
                    )}
                    <div className='d-flex justify-content-end'>
                      <Button
                        variant='outline-primary'
                        className='fw-bold'
                        onClick={() => handleCouponButtonClick(coupon)}
                      >
                        Dùng ngay
                      </Button>
                    </div>
                  </Col>
                </Row>
              );
            })}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default StoreCouponModal;
