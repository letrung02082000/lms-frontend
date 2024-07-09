import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart, deleteFromCart, removeFromCart } from 'store/cart';
import styled from 'styled-components';
import { formatCurrency } from 'utils/commonUtils';
import { CiCircleMinus, CiCirclePlus, CiSquareMinus, CiSquarePlus } from 'react-icons/ci';
import theme from 'constants/theme';

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
                <CiSquareMinus color={theme.colors.teal} />
              </Button>
            </Col>
            <Col xs={3}>
              <span>{quantity}</span>
            </Col>
            <Col xs={3}>
              <Button variant='light' className='p-0' onClick={handleAddButton}>
                <CiSquarePlus color={theme.colors.teal} />
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
    background-color: ${({ theme }) => theme.colors.teal};
    color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    height: 1.3rem;
    width: 1.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .product-name {
    color: ${(props) => props.theme.colors.gray};
    padding: 0 0.5rem;
  }

  .bi-dash,
  .bi-plus {
    color: ${({ theme }) => theme.colors.blueGray};
    background-color: ${({ theme }) => theme.colors.lightGray};
    border-radius: 3px;
  }
`;
