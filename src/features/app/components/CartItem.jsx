import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart, deleteFromCart, removeFromCart } from 'store/cart';
import styled from 'styled-components';
import { formatCurrency } from 'utils/commonUtils';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';

function CartItem(props) {
  const { idx, name, price, quantity } = props;
  const dispatch = useDispatch();

  const handleMinusButton = () => {
    dispatch(removeFromCart(props));
  };

  const handleAddButton = () => {
    dispatch(addToCart(props));
  };

  const handleDeleteButton = () => {
    dispatch(deleteFromCart(props));
  };

  return (
    <Styles>
      <Row className='product-line align-items-center'>
        <Col xs={1}>
          <div className='product-no'>{idx + 1}</div>
        </Col>
        <Col xs={6}>
          <div className='product-name'>{name}</div>
        </Col>
        <Col>
          <Row>
            <span>
              {formatCurrency(price)} ₫ x {quantity}
            </span>
          </Row>
          <Row className='align-items-end'>
            <Col xs={3}>
              <Button
                variant='light'
                className='p-0'
                onClick={handleMinusButton}
              >
                <CiCircleMinus color='red' />
              </Button>
            </Col>
            <Col xs={3}>
              <span>{quantity}</span>
            </Col>
            <Col xs={3}>
              <Button variant='light' className='p-0' onClick={handleAddButton}>
                <CiCirclePlus color='red' />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Styles>
  );
}

export default CartItem;

const Styles = styled.div`
  .product-no {
    background-color: ${({ theme }) => theme.colors.vividRed};
    color: ${({ theme }) => theme.colors.white};
    font-weight: bold;
    border-radius: 50%;
    height: 1.8rem;
    width: 1.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .product-name {
    color: ${(props) => props.theme.colors.gray};
    font-weight: bold;
    padding: 0 0.5rem;
  }

  .bi-dash,
  .bi-plus {
    color: ${({ theme }) => theme.colors.blueGray};
    background-color: ${({ theme }) => theme.colors.lightGray};
    border-radius: 3px;
  }
`;
