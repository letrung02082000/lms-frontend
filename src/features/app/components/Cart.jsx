import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import CartItem from './CartItem';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCart } from 'store/cart';
import { formatCurrency } from 'utils/commonUtils';

function Cart() {
  const cart = useSelector(selectCart);
  const total = cart?.data?.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  
  return (
    <Styles>
      <Row>
        <div className='cart-title'>Giỏ hàng của tôi</div>
      </Row>
      <Row className='product-list mb-2 py-2'>
        <Col>
          {cart?.data?.map((val, idx) => (
            <CartItem key={val?._id} {...val} idx={idx} />
          ))}
        </Col>
      </Row>
      <Row className='cart-footer pt-2'>
          <Col xs={8}>
            <div>Tổng cộng</div>
          </Col>
          <Col xs={4}>
            <div className='fw-bold'>{formatCurrency(total)} ₫</div>
          </Col>
        </Row>
    </Styles>
  );
}

export default Cart;

const Styles = styled.div`
  border: ${(props) => `1px solid ${props.theme.colors.gainsboro}`};
  height: 100%;

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
    border-bottom: ${(props) => `1px solid ${props.theme.colors.gainsboro}`};
  }
`;
