import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import CartItem from './CartItem';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCart } from 'store/cart';
import { formatCurrency } from 'utils/commonUtils';
import { useLocation } from 'react-router-dom';
import { couponUnit } from 'constants/coupon';
import { MdDiscount } from 'react-icons/md';

function Cart({ setCouponCode }) {
  const cart = useSelector(selectCart);
  const location = useLocation();
  const [couponByStoreId, setCouponByStoreId] = React.useState({});
  const [coupons, setCoupons] = useState(location?.state?.coupon ? [location?.state?.coupon] : []);
  const total = cart?.data?.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0
  );
  const discount = coupons?.reduce((acc, cur) => acc + cur.amount, 0);

  const productByStoreId = useMemo(() => {
    const productByStoreId = {};
    cart?.data?.forEach((item) => {
      const currentStores = Object.keys(productByStoreId);

      if (!currentStores.includes(item?.store?._id)) {
        productByStoreId[item?.store?._id] = [item];
      } else {
        productByStoreId[item?.store?._id].push(item);
      }
    });
    return productByStoreId;
  }, [cart]);

  useEffect(() => {
    coupons.map((coupon) => {
      const storeId = coupon?.store?._id;
      setCouponByStoreId((prev) => ({
        ...prev,
        [storeId]: coupon,
      }));
    });
  }, [coupons?.length]);  

  return (
    <Styles>
      <Row className='py-3'>
        <Col>
          {productByStoreId &&
            Object.keys(productByStoreId).map((storeId) => {
              const coupon = couponByStoreId[storeId];
    const total = productByStoreId[storeId].reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0
    );
    let msg = '';

    if (coupon) {
      if (coupon?.minValue > total)
        msg = `Đơn cửa hàng phải từ ${formatCurrency(
          coupon?.minValue
        )}đ trở lên để sử dụng mã giảm giá.`;

      if (!coupon?.available) msg = 'Mã giảm giá không hợp lệ';

      if (new Date(coupon?.validFrom) > Date.now())
        msg = 'Mã giảm giá chưa có hiệu lực';

      if (new Date(coupon?.validUntil) < Date.now())
        msg = 'Mã giảm giá đã hết hạn';

      if (coupon?.amount) {
        msg = `${coupon?.code} Giảm ${coupon?.amount}${
          coupon?.unit === couponUnit.PERCENT ? '%' : 'đ'
        } cho đơn cửa hàng từ ${formatCurrency(coupon?.minValue)}đ. `;
      }
    }

              return (
                <div key={storeId}>
                  <h5 className='mt-3 mb-0'>
                    {productByStoreId[storeId][0]?.store?.name}
                  </h5>
                  {coupon ? (
                    <>
                      <small className='text-primary'>
                        <MdDiscount /> {msg}
                        <small className='fw-bold'>Cập nhật mã</small>
                      </small>
                    </>
                  ) : (
                    <>
                      <small className='text-primary'>
                        Bạn có mã giảm giá?{' '}
                      </small>
                      <small className='text-primary fw-bold'>
                        Nhập mã ngay
                      </small>
                    </>
                  )}
                  {productByStoreId[storeId].map((product, idx) => (
                    <CartItem key={product?._id} {...product} idx={idx} />
                  ))}
                </div>
              );
            })}
        </Col>
      </Row>

      <Row className='my-2'>
        <Col>
          <Row>
            <Col xs={7}>
              <div>Giảm giá</div>
            </Col>
            <Col xs={5}>
              <span className='text-center w-100'>
                - {formatCurrency(discount)} ₫
              </span>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className='my-2'>
        <Col xs={7}>
          <div>Tổng cộng</div>
        </Col>
        <Col xs={5}>
          <div>
            <p className='fw-bold'>{formatCurrency(total - discount)} ₫</p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <p className='text-primary'>
            Bạn sẽ có{' '}
            <strong>
              {formatCurrency(Math.floor((total - discount) / 1000))}
            </strong>{' '}
            điểm tích luỹ theo số điện thoại đặt hàng khi đơn hàng hoàn tất.
          </p>
        </Col>
      </Row>
    </Styles>
  );
}

export default Cart;

const Styles = styled.div`
  border: ${(props) => `1px solid ${props.theme.colors.teal}`};
  height: 100%;
  border-radius: 0.5rem;

  .cart-title {
    height: 10%;
    padding: 0.5rem;
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.gray};
    font-weight: bold;
    border-bottom: ${(props) => `1px solid ${props.theme.colors.gainsboro}`};
  }

  .cart-footer {
    max-height: 10%;
  }

  .product-list {
    max-height: 80%;
    overflow-y: scroll;
    overflow-x: hidden;
    /* border-bottom: ${(props) =>
      `1px solid ${props.theme.colors.gainsboro}`}; */
  }
`;
