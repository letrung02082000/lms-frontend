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
      <Modal show={show} closeButton onHide={() => setShow(false)} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Ưu đãi cửa hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Loading />}
          {!loading &&
            coupons.map((coupon) => {
              return (
                <Row className='border mb-2 p-2 rounded'>
                  <Col>
                    <Row>
                      <Col>
                        <Row>
                          <h6>{coupon?.title}</h6>
                        </Row>
                        {coupon?.store?._id && (
                          <div>
                            <small>
                              Ưu đãi cho đơn cửa hàng từ{' '}
                              {formatCurrency(coupon?.minValue)}đ.
                              <br />
                              Áp dụng từ{' '}
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
                      </Col>
                      <Col xs={4}>
                        <Image
                          src={coupon?.image}
                          className='w-100 rounded mb-2'
                        />
                        <Button
                          variant='outline-primary'
                          className='fw-bold w-100'
                          onClick={() => handleCouponButtonClick(coupon)}
                        >
                          <small>Sử dụng</small>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              );
            })}
            {!loading && coupons.length === 0 && <p>Không có ưu đãi nào</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShow(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StoreCouponModal;
