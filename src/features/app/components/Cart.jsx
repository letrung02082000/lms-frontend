import React, { useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import CartItem from './CartItem';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCart } from 'store/cart';
import { formatCurrency } from 'utils/commonUtils';
import { useLocation } from 'react-router-dom';
import { couponUnit } from 'constants/coupon';

function Cart({ setCouponCode }) {
  const cart = useSelector(selectCart);
  const location = useLocation();
  const total = cart?.data?.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0
  );
  const [msg, setMsg] = React.useState('');
  const [discount, setDiscount] = React.useState(0);

  useEffect(() => {
    if (!location?.state?.coupon) return;
    const coupon = location?.state?.coupon;
    setDiscount(0);

    let invalidStore = [];
    cart?.data?.map((val) => {
      if (val?.store?._id !== coupon?.store?._id)
        return invalidStore.push(val?.store?.name);
    });

    if (invalidStore.length)
      return setMsg(
        `Mã giảm giá không áp dụng cho các sản phẩm từ cửa hàng ${invalidStore[0]}`
      );

    if (coupon?.minValue > total)
      return setMsg(
        `Đơn hàng phải từ ${formatCurrency(
          coupon?.minValue
        )}đ trở lên để sử dụng mã giảm giá.`
      );

    if (!coupon?.available) return setMsg('Mã giảm giá không hợp lệ');

    if(new Date(coupon?.validFrom) > Date.now())
      return setMsg('Mã giảm giá chưa có hiệu lực');

    if(new Date(coupon?.validUntil) < Date.now())
      return setMsg('Mã giảm giá đã hết hạn');

    setMsg(
      `Giảm ${coupon?.amount}${
        coupon?.unit === couponUnit.PERCENT ? '%' : 'đ'
      } cho đơn hàng từ ${formatCurrency(coupon?.minValue)}đ.`
    );

    setDiscount(
      coupon?.unit === couponUnit.PERCENT
        ? (total * coupon?.amount) / 100
        : coupon?.amount
    );

    setCouponCode(coupon?.code);
  }, [location?.state?.coupon, cart]);

  return (
    <Styles>
      <Row className='py-3'>
        <Col>
          {cart?.data?.map((val, idx) => (
            <CartItem key={val?._id} {...val} idx={idx} />
          ))}
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
            {msg && <small className='w-100 text-warning'>{msg}</small>}
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
            <strong>{formatCurrency(Math.floor((total-discount) / 1000))}</strong> điểm
            tích luỹ theo số điện thoại đặt hàng khi đơn hàng hoàn tất.
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
    /* border-bottom: ${(props) => `1px solid ${props.theme.colors.gainsboro}`}; */
  }
`;
